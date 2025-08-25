import React, { useEffect, useRef, useState } from 'react';

import './MathJaxPage.css';

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup: {
        promise: Promise<void>;
      };
      tex: {
        inlineMath: string[][];
        displayMath: string[][];
      };
      chtml: {
        scale: number;
        minScale: number;
        matchFontHeight: boolean;
      };
    };
  }
}

const MathJaxPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedElements, setRenderedElements] = useState<HTMLElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 配置MathJax
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      },
      chtml: {
        scale: 1.0,
        minScale: 0.5,
        matchFontHeight: true,
      },
      startup: {
        promise: Promise.resolve()
      },
      typesetPromise: async () => {
        return Promise.resolve();
      }
    };

    // 等待MathJax加载完成
    const loadMathJax = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
        script.async = true;
        
        script.onload = () => {
          if (window.MathJax) {
            initializeMathJax();
          }
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('MathJax加载失败:', error);
      }
    };

    loadMathJax();
  }, []);

  const initializeMathJax = () => {
    if (window.MathJax && containerRef.current) {
      window.MathJax.tex = {
        ...window.MathJax.tex,
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      };
      renderMathExpressions();
    }
  };

  const renderMathExpressions = async () => {
    if (!window.MathJax || !containerRef.current) return;

    try {
      await window.MathJax.startup.promise;
      await window.MathJax.typesetPromise([containerRef.current]);
      
      const findableElements = containerRef.current.querySelectorAll('.findable-element');
      const allElements = Array.from(findableElements) as HTMLElement[];
      setRenderedElements(allElements);
      
      allElements.forEach((element, index) => {
        element.setAttribute('data-index', index.toString());
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => handleElementClick(element, index));
        element.addEventListener('mouseenter', () => handleElementHover(element, true));
        element.addEventListener('mouseleave', () => handleElementHover(element, false));
      });
      
    } catch (error) {
      console.error('MathJax渲染失败:', error);
    }
  };

  const handleElementClick = (element: HTMLElement, index: number) => {
    setSelectedElement(element);
    console.log(`点击了第 ${index} 个可查找元素:`, element);
    
    element.style.backgroundColor = '#ffeb3b';
    element.style.border = '2px solid #ff9800';
    
    setTimeout(() => {
      element.style.backgroundColor = '';
      element.style.border = '';
    }, 3000);
  };

  const handleElementHover = (element: HTMLElement, isHovering: boolean) => {
    if (isHovering) {
      element.style.backgroundColor = '#e3f2fd';
      element.style.border = '1px solid #2196f3';
    } else {
      if (element !== selectedElement) {
        element.style.backgroundColor = '';
        element.style.border = '';
      }
    }
  };

  const findElementById = (id: string) => {
    const element = containerRef.current?.querySelector(`[data-index="${id}"]`);
    if (element) {
      handleElementClick(element as HTMLElement, parseInt(id));
    }
    return element;
  };

  const clearSelection = () => {
    setSelectedElement(null);
    renderedElements.forEach(element => {
      element.style.backgroundColor = '';
      element.style.border = '';
    });
  };

  return (
    <div className="mathjax-page">
      <div className="page-header">
        <h1>MathJax 自定义标签演示</h1>
        <p>{'支持 \\class{id}{expr} 语法和元素查找功能'}</p>
      </div>

      <div className="controls">
        <button onClick={() => findElementById('0')}>查找元素 0</button>
        <button onClick={() => findElementById('1')}>查找元素 1</button>
        <button onClick={() => findElementById('2')}>查找元素 2</button>
        <button onClick={clearSelection}>清除选择</button>
      </div>

      <div className="math-container handwrite" ref={containerRef}>
        <h2>基础数学公式</h2>
        <p>行内公式：$E = mc^2$ 和 $F = ma$</p>
        
        <h2>显示公式</h2>
        <p>二次方程：$$ax^2 + bx + c = 0$$</p>
        
        <h2>自定义标签公式</h2>
        <p>使用 {'\\class{id}{expr}'} 语法：</p>
        
        <div className="custom-formulas">
          <p>可查找的公式1：$${String.raw`\class{findable-element}{x^2 + y^2 = r^2}`}$$</p>
          <p>可查找的公式2：$${String.raw`\class{findable-element}{\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}}`}$$</p>
          <p>可查找的公式3：$${String.raw`\class{findable-element}{\frac{d}{dx} \sin(x) = \cos(x)}`}$$</p>
        </div>

        <h2>化学公式示例</h2>
        <p>使用自定义标签的化学公式：</p>
        <p>$${String.raw`\class{findable-element}{H_2O + CO_2 \rightarrow H_2CO_3}`}$$</p>
        <p>$${String.raw`\class{findable-element}{2H_2 + O_2 \rightarrow 2H_2O}`}$$</p>
      </div>

      <div className="info-panel">
        <h3>功能说明</h3>
        <ul>
          <li>点击任何带有 <code>findable-element</code> 类的公式可以选中</li>
          <li>使用上方按钮可以快速查找特定元素</li>
          <li>选中的元素会高亮显示</li>
          <li>支持行内公式（$...$）和显示公式（$$...$$）</li>
        </ul>
        
        <h3>当前状态</h3>
        <p>已渲染元素数量: {renderedElements.length}</p>
        <p>当前选中: {selectedElement ? `元素 ${selectedElement.getAttribute('data-index')}` : '无'}</p>
      </div>
    </div>
  );
};

export default MathJaxPage;
