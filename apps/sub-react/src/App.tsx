import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.less";

function App() {
  return (
    <div className="react-app">
      <div className="app-header">
        <h2>React 子应用</h2>
        <p>
          这是一个基于 React 19 和 TypeScript 构建的现代化子应用，运行在 qiankun
          微前端架构中。
        </p>
      </div>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="home-section">
      <h3>React 子应用首页</h3>
      <p>
        欢迎来到 React 子应用！这是一个功能丰富的现代化应用，展示了 React 19
        的最新特性。
      </p>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">⚛️</div>
          <h4>React 19</h4>
          <p>使用最新的 React 19 版本，享受更好的性能和开发体验</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h4>Less 样式</h4>
          <p>采用 Less 预处理器，提供更强大的样式管理能力</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h4>微前端架构</h4>
          <p>基于 qiankun 微前端框架，实现应用间的独立开发和部署</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h4>响应式设计</h4>
          <p>完全响应式设计，在各种设备上都能提供优秀的用户体验</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4>高性能</h4>
          <p>优化的代码结构和现代化的构建工具，确保应用的高性能</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛠️</div>
          <h4>TypeScript</h4>
          <p>使用 TypeScript 提供类型安全，提高代码质量和开发效率</p>
        </div>
      </div>

      <a href="#" className="cta-button">
        <span>了解更多</span>
        <span>→</span>
      </a>
    </div>
  );
}

export default App;
