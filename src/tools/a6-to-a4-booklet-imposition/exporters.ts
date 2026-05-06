import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import {
  A4_SIZE_MM,
  A4_SIZE_PX,
  A6_SIZE_PX,
  GUIDE_LINE_COLOR,
  GUIDE_LINE_WIDTH_PX,
  MM_PER_INCH
} from "./constants";
import type { ImposedSheetSide, ImpositionPage } from "./imposition";
import { imposePages } from "./imposition";
import type { BindingDirection } from "./imposition";
import type { SourcePage } from "./fileInput";

export type OutputFormat = "pdf" | "zip-jpg";

export type ExportOptions = {
  binding: BindingDirection;
  preserveFinalPage: boolean;
  outputFormat: OutputFormat;
  signal?: AbortSignal;
};

const PDF_POINTS_PER_INCH = 72;
const A4_SIZE_POINTS = {
  width: (A4_SIZE_MM.width / MM_PER_INCH) * PDF_POINTS_PER_INCH,
  height: (A4_SIZE_MM.height / MM_PER_INCH) * PDF_POINTS_PER_INCH
};

export async function exportImposedBooklet(
  sourcePages: SourcePage[],
  options: ExportOptions
): Promise<Blob> {
  const imposedSides = imposePages(sourcePages.length, {
    binding: options.binding,
    preserveFinalPage: options.preserveFinalPage
  });

  if (options.outputFormat === "zip-jpg") {
    return exportZip(sourcePages, imposedSides, options.signal);
  }

  return exportPdf(sourcePages, imposedSides, options.signal);
}

async function exportPdf(
  sourcePages: SourcePage[],
  imposedSides: ImposedSheetSide[],
  signal?: AbortSignal
): Promise<Blob> {
  const pdf = await PDFDocument.create();

  for (const side of imposedSides) {
    throwIfAborted(signal);
    const canvas = renderSheetSide(sourcePages, side);
    const imageBytes = dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.94));
    const image = await pdf.embedJpg(imageBytes);
    const page = pdf.addPage([A4_SIZE_POINTS.width, A4_SIZE_POINTS.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: A4_SIZE_POINTS.width,
      height: A4_SIZE_POINTS.height
    });
  }

  const bytes = await pdf.save();
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

async function exportZip(
  sourcePages: SourcePage[],
  imposedSides: ImposedSheetSide[],
  signal?: AbortSignal
): Promise<Blob> {
  const zip = new JSZip();

  for (const side of imposedSides) {
    throwIfAborted(signal);
    const canvas = renderSheetSide(sourcePages, side);
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.94);
    const sheetNumber = String(side.sheetIndex + 1).padStart(3, "0");
    zip.file(`sheet-${sheetNumber}-${side.side}.jpg`, blob);
  }

  return zip.generateAsync({ type: "blob" });
}

export function renderSheetSide(
  sourcePages: SourcePage[],
  side: ImposedSheetSide
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = A4_SIZE_PX.width;
  canvas.height = A4_SIZE_PX.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvasを初期化できませんでした。");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawSlot(context, sourcePages, side.placement.topLeft, 0, centerY() - A6_SIZE_PX.height, false);
  drawSlot(
    context,
    sourcePages,
    side.placement.topRight,
    centerX(),
    centerY() - A6_SIZE_PX.height,
    false
  );
  drawSlot(context, sourcePages, side.placement.bottomLeft, 0, centerY(), true);
  drawSlot(context, sourcePages, side.placement.bottomRight, centerX(), centerY(), true);
  drawGuides(context);

  return canvas;
}

function drawGuides(context: CanvasRenderingContext2D): void {
  context.save();
  context.strokeStyle = GUIDE_LINE_COLOR;
  context.lineWidth = GUIDE_LINE_WIDTH_PX;
  context.beginPath();
  context.moveTo(centerX(), 0);
  context.lineTo(centerX(), A4_SIZE_PX.height);
  context.moveTo(0, centerY());
  context.lineTo(A4_SIZE_PX.width, centerY());
  context.stroke();
  context.restore();
}

function drawSlot(
  context: CanvasRenderingContext2D,
  sourcePages: SourcePage[],
  page: ImpositionPage,
  x: number,
  y: number,
  upsideDown: boolean
): void {
  if (page.kind === "blank") {
    return;
  }

  const source = sourcePages[page.sourceIndex];
  if (!source) {
    return;
  }

  context.save();
  if (upsideDown) {
    context.translate(x + A6_SIZE_PX.width / 2, y + A6_SIZE_PX.height / 2);
    context.rotate(Math.PI);
    drawContainedImage(context, source, -A6_SIZE_PX.width / 2, -A6_SIZE_PX.height / 2);
  } else {
    drawContainedImage(context, source, x, y);
  }
  context.restore();
}

function drawContainedImage(
  context: CanvasRenderingContext2D,
  source: SourcePage,
  x: number,
  y: number
): void {
  const scale = Math.min(A6_SIZE_PX.width / source.width, A6_SIZE_PX.height / source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  const dx = x + (A6_SIZE_PX.width - width) / 2;
  const dy = y + (A6_SIZE_PX.height - height) / 2;

  context.drawImage(source.image, dx, dy, width, height);
}

function centerX(): number {
  return Math.round(A4_SIZE_PX.width / 2);
}

function centerY(): number {
  return Math.round(A4_SIZE_PX.height / 2);
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("画像出力に失敗しました。"));
        }
      },
      type,
      quality
    );
  });
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("処理をキャンセルしました。", "AbortError");
  }
}
