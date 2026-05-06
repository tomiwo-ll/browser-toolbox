import { useRef, useState } from "react";
import { RECOMMENDED_PAGE_LIMIT } from "./constants";
import { exportImposedBooklet, type OutputFormat } from "./exporters";
import { loadFilesAsPages, ToolInputError, type SourcePage } from "./fileInput";
import type { BindingDirection } from "./imposition";
import { a6ToA4BookletMetadata } from "./metadata";

type ProcessingState = "idle" | "loading" | "exporting";

export function A6ToA4BookletTool() {
  const [pages, setPages] = useState<SourcePage[]>([]);
  const [binding, setBinding] = useState<BindingDirection>("right");
  const [preserveFinalPage, setPreserveFinalPage] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pdf");
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const isBusy = processingState !== "idle";
  const pageWarning =
    pages.length >= RECOMMENDED_PAGE_LIMIT
      ? `${RECOMMENDED_PAGE_LIMIT}ページ程度を推奨上限としています。処理に時間がかかる場合があります。`
      : "";

  async function handleFiles(files: FileList | null) {
    setError("");
    setMessage("");
    if (!files || files.length === 0) {
      setPages([]);
      return;
    }

    setProcessingState("loading");
    try {
      const loadedPages = await loadFilesAsPages([...files]);
      setPages(loadedPages);
      setMessage(`${loadedPages.length}ページを読み込みました。`);
    } catch (caught) {
      setPages([]);
      setError(errorMessage(caught));
    } finally {
      setProcessingState("idle");
    }
  }

  function movePage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= pages.length) {
      return;
    }

    setPages((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function handleExport() {
    if (pages.length === 0) {
      setError("先にJPG、PNG、PDFのいずれかを選択してください。");
      return;
    }

    setError("");
    setMessage("");
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setProcessingState("exporting");

    try {
      const blob = await exportImposedBooklet(pages, {
        binding,
        preserveFinalPage,
        outputFormat,
        signal: abortController.signal
      });
      downloadBlob(blob, outputFileName(outputFormat));
      setMessage("出力ファイルを作成しました。");
    } catch (caught) {
      if (abortController.signal.aborted) {
        setMessage("処理をキャンセルしました。");
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      abortControllerRef.current = null;
      setProcessingState("idle");
    }
  }

  function handleCancel() {
    abortControllerRef.current?.abort();
  }

  return (
    <main className="app-shell tool-page">
      <a className="back-link" href={`${baseUrl()}#`}>
        Tools
      </a>

      <section className="tool-hero" aria-labelledby="tool-title">
        <div>
          <p className="tool-version">v{a6ToA4BookletMetadata.version}</p>
          <h1 id="tool-title">{a6ToA4BookletMetadata.name}</h1>
          <p className="lead">
            A6サイズのページ画像を、A4用紙へまとめて配置するための面付けツールです。
          </p>
          <p className="tool-description">
            A6サイズで作成した同人誌を、A4用紙に面付けしてコピー本として印刷できる状態にします。A6-&gt;A5サイズの冊子オプションをサポートしていない一般的なコンビニプリンターでも、A6冊子を作成できます。
          </p>
          <p className="tool-description">
            A4の上下それぞれにA6冊子用のページが並べられ、印刷後は用紙の中央のガイド線に沿って真ん中で裁断し、
            ホチキス留めや折り作業を行う想定です。ガイド線を基準にページ位置を整えるため、下段のページは上下反転して配置されます。
          </p>
          <p className="tool-description">
            出力したPDFまたはZIP(JPG)をA4縦、両面印刷、長辺とじ、倍率100%で印刷してください。
          </p>
          <ul className="tool-description-list">
            <li>ページ数が足りない場合は、冊子として成立するように白紙ページを補完します。</li>
            <li>出力物のサイズはA4縦(210mm x 297mm)、300dpi相当です。</li>
          </ul>
          <p className="tool-description">
            処理はブラウザ内で完結し、入力内容を外部へ送信、保存しません。
          </p>
        </div>
      </section>

      <section className="tool-workspace" aria-label="A6冊子A4面付け">
        <div className="tool-panel">
          <label className="file-drop">
            <span>JPG / PNG / PDFを選択</span>
            <small>PDFは1ファイルのみ。画像は複数選択できます。</small>
            <input
              accept="image/jpeg,image/png,application/pdf"
              disabled={isBusy}
              multiple
              onChange={(event) => void handleFiles(event.target.files)}
              type="file"
            />
          </label>

          <fieldset className="control-group" disabled={isBusy}>
            <legend>綴じ方向</legend>
            <label>
              <input
                checked={binding === "right"}
                name="binding"
                onChange={() => setBinding("right")}
                type="radio"
              />
              右綴じ
            </label>
            <label>
              <input
                checked={binding === "left"}
                name="binding"
                onChange={() => setBinding("left")}
                type="radio"
              />
              左綴じ
            </label>
          </fieldset>

          <fieldset className="control-group" disabled={isBusy}>
            <legend>出力形式</legend>
            <label>
              <input
                checked={outputFormat === "pdf"}
                name="output"
                onChange={() => setOutputFormat("pdf")}
                type="radio"
              />
              PDF
            </label>
            <label>
              <input
                checked={outputFormat === "zip-jpg"}
                name="output"
                onChange={() => setOutputFormat("zip-jpg")}
                type="radio"
              />
              ZIP(JPG)
            </label>
          </fieldset>

          <label className="checkbox-control">
            <input
              checked={preserveFinalPage}
              disabled={isBusy}
              onChange={(event) => setPreserveFinalPage(event.target.checked)}
              type="checkbox"
            />
            最終ページを冊子の最終ページに置く
          </label>
          <p className="option-help">
            補完用の白紙ページが最終ページの前に挿入されるようになります
          </p>

          <div className="print-note">
            A4縦、両面印刷、長辺とじ、倍率100%、自動拡大縮小なしで印刷してください。
          </div>

          <div className="action-row">
            <button disabled={isBusy || pages.length === 0} onClick={() => void handleExport()}>
              {processingState === "exporting" ? "作成中" : "作成"}
            </button>
            <button disabled={!isBusy} onClick={handleCancel} type="button">
              キャンセル
            </button>
          </div>

          <details className="changelog">
            <summary>更新履歴</summary>
            {a6ToA4BookletMetadata.changelog.map((entry) => (
              <div key={entry.version}>
                <strong>
                  v{entry.version} {entry.title}
                </strong>
                <p>{entry.changes.join(" / ")}</p>
              </div>
            ))}
          </details>
        </div>

        <div className="page-list-panel">
          <div className="panel-heading">
            <h2>Pages</h2>
            <span>{pages.length} pages</span>
          </div>

          {message ? <p className="notice" role="status">{message}</p> : null}
          {pageWarning ? <p className="notice notice--warning">{pageWarning}</p> : null}
          {error ? <p className="notice notice--error" role="alert">{error}</p> : null}

          <ol className="page-list">
            {pages.map((page, index) => (
              <li key={page.id}>
                <span>
                  {String(index + 1).padStart(2, "0")} {page.name}
                </span>
                <div>
                  <button
                    disabled={isBusy || index === 0}
                    onClick={() => movePage(index, -1)}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    disabled={isBusy || index === pages.length - 1}
                    onClick={() => movePage(index, 1)}
                    type="button"
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

function outputFileName(outputFormat: OutputFormat): string {
  return outputFormat === "pdf"
    ? "a6-to-a4-booklet-imposition.pdf"
    : "a6-to-a4-booklet-imposition.zip";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function errorMessage(caught: unknown): string {
  if (caught instanceof ToolInputError) {
    return caught.message;
  }
  if (caught instanceof DOMException && caught.name === "AbortError") {
    return "処理をキャンセルしました。";
  }
  if (caught instanceof RangeError) {
    return "メモリ不足の可能性があります。ページ数や画像サイズを減らして再試行してください。";
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "処理に失敗しました。";
}

function baseUrl(): string {
  return import.meta.env.BASE_URL;
}
