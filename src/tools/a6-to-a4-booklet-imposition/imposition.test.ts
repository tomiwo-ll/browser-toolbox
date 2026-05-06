import { describe, expect, it } from "vitest";
import {
  describePage,
  imposePages,
  padToBookletMultiple,
  preparePages,
  createLogicalPages
} from "./imposition";

function row(side: ReturnType<typeof imposePages>[number], position: "top" | "bottom") {
  const { placement } = side;
  const left = position === "top" ? placement.topLeft : placement.bottomLeft;
  const right = position === "top" ? placement.topRight : placement.bottomRight;
  return `${describePage(left)},${describePage(right)}`;
}

describe("A6 to A4 booklet imposition", () => {
  it("generates the right-binding 16 page sample", () => {
    const imposed = imposePages(16, {
      binding: "right",
      preserveFinalPage: false
    });

    expect(row(imposed[0], "top")).toBe("1,16");
    expect(row(imposed[0], "bottom")).toBe("4,13");
    expect(row(imposed[1], "top")).toBe("15,2");
    expect(row(imposed[1], "bottom")).toBe("14,3");
    expect(row(imposed[2], "top")).toBe("5,12");
    expect(row(imposed[2], "bottom")).toBe("8,9");
    expect(row(imposed[3], "top")).toBe("11,6");
    expect(row(imposed[3], "bottom")).toBe("10,7");
  });

  it("mirrors left-binding placement horizontally", () => {
    const right = imposePages(16, {
      binding: "right",
      preserveFinalPage: false
    });
    const left = imposePages(16, {
      binding: "left",
      preserveFinalPage: false
    });

    expect(describePage(left[0].placement.topLeft)).toBe(
      describePage(right[0].placement.topRight)
    );
    expect(describePage(left[0].placement.bottomRight)).toBe(
      describePage(right[0].placement.bottomLeft)
    );
  });

  it("adds blanks after the final page by default", () => {
    const pages = padToBookletMultiple(createLogicalPages(11), false);

    expect(pages.map(describePage)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "blank"
    ]);
  });

  it("can preserve the final page as the booklet final page", () => {
    const pages = padToBookletMultiple(createLogicalPages(11), true);

    expect(pages.map(describePage)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "blank",
      "11"
    ]);
  });

  it("pads physical sheets to complete A4 duplex surfaces", () => {
    const pages = preparePages(11, false);

    expect(pages).toHaveLength(16);
    expect(pages.slice(11).map(describePage)).toEqual([
      "blank",
      "blank",
      "blank",
      "blank",
      "blank"
    ]);
  });
});
