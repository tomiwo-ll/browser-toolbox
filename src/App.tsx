import { tools } from "./data/tools";

const repoUrl = "https://github.com/tomiwo-ll/browser-toolbox";

export function App() {
  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="app-title">
        <p className="product-name" id="app-title">
          Browser Toolbox
        </p>
        <p className="lead">
          ファイル操作ツールの置き場です。このページ上で動作するツールたちはブラウザ上で全ての処理が完結し、
          入力された内容を外部へ送信、保存しません。
        </p>
        <p className="repo-link">
          built from{" "}
          <a href={repoUrl} rel="noreferrer" target="_blank">
            {repoUrl}
          </a>
        </p>
      </section>

      <section className="tool-section" aria-label="Tools">
        <div className="tool-grid">
          {tools.map((tool) => (
            <article className="tool-card" key={tool.id}>
              <div className="tool-card__header">
                <h3>{tool.name}</h3>
                <span className={`status status--${tool.status}`}>
                  {tool.status === "available" ? "利用可能" : "準備中"}
                </span>
              </div>
              <p>{tool.summary}</p>
              <dl className="tool-meta">
                <div>
                  <dt>入力</dt>
                  <dd>{tool.inputTypes.join(" / ")}</dd>
                </div>
                <div>
                  <dt>出力</dt>
                  <dd>{tool.outputTypes.join(" / ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
