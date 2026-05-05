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
    id: "a5-images-to-print-layout",
    name: "A5画像 面付け",
    summary:
      "A5サイズの画像群をブラウザ内で並べ替え、A4印刷向けの成果物として出力します。",
    inputTypes: ["画像"],
    outputTypes: ["PDF"],
    path: "/tools/a5-images-to-print-layout",
    status: "planned"
  },
  {
    id: "local-file-workbench",
    name: "ローカルファイル処理",
    summary:
      "画像、PDF、テキスト、CSVなどを外部送信せずに加工するツール群の受け皿です。",
    inputTypes: ["画像", "PDF", "テキスト", "CSV"],
    outputTypes: ["PDF", "画像", "テキスト", "CSV", "ZIP"],
    path: "/tools",
    status: "planned"
  }
];

export const availableTools = tools.filter((tool) => tool.status === "available");
