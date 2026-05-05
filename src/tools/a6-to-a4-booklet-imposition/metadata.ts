import { TOOL_ID } from "./constants";

export const a6ToA4BookletMetadata = {
  id: TOOL_ID,
  name: "A6冊子 A4面付け",
  version: "0.1.0",
  changelog: [
    {
      version: "0.1.0",
      date: "2026-05-06",
      title: "初期版",
      changes: ["A6冊子向けA4両面面付け仕様を定義"]
    }
  ]
} as const;
