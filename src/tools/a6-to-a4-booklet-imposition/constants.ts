export const TOOL_ID = "a6-to-a4-booklet-imposition";

export const MM_PER_INCH = 25.4;
export const OUTPUT_DPI = 300;

export const A4_SIZE_MM = {
  width: 210,
  height: 297
} as const;

export const A6_SIZE_MM = {
  width: 105,
  height: 148
} as const;

export const A4_SIZE_PX = {
  width: Math.round((A4_SIZE_MM.width / MM_PER_INCH) * OUTPUT_DPI),
  height: Math.round((A4_SIZE_MM.height / MM_PER_INCH) * OUTPUT_DPI)
} as const;

export const A6_SIZE_PX = {
  width: Math.round((A6_SIZE_MM.width / MM_PER_INCH) * OUTPUT_DPI),
  height: Math.round((A6_SIZE_MM.height / MM_PER_INCH) * OUTPUT_DPI)
} as const;

export const GUIDE_LINE_WIDTH_PX = Math.round((2 / 72) * OUTPUT_DPI);
export const GUIDE_LINE_COLOR = "#d6d6d6";

export const RECOMMENDED_PAGE_LIMIT = 64;
export const HARD_PDF_PAGE_LIMIT = 128;
