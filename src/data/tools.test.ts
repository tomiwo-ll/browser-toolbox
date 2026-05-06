import { describe, expect, it } from "vitest";
import { tools } from "./tools";

describe("tools registry", () => {
  it("keeps tool ids unique", () => {
    const ids = tools.map((tool) => tool.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("allows output formats other than PDF", () => {
    const outputTypes = new Set(tools.flatMap((tool) => tool.outputTypes));

    expect(outputTypes.has("PDF")).toBe(true);
    expect(outputTypes.size).toBeGreaterThan(1);
  });

  it("includes the A6 to A4 booklet imposition tool", () => {
    expect(tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "a6-to-a4-booklet-imposition",
          inputTypes: expect.arrayContaining(["JPG", "PNG", "PDF"]),
          outputTypes: expect.arrayContaining(["PDF", "ZIP(JPG)"])
        })
      ])
    );
  });
});
