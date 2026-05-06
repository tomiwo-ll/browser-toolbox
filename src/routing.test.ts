import { describe, expect, it } from "vitest";
import { currentToolRouteFromLocation, toolHref } from "./routing";

describe("tool routing", () => {
  it("uses hash routes for tool pages", () => {
    expect(
      currentToolRouteFromLocation(
        {
          hash: "#/tools/a6-to-a4-booklet-imposition",
          pathname: "/browser-toolbox/"
        },
        "/browser-toolbox/"
      )
    ).toBe("/tools/a6-to-a4-booklet-imposition");
  });

  it("resolves the top page under the GitHub Pages base path", () => {
    expect(
      currentToolRouteFromLocation(
        {
          hash: "",
          pathname: "/browser-toolbox/"
        },
        "/browser-toolbox/"
      )
    ).toBe("/");
  });

  it("builds tool links under the configured base path", () => {
    expect(toolHref("/tools/a6-to-a4-booklet-imposition", "/browser-toolbox/")).toBe(
      "/browser-toolbox/#/tools/a6-to-a4-booklet-imposition"
    );
  });
});
