import React, { useRef, useCallback, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Book3DDemo.css';

// 双页组件，使用forwardRef
const DoublePage = React.forwardRef<HTMLDivElement, { 
  number: number; 
  leftContent: React.ReactNode; 
  rightContent: React.ReactNode; 
  className?: string;
  isCover?: boolean;
  pageType?: 'soft' | 'hard';
}>((props, ref) => {
  return (
    <div 
      className={`double-page ${props.className || ''} ${props.isCover ? 'cover-page' : ''}`} 
      ref={ref}
      data-density={props.pageType || 'soft'}
    >
      <div className="page-left">
        <div className="page-content">
          {props.leftContent}
        </div>
      </div>
      <div className="page-right">
        <div className="page-content">
          {props.rightContent}
        </div>
      </div>
    </div>
  );
});

const Book3DDemo: React.FC = () => {
  const bookRef = useRef<{ pageFlip: () => any }>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(6); // 6个双页（12个单页）

  // 翻页事件处理
  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // 初始化事件处理
  const onInit = useCallback((e: { data: { page: number } }) => {
    setCurrentPage(e.data.page);
  }, []);

  // 状态变化事件处理
  const onChangeState = useCallback((e: { data: string }) => {
    console.log('Book state changed:', e.data);
  }, []);

  // 翻页方法
  const flipNext = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext('bottom');
    }
  };

  const flipPrev = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev('top');
    }
  };

  const goToPage = (pageNum: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(pageNum, 'bottom');
    }
  };

  return (
    <div className="book-demo-container">
      <h1 className="demo-title">React-PageFlip 双页翻书效果演示</h1>
      
      <div className="book-wrapper">
        <HTMLFlipBook
          ref={bookRef}
          className="flip-book"
          style={{ margin: '0 auto' }}
          width={500} // 缩小双页宽度（250*2）
          height={600}
          size="fixed"
          minWidth={400}
          maxWidth={800}
          minHeight={400}
          maxHeight={800}
          maxShadowOpacity={0.5}
          showCover={true}
          flippingTime={1000}
          usePortrait={false} // 强制横屏模式
          startPage={0}
          startZIndex={0}
          autoSize={true}
          drawShadow={true}
          mobileScrollSupport={true}
          swipeDistance={30}
          clickEventForward={true}
          useMouseEvents={true}
          renderOnlyPageLengthChange={false}
          showPageCorners={false}
          disableFlipByClick={false}
          onFlip={onFlip}
          onInit={onInit}
          onChangeState={onChangeState}
        >
          {/* 封面页 - 硬页效果 */}
          <DoublePage number={0} isCover={true} pageType="hard"
            leftContent={<div className="blank-page"></div>}
            rightContent={
              <div className="cover-content">
                <h2 className="cover-title">3D翻书演示</h2>
                <p className="cover-subtitle">使用 React-PageFlip</p>
                <div className="cover-decoration">
                  <div className="decoration-circle"></div>
                  <div className="decoration-line"></div>
                </div>
                <div className="page-type-indicator">
                  <span className="type-badge hard">硬页效果</span>
                </div>
              </div>
            }
          />

          {/* 第一双页 - 软页效果 */}
          <DoublePage number={1} pageType="soft"
            leftContent={
              <div className="left-page-content">
                <h2 className="page-title">欢迎来到3D翻书世界</h2>
                <div className="page-text">
                  <p>这是一个使用 React-PageFlip 库实现的专业3D翻书效果。</p>
                  <p>现在实现了真正的双页布局，就像真实的书本一样。</p>
                  <div className="feature-list">
                    <h3>主要特性：</h3>
                    <ul>
                      <li>✨ 真实的3D翻页动画</li>
                      <li>📖 双页布局设计</li>
                      <li>🔄 支持横屏模式</li>
                    </ul>
                  </div>
                </div>
                <div className="page-type-indicator">
                  <span className="type-badge soft">软页效果</span>
                </div>
              </div>
            }
            rightContent={
              <div className="right-page-content">
                <h2 className="page-title">技术实现</h2>
                <div className="page-text">
                  <p>React-PageFlip 库的核心优势：</p>
                  <div className="tech-details">
                    <div className="tech-item">
                      <h4>🎯 React原生</h4>
                      <p>专门为React设计，完美集成React生态</p>
                    </div>
                    <div className="tech-item">
                      <h4>⚡ 高性能</h4>
                      <p>基于StPageFlip，优化的渲染引擎</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 第二双页 - 软页效果 */}
          <DoublePage number={2} pageType="soft"
            leftContent={
              <div className="left-page-content">
                <h2 className="page-title">翻页效果对比</h2>
                <div className="page-text">
                  <p>软页 vs 硬页效果：</p>
                  <div className="comparison-list">
                    <div className="comparison-item">
                      <h4>📄 软页效果</h4>
                      <p>像纸张一样柔软，翻页时会有弯曲效果</p>
                    </div>
                    <div className="comparison-item">
                      <h4>📚 硬页效果</h4>
                      <p>像硬纸板一样，翻页时保持平整</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="right-page-content">
                <h2 className="page-title">使用方法</h2>
                <div className="page-text">
                  <p>操作指南：</p>
                  <div className="usage-guide">
                    <div className="guide-item">
                      <span className="guide-icon">🖱️</span>
                      <span>点击页面边缘翻页</span>
                    </div>
                    <div className="guide-item">
                      <span className="guide-icon">👆</span>
                      <span>触摸设备支持滑动翻页</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 第三双页 - 软页效果 */}
          <DoublePage number={3} pageType="soft"
            leftContent={
              <div className="left-page-content">
                <h2 className="page-title">触摸屏操作</h2>
                <div className="page-text">
                  <p>触摸设备完全兼容：</p>
                  <div className="usage-guide">
                    <div className="guide-item">
                      <span className="guide-icon">👆</span>
                      <span>点击页面边缘翻页</span>
                    </div>
                    <div className="guide-item">
                      <span className="guide-icon">🔄</span>
                      <span>滑动翻页支持</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="right-page-content">
                <h2 className="page-title">交互体验</h2>
                <div className="page-text">
                  <p>多种翻页方式：</p>
                  <div className="usage-guide">
                    <div className="guide-item">
                      <span className="guide-icon">⌨️</span>
                      <span>使用下方按钮控制翻页</span>
                    </div>
                    <div className="guide-item">
                      <span className="guide-icon">📱</span>
                      <span>支持横屏和竖屏切换</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 第四双页 - 硬页效果 */}
          <DoublePage number={4} pageType="hard"
            leftContent={
              <div className="left-page-content">
                <h2 className="page-title">硬页效果展示</h2>
                <div className="page-text">
                  <p>硬页的特点：</p>
                  <div className="hard-page-features">
                    <div className="feature-item">
                      <h4>🎯 平整翻页</h4>
                      <p>翻页时页面保持平整，不会弯曲</p>
                    </div>
                    <div className="feature-item">
                      <h4>📚 适合封面</h4>
                      <p>通常用于书籍封面和封底</p>
                    </div>
                  </div>
                </div>
                <div className="page-type-indicator">
                  <span className="type-badge hard">硬页效果</span>
                </div>
              </div>
            }
            rightContent={
              <div className="right-page-content">
                <h2 className="page-title">软页效果展示</h2>
                <div className="page-text">
                  <p>软页的特点：</p>
                  <div className="soft-page-features">
                    <div className="feature-item">
                      <h4>📄 自然弯曲</h4>
                      <p>翻页时页面会自然弯曲，更真实</p>
                    </div>
                    <div className="feature-item">
                      <h4>📖 适合内容页</h4>
                      <p>通常用于书籍的内容页面</p>
                    </div>
                  </div>
                </div>
                <div className="page-type-indicator">
                  <span className="type-badge soft">软页效果</span>
                </div>
              </div>
            }
          />

          {/* 第五双页 - 软页效果 */}
          <DoublePage number={5} pageType="soft"
            leftContent={
              <div className="left-page-content">
                <h2 className="page-title">性能优化</h2>
                <div className="page-text">
                  <p>React-PageFlip 的性能特点：</p>
                  <div className="performance-features">
                    <div className="feature-item">
                      <h4>⚡ 流畅动画</h4>
                      <p>60fps的翻页动画，非常流畅</p>
                    </div>
                    <div className="feature-item">
                      <h4>🎨 真实阴影</h4>
                      <p>动态阴影效果，增强3D感</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            rightContent={
              <div className="right-page-content">
                <h2 className="page-title">响应式设计</h2>
                <div className="page-text">
                  <p>适配各种设备：</p>
                  <div className="responsive-features">
                    <div className="feature-item">
                      <h4>📱 移动设备</h4>
                      <p>触摸操作，滑动翻页</p>
                    </div>
                    <div className="feature-item">
                      <h4>💻 桌面设备</h4>
                      <p>鼠标操作，点击翻页</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 封底页 - 硬页效果 */}
          <DoublePage number={6} pageType="hard"
            leftContent={
              <div className="back-cover-content">
                <h3>演示结束</h3>
                <p>希望您喜欢这个3D翻书效果！</p>
                <div className="back-decoration">
                  <div className="decoration-square"></div>
                </div>
                <div className="page-type-indicator">
                  <span className="type-badge hard">硬页效果</span>
                </div>
              </div>
            }
            rightContent={<div className="blank-page"></div>}
          />
        </HTMLFlipBook>
      </div>

      <div className="book-controls">
        <button 
          onClick={flipPrev} 
          disabled={currentPage === 0}
          className="control-btn prev-btn"
        >
          上一页
        </button>
        
        <div className="page-indicators">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`page-indicator ${index === currentPage ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <button 
          onClick={flipNext} 
          disabled={currentPage === totalPages - 1}
          className="control-btn next-btn"
        >
          下一页
        </button>
      </div>

      <div className="demo-info">
        <h3>双页翻书效果特性：</h3>
        <ul>
          <li>📖 真实的双页布局，像真实书本一样</li>
          <li>🔄 右边翻到左边的翻页效果</li>
          <li>📄 软页效果：自然弯曲，适合内容页</li>
          <li>📚 硬页效果：平整翻页，适合封面封底</li>
          <li>📱 触摸屏点击翻页支持</li>
          <li>🖱️ 鼠标点击翻页支持</li>
          <li>⚙️ 丰富的配置选项</li>
          <li>🚀 高性能，无依赖</li>
        </ul>
        <p className="library-info">
          了解更多信息：<a href="https://www.npmjs.com/package/react-pageflip" target="_blank" rel="noopener noreferrer">npm react-pageflip</a> | 
          <a href="https://github.com/Nodlik/react-pageflip" target="_blank" rel="noopener noreferrer">GitHub React-PageFlip</a>
        </p>
      </div>
    </div>
  );
};

export default Book3DDemo;
