import * as pdfjs from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import { A6_SIZE_PX, HARD_PDF_PAGE_LIMIT } from "./constants";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type SourcePage = {
  id: string;
  name: string;
  image: CanvasImageSource;
  width: number;
  height: number;
};

export class ToolInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolInputError";
  }
}

export async function loadFilesAsPages(files: File[]): Promise<SourcePage[]> {
  if (files.length === 0) {
    return [];
  }

  const pdfFiles = files.filter((file) => file.type === "application/pdf");
  if (pdfFiles.length > 0) {
    if (files.length > 1 || pdfFiles.length > 1) {
      throw new ToolInputError("PDFは1ファイルのみ選択できます。画像ファイルとPDFを混在できません。");
    }
    return loadPdfPages(pdfFiles[0]);
  }

  return Promise.all(files.map(loadImagePage));
}

async function loadImagePage(file: File): Promise<SourcePage> {
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    throw new ToolInputError("JPG、PNG、PDFのみ対応しています。");
  }

  const image = await createImageBitmap(file);
  return {
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    image,
    width: image.width,
    height: image.height
  };
}

async function loadPdfPages(file: File): Promise<SourcePage[]> {
  const data = await file.arrayBuffer();

  try {
    const document = await pdfjs.getDocument({
      data,
      password: "",
      stopAtErrors: true
    }).promise;

    if (document.numPages > HARD_PDF_PAGE_LIMIT) {
      throw new ToolInputError(
        `PDFのページ数が多すぎます。${HARD_PDF_PAGE_LIMIT}ページ以下のPDFを指定してください。`
      );
    }

    const firstPage = await document.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const pages: SourcePage[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = pageNumber === 1 ? firstPage : await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      if (!samePageSize(firstViewport, viewport)) {
        throw new ToolInputError("ページサイズが混在するPDFは対応していません。");
      }

      const scale = Math.min(
        A6_SIZE_PX.width / viewport.width,
        A6_SIZE_PX.height / viewport.height
      );
      const scaledViewport = page.getViewport({ scale });
      const canvas = documentCanvas(
        Math.max(1, Math.round(scaledViewport.width)),
        Math.max(1, Math.round(scaledViewport.height))
      );
      const context = canvas.getContext("2d");
      if (!context) {
        throw new ToolInputError("PDFページの描画に失敗しました。");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;

      pages.push({
        id: `${file.name}-page-${pageNumber}`,
        name: `${file.name} p.${pageNumber}`,
        image: canvas,
        width: canvas.width,
        height: canvas.height
      });
    }

    return pages;
  } catch (error) {
    if (error instanceof ToolInputError) {
      throw error;
    }

    const maybePdfError = error as { name?: string; message?: string };
    if (maybePdfError.name === "PasswordException") {
      throw new ToolInputError("暗号化またはパスワード付きPDFは対応していません。");
    }

    throw new ToolInputError(
      maybePdfError.message
        ? `PDFを読み込めませんでした: ${maybePdfError.message}`
        : "PDFを読み込めませんでした。"
    );
  }
}

function samePageSize(
  a: { width: number; height: number },
  b: { width: number; height: number }
): boolean {
  return Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5;
}

function documentCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
