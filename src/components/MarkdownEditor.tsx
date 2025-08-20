import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownEditorProps {
  initialContent?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialContent = `# 化学公式示例

## 基础化学公式

水分子：H2O
二氧化碳：CO2
氢离子：H+
氢氧根离子：OH-
氯化钠：NaCl
硫酸：H2SO4
氢氧化钠：NaOH
盐酸：HCl
钙离子：Ca2+
铁离子：Fe3+
硫酸铜：CuSO4

## 化学反应示例

### 酸碱中和反应
NaOH + HCl → NaCl + H2O

### 水的电离
H2O ⇌ H+ + OH-

### 氧化还原反应
Fe + CuSO4 → FeSO4 + Cu

## 数学公式示例

### 化学平衡常数
$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$

### pH值计算
$pH = -\\log[H^+]$

### 理想气体方程
$PV = nRT$

### 阿伦尼乌斯方程
$k = Ae^{-\\frac{E_a}{RT}}$

## 代码示例

\`\`\`javascript
// 计算pH值
function calculatePH(hydrogenIonConcentration) {
  return -Math.log10(hydrogenIonConcentration);
}

// 计算化学平衡常数
function calculateEquilibriumConstant(concentrations, stoichiometry) {
  let numerator = 1;
  let denominator = 1;
  
  stoichiometry.forEach((coeff, index) => {
    if (coeff > 0) {
      numerator *= Math.pow(concentrations[index], coeff);
    } else {
      denominator *= Math.pow(concentrations[index], -coeff);
    }
  });
  
  return numerator / denominator;
}
\`\`\`

## 表格示例

| 化合物 | 化学式 | 分子量 | 状态 |
|--------|--------|--------|------|
| 水 | H2O | 18.02 | 液态 |
| 二氧化碳 | CO2 | 44.01 | 气态 |
| 硫酸 | H2SO4 | 98.08 | 液态 |
| 氯化钠 | NaCl | 58.44 | 固态 |

## 列表

- 无机化合物
  - 氧化物 (如 CO2, Fe2O3)
  - 酸 (如 HCl, H2SO4)
  - 碱 (如 NaOH, KOH)
  - 盐 (如 NaCl, CuSO4)
- 有机化合物
  - 烃类 (如 CH4, C2H6)
  - 醇类 (如 CH3OH, C2H5OH)
  - 酸类 (如 CH3COOH)

## 复杂化学式

- 水合硫酸铜：CuSO4·5H2O
- 过氧化氢：H2O2
- 碳酸钙：CaCO3
- 硝酸银：AgNO3
` 
}) => {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const clearContent = () => {
    setContent('');
  };

  const resetContent = () => {
    setContent(initialContent);
  };

  return (
    <div className="markdown-editor">
      <div className="editor-header mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Markdown + 化学公式编辑器</h1>
        <div className="flex space-x-2">
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isPreview 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isPreview ? '编辑模式' : '预览模式'}
          </button>
          <button
            onClick={clearContent}
            className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            清空
          </button>
          <button
            onClick={resetContent}
            className="px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors"
          >
            重置示例
          </button>
        </div>
      </div>

      <div className="editor-container">
        {!isPreview ? (
          <div className="input-section">
            <label htmlFor="markdown-input" className="block text-sm font-medium text-gray-700 mb-2">
              输入Markdown内容：
            </label>
            <textarea
              id="markdown-input"
              value={content}
              onChange={handleContentChange}
              placeholder="在这里输入Markdown内容，支持化学公式如H2O、CO2、H+等..."
              className="w-full h-96 p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        ) : (
          <div className="preview-section">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预览效果：
            </label>
            <div className="w-full min-h-96 p-4 border border-gray-300 rounded-md bg-white overflow-auto">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>

      <div className="editor-footer mt-4 text-sm text-gray-600">
        <p>💡 提示：</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>支持标准Markdown语法</li>
          <li>使用KaTeX自动渲染化学公式（H₂O、CO₂、H⁺、OH⁻等）</li>
          <li>支持数学公式（使用$包围，如 $E = mc^2$）</li>
          <li>支持代码高亮、表格、列表等格式</li>
          <li>支持复杂化学式（Ca²⁺、Fe³⁺、CuSO₄等）</li>
        </ul>
      </div>
    </div>
  );
};

export default MarkdownEditor;
