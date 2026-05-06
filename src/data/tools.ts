export type ToolStatus = "available" | "planned";

export type ToolDefinition = {
  id: string;
  name: string;
  summary: string;
  inputTypes: string[];
  outputTypes: string[];
  path: string;
  status: ToolStatus;
};

export const tools: ToolDefinition[] = [
  {
    id: "a6-to-a4-booklet-imposition",
    name: "A6冊子 A4面付け",
    summary:
      "A6冊子向けの画像やPDFを、A4両面印刷用のPDFまたはZIP(JPG)へ面付けします。",
    inputTypes: ["JPG", "PNG", "PDF"],
    outputTypes: ["PDF", "ZIP(JPG)"],
    path: "/tools/a6-to-a4-booklet-imposition",
    status: "available"
  }
];

export const availableTools = tools.filter((tool) => tool.status === "available");
