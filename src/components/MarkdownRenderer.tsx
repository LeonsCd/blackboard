import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';



interface MarkdownRendererProps {
  content: string;
}

// 使用Unicode字符渲染化学公式
export const ChemicalFormula: React.FC<{ children: string }> = ({ children }) => {
  const [renderedFormula, setRenderedFormula] = useState<string>('');

  useEffect(() => {
    // 将化学公式转换为Unicode格式
    const unicodeFormula = convertToUnicode(children);
    setRenderedFormula(unicodeFormula);
  }, [children]);

  // 将化学公式转换为Unicode格式
  const convertToUnicode = (formula: string): string => {
    let unicode = formula;
    
    // 处理下标 (H2O -> H₂O)
    unicode = unicode.replace(/(\d+)/g, (match) => {
      const subscriptMap: { [key: string]: string } = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
      };
      return match.split('').map(digit => subscriptMap[digit] || digit).join('');
    });
    
    // 处理上标 (H+ -> H⁺)
    unicode = unicode.replace(/([+-])/g, (match) => {
      const superscriptMap: { [key: string]: string } = {
        '+': '⁺', '-': '⁻'
      };
      return superscriptMap[match] || match;
    });
    
    // 处理复杂上标 (Ca2+ -> Ca²⁺)
    unicode = unicode.replace(/(\d+)([+-])/g, (match, num, sign) => {
      const superscriptMap: { [key: string]: string } = {
        '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
      };
      const signMap: { [key: string]: string } = {
        '+': '⁺', '-': '⁻'
      };
      return (superscriptMap[num] || num) + (signMap[sign] || sign);
    });
    
    return unicode;
  };

  return (
    <span className="chemical-formula">
      {renderedFormula}
    </span>
    );
};

// 数学公式渲染组件（简化版）
const MathFormula: React.FC<{ children: string }> = ({ children }) => {
  return (
    <span className="math-formula">
      {children}
    </span>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块渲染
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <pre className={className}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 自定义段落渲染，支持化学公式和数学公式
          p: ({ children, ...props }) => {
            const text = React.Children.toArray(children).join('');
            
            // 检测化学公式模式
            if (text.includes('H2O') || text.includes('CO2') || text.includes('H+') || text.includes('OH-') || 
                text.includes('NaCl') || text.includes('H2SO4') || text.includes('NaOH') || text.includes('HCl') ||
                text.includes('Ca2+') || text.includes('Fe3+') || text.includes('CuSO4')) {
              const parts = text.split(/(H2O|CO2|H\+|OH-|NaCl|H2SO4|NaOH|HCl|Ca2\+|Fe3\+|CuSO4)/g);
              return (
                <p {...props}>
                  {parts.map((part, index) => {
                    if (['H2O', 'CO2', 'H+', 'OH-', 'NaCl', 'H2SO4', 'NaOH', 'HCl', 'Ca2+', 'Fe3+', 'CuSO4'].includes(part)) {
                      return <ChemicalFormula key={index}>{part}</ChemicalFormula>;
                    }
                    return part;
                  })}
                </p>
              );
            }
            
            // 检测数学公式模式 (使用$包围)
            if (text.includes('$')) {
              const parts = text.split(/(\$[^$]+\$)/g);
              return (
                <p {...props}>
                  {parts.map((part, index) => {
                    if (part.startsWith('$') && part.endsWith('$')) {
                      const mathContent = part.slice(1, -1);
                      return <MathFormula key={index}>{mathContent}</MathFormula>;
                    }
                    return part;
                  })}
                </p>
              );
            }
            
            return <p {...props}>{children}</p>;
          },
          // 自定义标题渲染
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 text-gray-800" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-semibold mb-3 text-gray-700" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-medium mb-2 text-gray-600" {...props}>
              {children}
            </h3>
          ),
          // 自定义列表渲染
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
              {children}
            </ol>
          ),
          // 自定义表格渲染
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
