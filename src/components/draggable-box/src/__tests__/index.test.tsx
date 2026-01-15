import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DraggableBox } from '../index';

describe('DraggableBox', () => {
  it('renders correctly', () => {
    const { container } = render(<DraggableBox />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with children', () => {
    const { getByText } = render(<DraggableBox>Test Content</DraggableBox>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should respect disabled prop', () => {
    const { container } = render(<DraggableBox disabled />);
    const box = container.firstChild as HTMLElement;
    
    // Simulate drag start
    fireEvent.mouseDown(box);
    
    // Should not start dragging when disabled
    expect(box.style.transform).toBe('');
  });

  describe('lockAxis functionality', () => {
    it('should allow free movement when lockAxis is "none" (default)', () => {
      const { container } = render(<DraggableBox lockAxis="none">Free Move</DraggableBox>);
      const box = container.firstChild as HTMLElement;
      
      fireEvent.mouseDown(box);
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      // Should have transform with both X and Y
      expect(box.style.transform).toContain('translate(');
      expect(box.style.transform).toContain('px,');
      expect(box.style.transform).toContain('px)');
    });

    it('should lock to horizontal movement when lockAxis is "x"', () => {
      const windowWidth = 1000;
      const windowHeight = 800;
      
      // Mock window size
      Object.defineProperty(document.documentElement, 'clientWidth', { value: windowWidth });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: windowHeight });
      const { container } = render(<DraggableBox lockAxis="x">Horizontal Only</DraggableBox>);
      const box = container.firstChild as HTMLElement;
      
      fireEvent.mouseDown(box);
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      // Should only have X transform, Y should be 0
      expect(box.style.transform).toBe('translate(100px, 0px)');
    });

    it('should lock to vertical movement when lockAxis is "y"', () => {
      const windowWidth = 1000;
      const windowHeight = 800;
      
      // Mock window size
      Object.defineProperty(document.documentElement, 'clientWidth', { value: windowWidth });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: windowHeight });
      const { container } = render(<DraggableBox lockAxis="y">Vertical Only</DraggableBox>);
      const box = container.firstChild as HTMLElement;
      
      fireEvent.mouseDown(box);
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      // Should only have Y transform, X should be 0
      expect(box.style.transform).toBe('translate(0px, 100px)');
    });
  });

  describe('boundary functionality', () => {
    it('should handle relative bounds with placement top-left', () => {
      const { container } = render(
        <DraggableBox placement="top-left" boundsX={[50, 100]} boundsY={[30, 200]}>
          Top Left Relative Bounds
        </DraggableBox>
      );
      const box = container.firstChild as HTMLElement;
      
      // Component should render with correct class name
      expect(box).toHaveClass('ohkit-draggable-box__container');
    });

    it('should handle relative bounds with placement bottom-right', () => {
      const { container } = render(
        <DraggableBox placement="bottom-right" boundsX={[100, 50]} boundsY={[200, 30]}>
          Bottom Right Relative Bounds
        </DraggableBox>
      );
      const box = container.firstChild as HTMLElement;
      
      // Component should render with correct class name
      expect(box).toHaveClass('ohkit-draggable-box__container');
    });

    it('should handle top-right placement with bounds', () => {
      const { container } = render(
        <DraggableBox placement="top-right" boundsX={[150, 50]}>
          Top Right Bounds
        </DraggableBox>
      );
      const box = container.firstChild as HTMLElement;
      
      expect(box).toHaveClass('ohkit-draggable-box__container');
    });

    it('should handle bottom-left placement with bounds', () => {
      const { container } = render(
        <DraggableBox placement="bottom-left" boundsY={[80, 20]}>
          Bottom Left Bounds
        </DraggableBox>
      );
      const box = container.firstChild as HTMLElement;
      
      expect(box).toHaveClass('ohkit-draggable-box__container');
    });

    it('should have window bounds by default', () => {
      const { container } = render(<DraggableBox>Default</DraggableBox>);
      const box = container.firstChild as HTMLElement;
      
      // Default should have window bounds
      expect(box).toHaveClass('ohkit-draggable-box__container');
    });

      it('should correctly handle bottom-right placement with bounds', () => {
        const windowWidth = 1000;
        const windowHeight = 800;
        const boxWidth = 100;
        const boxHeight = 50;
        
        // Mock window size
        Object.defineProperty(document.documentElement, 'clientWidth', { value: windowWidth });
        Object.defineProperty(document.documentElement, 'clientHeight', { value: windowHeight });
        
        const { container } = render(
          <DraggableBox 
            placement="bottom-right"
            boundsX={[100, 50]}  // [minRight, maxRight]
            boundsY={[80, 30]}   // [minBottom, maxBottom]
            style={{ width: boxWidth, height: boxHeight }}
          >
            Bottom Right Bounds
          </DraggableBox>
        );
        
        const box = container.firstChild as HTMLElement;
        
        // 验证初始位置是否正确应用了边界限制
        expect(box.style.right).toBe('100px'); // 最小右边界100px
        expect(box.style.bottom).toBe('80px'); // 最小下边界80px
        
        // 模拟拖拽到最大边界
        fireEvent.mouseDown(box);
        fireEvent.mouseMove(document, { 
          clientX: windowWidth - 50,  // 对应right=50px
          clientY: windowHeight - 30  // 对应bottom=30px
        });
        fireEvent.mouseUp(document);
        
        // 验证拖拽后的边界限制
        expect(box.style.right).toBe('50px'); // 最大右边界50px
        expect(box.style.bottom).toBe('30px'); // 最大下边界30px
      });
  });

  it('should handle different placement positions', () => {
    const { container } = render(<DraggableBox placement="top-left">Top Left</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Check for correct class name which provides fixed positioning
    expect(box).toHaveClass('ohkit-draggable-box__container');
  });

  it('should respect custom zIndex', () => {
    const { container } = render(<DraggableBox zIndex={5000}>High Z-Index</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    expect(box.style.zIndex).toBe('5000');
  });
});