import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { DraggableBox } from '../index';

describe('DraggableBox Single Bound Constraints', () => {
  const windowWidth = 1200;
  const windowHeight = 800;
  const boxWidth = 200;
  const boxHeight = 150;

  beforeEach(() => {
    // Mock window size
    Object.defineProperty(document.documentElement, 'clientWidth', { value: windowWidth });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: windowHeight });
  });

  describe('X-axis single bounds', () => {
    it('should handle bottom-right placement with only minBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="bottom-right"
          boundsX={[100, undefined]}  // 只有minBound=100
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.right || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const rightValue = parseFloat(box.style.right || '0');
      expect(rightValue).toBeGreaterThanOrEqual(0);
      expect(rightValue).toBeLessThanOrEqual(1200);
    });

    it('should handle bottom-right placement with only maxBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="bottom-right"
          boundsX={[undefined, 50]}  // 只有maxBound=50
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN  
      expect(parseFloat(box.style.right || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const rightValue = parseFloat(box.style.right || '0');
      expect(rightValue).toBeGreaterThanOrEqual(0);
      expect(rightValue).toBeLessThanOrEqual(1200);
    });

    it('should handle top-left placement with only minBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="top-left"
          boundsX={[50, undefined]}  // 只有minBound=50
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.left || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const leftValue = parseFloat(box.style.left || '0');
      expect(leftValue).toBeGreaterThanOrEqual(0);
      expect(leftValue).toBeLessThanOrEqual(1200);
    });

    it('should handle top-left placement with only maxBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="top-left"
          boundsX={[undefined, 200]}  // 只有maxBound=200
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.left || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内  
      const leftValue = parseFloat(box.style.left || '0');
      expect(leftValue).toBeGreaterThanOrEqual(0);
      expect(leftValue).toBeLessThanOrEqual(1200);
    });
  });

  describe('Y-axis single bounds', () => {
    it('should handle bottom-right placement with only minBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="bottom-right"
          boundsY={[80, undefined]}  // 只有minBound=80
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.bottom || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const bottomValue = parseFloat(box.style.bottom || '0');
      expect(bottomValue).toBeGreaterThanOrEqual(0);
      expect(bottomValue).toBeLessThanOrEqual(800);
    });

    it('should handle bottom-right placement with only maxBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="bottom-right"
          boundsY={[undefined, 30]}  // 只有maxBound=30
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.bottom || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const bottomValue = parseFloat(box.style.bottom || '0');
      expect(bottomValue).toBeGreaterThanOrEqual(0);
      expect(bottomValue).toBeLessThanOrEqual(800);
    });

    it('should handle top-left placement with only minBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="top-left"
          boundsY={[40, undefined]}  // 只有minBound=40
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.top || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const topValue = parseFloat(box.style.top || '0');
      expect(topValue).toBeGreaterThanOrEqual(0);
      expect(topValue).toBeLessThanOrEqual(800);
    });

    it('should handle top-left placement with only maxBound', () => {
      const { container } = render(
        <DraggableBox 
          placement="top-left"
          boundsY={[undefined, 100]}  // 只有maxBound=100
          style={{ width: boxWidth, height: boxHeight }}
        >
          Test
        </DraggableBox>
      );
      
      const box = container.firstChild as HTMLElement;
      
      // 验证边界计算不会产生 NaN
      expect(parseFloat(box.style.top || '0')).not.toBeNaN();
      
      // 验证位置值在合理范围内
      const topValue = parseFloat(box.style.top || '0');
      expect(topValue).toBeGreaterThanOrEqual(0);
      expect(topValue).toBeLessThanOrEqual(800);
    });
  });

  it('should handle mixed single bounds on both axes', () => {
    const { container } = render(
      <DraggableBox 
        placement="bottom-right"
        boundsX={[100, undefined]}  // 只有X轴minBound
        boundsY={[undefined, 30]}   // 只有Y轴maxBound
        style={{ width: boxWidth, height: boxHeight }}
      >
        Test
      </DraggableBox>
    );
    
    const box = container.firstChild as HTMLElement;
    
    // 验证两个轴的计算都不会产生 NaN
    expect(parseFloat(box.style.right || '0')).not.toBeNaN();
    expect(parseFloat(box.style.bottom || '0')).not.toBeNaN();
    
    // 验证位置值在合理范围内
    const rightValue = parseFloat(box.style.right || '0');
    const bottomValue = parseFloat(box.style.bottom || '0');
    expect(rightValue).toBeGreaterThanOrEqual(0);
    expect(rightValue).toBeLessThanOrEqual(1200);
    expect(bottomValue).toBeGreaterThanOrEqual(0);
    expect(bottomValue).toBeLessThanOrEqual(800);
  });

  it('should not produce NaN values during drag calculations', () => {
    const { container } = render(
      <DraggableBox 
        placement="bottom-right"
        boundsX={[100, undefined]}
        boundsY={[undefined, 30]}
        style={{ width: boxWidth, height: boxHeight }}
      >
        Test Drag
      </DraggableBox>
    );
    
    const box = container.firstChild as HTMLElement;
    
    // 模拟拖拽操作
    fireEvent.mouseDown(box);
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document);
    
    // 验证拖拽后的位置值仍然有效
    const rightValue = parseFloat(box.style.right || '0');
    const bottomValue = parseFloat(box.style.bottom || '0');
    
    expect(rightValue).not.toBeNaN();
    expect(bottomValue).not.toBeNaN();
    expect(rightValue).toBeGreaterThanOrEqual(0);
    expect(bottomValue).toBeGreaterThanOrEqual(0);
  });
});