import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlackboardDemo from './BlackboardDemo';
import MarkdownEditor from './MarkdownEditor';
import ChemicalFormulaTest from './ChemicalFormulaTest';
import CurlyBraceDemo from './CurlyBraceDemo';
import RoughJSDemo from './RoughJSDemo';
import ChalkStaticDemo from './ChalkStaticDemo';
import Book3DDemo from './Book3DDemo';
import './AppRouter.css';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="navigation">
          <div className="nav-container">
            <h1 className="nav-title">黑板板书</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">首页</Link>
              <Link to="/blackboard" className="nav-link">黑板板书</Link>
              <Link to="/markdown" className="nav-link">Markdown编辑器</Link>
              <Link to="/chemical" className="nav-link">化学公式测试</Link>
              <Link to="/braces" className="nav-link">大括号演示</Link>
              <Link to="/chalk" className="nav-link">粉笔静态演示</Link>
              <Link to="/book3d" className="nav-link">3D翻书效果</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="home-page">
                <h1>欢迎使用黑板板书系统</h1>
                <p>这是一个集成了多种功能的黑板板书演示系统</p>
                <div className="feature-grid">
                  <div className="feature-card">
                    <h3>黑板板书</h3>
                    <p>不规则贴纸高亮 + 手绘圈选功能</p>
                    <Link to="/blackboard" className="feature-link">开始使用</Link>
                  </div>
                  <div className="feature-card">
                    <h3>Markdown编辑器</h3>
                    <p>支持数学公式和代码高亮的编辑器</p>
                    <Link to="/markdown" className="feature-link">开始使用</Link>
                  </div>
                  <div className="feature-card">
                    <h3>化学公式测试</h3>
                    <p>化学公式的测试和展示</p>
                    <Link to="/chemical" className="feature-link">开始使用</Link>
                  </div>
                  <div className="feature-card">
                    <h3>大括号自适应</h3>
                    <p>根据内容高度自适应伸缩的大括号组件</p>
                    <Link to="/braces" className="feature-link">开始使用</Link>
                  </div>
                  <div className="feature-card">
                    <h3>RoughJS粉笔效果</h3>
                    <p>使用RoughJS实现真实的粉笔手绘效果，包括一笔成形的波浪线和椭圆圈选</p>
                    <Link to="/roughjs" className="feature-link">开始使用</Link>
                  </div>
                  <div className="feature-card">
                    <h3>粉笔静态演示</h3>
                    <p>不依赖鼠标绘制，直接在黑板上画出一条直线和一个圆圈</p>
                    <Link to="/chalk" className="feature-link">查看效果</Link>
                  </div>
                  <div className="feature-card">
                    <h3>3D翻书效果</h3>
                    <p>使用纯CSS和React实现的3D翻书动画，支持多页内容</p>
                    <Link to="/book3d" className="feature-link">开始体验</Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/blackboard" element={<BlackboardDemo />} />
            <Route path="/markdown" element={<MarkdownEditor />} />
            <Route path="/chemical" element={<ChemicalFormulaTest />} />
            <Route path="/braces" element={<CurlyBraceDemo />} />
            <Route path="/roughjs" element={<RoughJSDemo />} />
            <Route path="/chalk" element={<ChalkStaticDemo />} />
            <Route path="/book3d" element={<Book3DDemo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRouter;
