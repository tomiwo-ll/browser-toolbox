export type BindingDirection = "right" | "left";
export type SheetSide = "front" | "back";

export type LogicalPage = {
  kind: "page";
  sourceIndex: number;
};

export type BlankPage = {
  kind: "blank";
};

export type ImpositionPage = LogicalPage | BlankPage;

export type SheetPlacement = {
  topLeft: ImpositionPage;
  topRight: ImpositionPage;
  bottomLeft: ImpositionPage;
  bottomRight: ImpositionPage;
};

export type ImposedSheetSide = {
  sheetIndex: number;
  side: SheetSide;
  placement: SheetPlacement;
};

const blank = (): BlankPage => ({ kind: "blank" });

export function createLogicalPages(pageCount: number): LogicalPage[] {
  return Array.from({ length: pageCount }, (_, index) => ({
    kind: "page",
    sourceIndex: index
  }));
}

export function padToBookletMultiple(
  pages: ImpositionPage[],
  preserveFinalPage: boolean
): ImpositionPage[] {
  const remainder = pages.length % 4;
  if (remainder === 0) {
    return [...pages];
  }

  const blankCount = 4 - remainder;
  if (!preserveFinalPage || pages.length === 0) {
    return [...pages, ...Array.from({ length: blankCount }, blank)];
  }

  const finalPage = pages[pages.length - 1];
  return [
    ...pages.slice(0, -1),
    ...Array.from({ length: blankCount }, blank),
    finalPage
  ];
}

export function padToPhysicalSheets(pages: ImpositionPage[]): ImpositionPage[] {
  const remainder = pages.length % 8;
  if (remainder === 0) {
    return [...pages];
  }

  return [...pages, ...Array.from({ length: 8 - remainder }, blank)];
}

export function preparePages(
  pageCount: number,
  preserveFinalPage: boolean
): ImpositionPage[] {
  return padToPhysicalSheets(
    padToBookletMultiple(createLogicalPages(pageCount), preserveFinalPage)
  );
}

export function imposePages(
  sourcePageCount: number,
  options: {
    binding: BindingDirection;
    preserveFinalPage: boolean;
  }
): ImposedSheetSide[] {
  const pages = preparePages(sourcePageCount, options.preserveFinalPage);
  const sheetCount = pages.length / 8;

  return Array.from({ length: sheetCount }, (_, sheetIndex) => {
    const start = 1 + sheetIndex * 4;
    const end = pages.length - sheetIndex * 4;

    const front = createSheetSide(sheetIndex, "front", {
      topLeft: pageAt(pages, start),
      topRight: pageAt(pages, end),
      bottomLeft: pageAt(pages, start + 3),
      bottomRight: pageAt(pages, end - 3)
    });

    const back = createSheetSide(sheetIndex, "back", {
      topLeft: pageAt(pages, end - 1),
      topRight: pageAt(pages, start + 1),
      bottomLeft: pageAt(pages, end - 2),
      bottomRight: pageAt(pages, start + 2)
    });

    if (options.binding === "left") {
      return [mirrorSheetSide(front), mirrorSheetSide(back)];
    }

    return [front, back];
  }).flat();
}

function pageAt(pages: ImpositionPage[], oneBasedPage: number): ImpositionPage {
  return pages[oneBasedPage - 1] ?? blank();
}

function createSheetSide(
  sheetIndex: number,
  side: SheetSide,
  placement: SheetPlacement
): ImposedSheetSide {
  return { sheetIndex, side, placement };
}

function mirrorSheetSide(sheetSide: ImposedSheetSide): ImposedSheetSide {
  const { placement } = sheetSide;
  return {
    ...sheetSide,
    placement: {
      topLeft: placement.topRight,
      topRight: placement.topLeft,
      bottomLeft: placement.bottomRight,
      bottomRight: placement.bottomLeft
    }
  };
}

export function describePage(page: ImpositionPage): string {
  return page.kind === "blank" ? "blank" : String(page.sourceIndex + 1);
}
