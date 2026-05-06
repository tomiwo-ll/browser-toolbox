import { lazy, Suspense, useEffect, useState } from "react";
import { tools } from "./data/tools";

const A6ToA4BookletTool = lazy(() =>
  import("./tools/a6-to-a4-booklet-imposition/A6ToA4BookletTool").then((module) => ({
    default: module.A6ToA4BookletTool
  }))
);

const repoUrl = "https://github.com/tomiwo-ll/browser-toolbox";

export function App() {
  const currentRoute = useCurrentRoute();
  if (currentRoute === "/tools/a6-to-a4-booklet-imposition") {
    return (
      <Suspense fallback={<main className="app-shell">Loading tool...</main>}>
        <A6ToA4BookletTool />
      </Suspense>
    );
  }

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
            <a className="tool-card" href={toolHref(tool.path)} key={tool.id}>
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
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function useCurrentRoute(): string {
  const [route, setRoute] = useState(currentToolRoute);

  useEffect(() => {
    const updateRoute = () => setRoute(currentToolRoute());
    window.addEventListener("hashchange", updateRoute);
    window.addEventListener("popstate", updateRoute);
    return () => {
      window.removeEventListener("hashchange", updateRoute);
      window.removeEventListener("popstate", updateRoute);
    };
  }, []);

  return route;
}

function currentToolRoute(): string {
  if (window.location.hash.startsWith("#/")) {
    return window.location.hash.slice(1);
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return window.location.pathname.replace(base, "") || "/";
}

function toolHref(path: string): string {
  return `${import.meta.env.BASE_URL}#${path}`;
}
