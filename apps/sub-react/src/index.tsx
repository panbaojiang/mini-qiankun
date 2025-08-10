import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

let root: ReturnType<typeof ReactDOM.createRoot> | null = null;

function render(props: any = {}) {
  const { container } = props;

  if (root) {
    root.unmount();
  }

  const dom = container
    ? container.querySelector("#root")
    : document.getElementById("root");

  root = ReactDOM.createRoot(dom!);
  root.render(
    <React.StrictMode>
      <BrowserRouter
        basename={window.__POWERED_BY_QIANKUN__ ? "/sub-react" : "/"}
      >
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 生命周期函数
export async function bootstrap() {
  console.log("[react] react app bootstraped");
}

export async function mount(props: any) {
  console.log("[react] props from main framework", props);
  render(props);
}

export async function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}
