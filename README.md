# Markdown + 化学公式渲染器
<img width="1468" height="860" alt="image" src="https://github.com/user-attachments/assets/38bce6a4-b2ec-4328-a2e1-ab43afcd3e5e" />

一个基于React 18 + Vite的Markdown编辑器，支持化学公式的自动识别和渲染。

## ✨ 功能特性

- 📝 **Markdown编辑**: 支持标准Markdown语法
- 🧪 **化学公式渲染**: 自动识别并渲染常见化学公式
  - 支持下标显示 (如 H₂O, CO₂)
  - 支持上标显示 (如 H⁺, OH⁻)
  - 支持复杂化学式 (如 H₂SO₄, NaOH)
- 💻 **代码高亮**: 支持多种编程语言的语法高亮
- 📊 **表格支持**: 完整的表格渲染功能
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎨 **现代UI**: 使用Tailwind CSS构建的美观界面
- 📖 **图书翻页效果**：使用react-pageflip实现翻页

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```

## 🧪 支持的化学公式

### 基础分子
- **水**: H₂O
- **二氧化碳**: CO₂
- **氯化钠**: NaCl
- **硫酸**: H₂SO₄
- **氢氧化钠**: NaOH
- **盐酸**: HCl

### 离子
- **氢离子**: H⁺
- **氢氧根离子**: OH⁻
- **钙离子**: Ca²⁺
- **铁离子**: Fe³⁺

## 📝 Markdown语法支持

- 标题 (H1-H6)
- 列表 (有序/无序)
- 代码块 (支持语法高亮)
- 表格
- 引用块
- 粗体/斜体
- 链接和图片
- 任务列表
- 删除线

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **Markdown解析**: react-markdown
- **语法高亮**: rehype-highlight
- **化学公式**: 自定义渲染器

## 📁 项目结构

```
src/
├── components/
│   ├── MarkdownRenderer.tsx    # Markdown渲染组件
│   └── MarkdownEditor.tsx     # 编辑器主组件
├── App.tsx                     # 主应用组件
├── App.css                     # 应用样式
├── index.css                   # 全局样式
└── main.tsx                    # 应用入口
```

## 🎯 使用方法

1. **编辑模式**: 在左侧输入框中输入Markdown内容
2. **预览模式**: 点击"预览模式"按钮查看渲染效果
3. **化学公式**: 直接输入化学式如 `H2O`，系统会自动渲染为 `H₂O`
4. **代码高亮**: 使用 \`\`\`语言名 来指定代码块语言

## 🔧 自定义配置

### 添加新的化学公式支持

在 `MarkdownRenderer.tsx` 中的 `ChemicalFormula` 组件中添加新的公式模式：

```typescript
// 在检测模式中添加新公式
if (text.includes('H2O') || text.includes('CO2') || text.includes('新公式')) {
  // 处理逻辑
}
```

### 修改样式

- 化学公式样式: 修改 `.chemical-formula` CSS类
- 数学公式样式: 修改 `.math-formula` CSS类
- 整体布局: 修改 `App.css` 中的相关样式

## 📱 响应式支持

- 桌面端: 完整功能展示
- 平板端: 适配中等屏幕
- 移动端: 垂直布局，按钮全宽显示

## 🚀 部署

### Vercel部署
```bash
npm install -g vercel
vercel
```

### Netlify部署
```bash
npm run build
# 将dist文件夹部署到Netlify
```

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

---

**享受你的Markdown + 化学公式编辑体验！** 🎉
