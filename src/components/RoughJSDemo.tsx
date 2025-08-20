import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import './RoughJSDemo.css';

const RoughJSDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvasRef = useRef<ReturnType<typeof rough.canvas> | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 设置画布尺寸
        canvas.width = 800;
        canvas.height = 600;
        
        // 创建roughjs画布
        roughCanvasRef.current = rough.canvas(canvas);
        
        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制数学笔记内容
        drawMathematicalNotes();
      }
    }
  }, []);

  const drawMathematicalNotes = () => {
    if (!roughCanvasRef.current || !canvasRef.current) return;
    
    const canvas = roughCanvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    
    if (!ctx) return;
    
    // 设置字体
    ctx.font = '20px "Microsoft YaHei", Arial, sans-serif';
    ctx.fillStyle = '#333';
    
    // 绘制标题行
    ctx.fillText('情况一 ∠PAB=90°', 50, 80);
    
    // 绘制椭圆圈选 - 使用roughjs的手绘椭圆，模拟粉笔效果
    canvas.ellipse(120, 70, 200, 25, {
      stroke: '#3b82f6',
      strokeWidth: 6,
      roughness: 7,
      seed: 1,
      bowing: 0.3,
      fill: 'rgba(59, 130, 246, 0.08)',
      fillStyle: 'solid'
    });
    
    // 添加粉笔颗粒效果，模拟粉笔的质地
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const x = 120 + 100 * Math.cos(angle) + (Math.random() - 0.5) * 10;
      const y = 70 + 12.5 * Math.sin(angle) + (Math.random() - 0.5) * 10;
      const size = 1 + Math.random() * 3;
      
      canvas.circle(x, y, size, {
        fill: '#3b82f6',
        fillStyle: 'solid',
        roughness: 4,
        seed: 20 + i
      });
    }
    
    // 添加一些更粗的粉笔颗粒，模拟粉笔的粗细变化
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = 120 + 100 * Math.cos(angle) + (Math.random() - 0.5) * 15;
      const y = 70 + 12.5 * Math.sin(angle) + (Math.random() - 0.5) * 15;
      
      canvas.circle(x, y, 3 + Math.random() * 4, {
        fill: '#3b82f6',
        fillStyle: 'solid',
        roughness: 3,
        seed: 40 + i
      });
    }
    
    // 绘制已知条件
    ctx.fillText('已知: ∠PAB=90° => PA ⊥ AB 且 PA = AB', 50, 120);
    
    // 绘制证明
    ctx.fillText('证明: △PMA ≥ AOB', 50, 160);
    
    // 绘制证明步骤1
    ctx.fillText('1. ZPMA ZAOB = 90°', 50, 200);
    
    // 绘制证明步骤2
    ctx.fillText('2.在等腰直角三角形APAB中,两直角边相等=>PA=AA', 50, 240);
    
    // 绘制需要波浪线标记的行
    ctx.fillText('∠OAB+∠OBA=90°, 且∠OAB+ ∠PAM=90°', 50, 280);
    
    // 绘制波浪线 - 使用roughjs的手绘路径
    drawWavyLine(50, 290, 400, 290, '#10b981');
    
    // 添加一些装饰性的手绘元素
    drawHandDrawnElements();
    
    // 添加粉笔颗粒效果到文字周围
    addChalkParticles();
  };
  
  const addChalkParticles = () => {
    if (!roughCanvasRef.current) return;
    
    const canvas = roughCanvasRef.current;
    
    // 在文字周围添加随机的粉笔颗粒
    const textPositions = [
      { x: 50, y: 80, text: '情况一 ∠PAB=90°' },
      { x: 50, y: 120, text: '已知: ∠PAB=90° => PA ⊥ AB 且 PA = AB' },
      { x: 50, y: 160, text: '证明: △PMA ≥ AOB' },
      { x: 50, y: 200, text: '1. ZPMA ZAOB = 90°' },
      { x: 50, y: 240, text: '2.在等腰直角三角形APAB中,两直角边相等=>PA=AA' },
      { x: 50, y: 280, text: '∠OAB+∠OBA=90°, 且∠OAB+ ∠PAM=90°' }
    ];
    
    textPositions.forEach((pos, index) => {
      // 为每行文字添加粉笔颗粒
      for (let i = 0; i < 5 + Math.random() * 8; i++) {
        const offsetX = (Math.random() - 0.5) * pos.text.length * 12;
        const offsetY = (Math.random() - 0.5) * 20;
        
        canvas.circle(pos.x + offsetX, pos.y + offsetY, 0.5 + Math.random() * 1.5, {
          fill: '#666',
          fillStyle: 'solid',
          roughness: 3,
          seed: 100 + index * 10 + i
        });
      }
    });
  };

  const drawWavyLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    if (!roughCanvasRef.current) return;
    
    const canvas = roughCanvasRef.current;
    
    // 创建粉笔风格的波浪线 - 模拟一笔画成的效果
    const length = x2 - x1;
    const points: [number, number][] = [];
    const segments = 25;
    
    // 生成更自然的波浪线控制点，模拟手绘的不规则性
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const x = x1 + progress * length;
      
      // 使用多个正弦波叠加，创造更自然的波浪
      const wave1 = 6 * Math.sin(progress * Math.PI * 4);
      const wave2 = 3 * Math.sin(progress * Math.PI * 8);
      const wave3 = 2 * Math.sin(progress * Math.PI * 12);
      const y = y1 + wave1 + wave2 + wave3;
      
      points.push([x, y]);
    }
    
    // 使用roughjs的curve方法绘制平滑的波浪线，模拟粉笔的粗细变化
    canvas.curve(points, {
      stroke: color,
      strokeWidth: 5,
      roughness: 6,
      seed: 2,
      bowing: 0.4,
      curveTightness: 0.3
    });
    
    // 添加粉笔颗粒效果，模拟粉笔的质地
    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * (points.length - 1));
      const [x, y] = points[randomIndex];
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = (Math.random() - 0.5) * 6;
      const size = 0.5 + Math.random() * 2.5;
      
      canvas.circle(x + offsetX, y + offsetY, size, {
        fill: color,
        fillStyle: 'solid',
        roughness: 4,
        seed: 10 + i
      });
    }
    
    // 添加一些更粗的粉笔颗粒，模拟粉笔的粗细变化
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * (points.length - 1));
      const [x, y] = points[randomIndex];
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetY = (Math.random() - 0.5) * 8;
      
      canvas.circle(x + offsetX, y + offsetY, 2 + Math.random() * 3, {
        fill: color,
        fillStyle: 'solid',
        roughness: 3,
        seed: 25 + i
      });
    }
  };

  const drawHandDrawnElements = () => {
    if (!roughCanvasRef.current) return;
    
    const canvas = roughCanvasRef.current;
    
    // 添加一些手绘的箭头和标记
    // 箭头1
    canvas.line(300, 100, 350, 100, {
      stroke: '#ef4444',
      strokeWidth: 2,
      roughness: 2,
      seed: 3
    });
    
    // 箭头2
    canvas.line(350, 100, 345, 95, {
      stroke: '#ef4444',
      strokeWidth: 2,
      roughness: 2,
      seed: 4
    });
    
    canvas.line(350, 100, 345, 105, {
      stroke: '#ef4444',
      strokeWidth: 2,
      roughness: 2,
      seed: 5
    });
    
    // 添加一些手绘的圆圈标记
    canvas.circle(450, 150, 15, {
      stroke: '#f59e0b',
      strokeWidth: 2,
      roughness: 2,
      seed: 6
    });
    
    // 添加手绘的矩形高亮
    canvas.rectangle(50, 180, 300, 30, {
      stroke: '#8b5cf6',
      strokeWidth: 2,
      roughness: 3,
      seed: 7,
      fill: 'rgba(139, 92, 247, 0.1)'
    });
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMathematicalNotes();
      }
    }
  };

  const regenerateRough = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 重新创建roughjs画布
        roughCanvasRef.current = rough.canvas(canvas);
        drawMathematicalNotes();
      }
    }
  };

  return (
    <div className="roughjs-demo">
      <div className="demo-header">
        <h1>RoughJS 粉笔效果演示</h1>
        <p>使用 RoughJS 实现真实的粉笔手绘效果：一笔成形的波浪线和椭圆圈选</p>
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="roughjs-canvas"
          style={{ border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>
      
      <div className="controls">
        <button onClick={clearCanvas} className="control-btn">
          清除画布
        </button>
        <button onClick={regenerateRough} className="control-btn">
          重新生成手绘效果
        </button>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>🎯 粉笔椭圆圈选</h3>
          <p>使用 RoughJS 的 <code>ellipse()</code> 方法实现真实的粉笔效果，包括粗细变化和粉笔颗粒，模拟手写笔记中的重点标记。</p>
        </div>
        
        <div className="feature">
          <h3>🌊 粉笔波浪线</h3>
          <p>使用 RoughJS 的 <code>curve()</code> 方法实现一笔成形的粉笔波浪线，通过多层正弦波叠加和多颗粒效果，完美模拟粉笔的质地和粗细变化。</p>
        </div>
        
        <div className="feature">
          <h3>✏️ 真实粉笔质感</h3>
          <p>通过设置 <code>roughness</code>、<code>bowing</code> 和随机颗粒效果，每次生成都有细微差异，完美还原粉笔在黑板上书写的自然效果。</p>
        </div>
      </div>
    </div>
  );
};

export default RoughJSDemo;
