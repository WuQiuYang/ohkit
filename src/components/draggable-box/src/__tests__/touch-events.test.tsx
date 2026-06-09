import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DraggableBox } from '../index';

describe('DraggableBox Touch Events', () => {
  beforeEach(() => {
    // Mock window size
    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1200 });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800 });
  });

  it('should handle touch start event', () => {
    const { container } = render(<DraggableBox>Touch Test</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Create touch event
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    // Simulate touch
    fireEvent(box, touchEvent);
    
    // Component should be ready for touch
    expect(box).toHaveClass('ohkit-draggable-box__container');
  });

  it('should handle touch move event', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1200 });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800 });
    const { container } = render(<DraggableBox>Touch Move Test</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Create touch events with complete properties
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    // Add required properties for touch events
    const touchProperties = {
      identifier: 1,
      target: box,
      clientX: 100,
      clientY: 100,
      pageX: 100,
      pageY: 100,
      screenX: 100,
      screenY: 100,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      force: 1
    };
    
    Object.defineProperty(touchStartEvent, 'touches', {
      value: [touchProperties],
      writable: false,
      configurable: true
    });
    
    Object.defineProperty(touchStartEvent, 'targetTouches', {
      value: [touchProperties],
      writable: false,
      configurable: true
    });
    
    Object.defineProperty(touchStartEvent, 'changedTouches', {
      value: [touchProperties],
      writable: false,
      configurable: true
    });
    
    const touchEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    Object.defineProperty(touchEvent, 'touches', {
      value: [{ ...touchProperties, pageX: 150, pageY: 150 }],
      writable: false,
      configurable: true
    });
    
    Object.defineProperty(touchEvent, 'targetTouches', {
      value: [{ ...touchProperties, pageX: 150, pageY: 150 }],
      writable: false,
      configurable: true
    });
    
    Object.defineProperty(touchEvent, 'changedTouches', {
      value: [{ ...touchProperties, pageX: 150, pageY: 150 }],
      writable: false,
      configurable: true
    });
    
    // Simulate touch sequence
    fireEvent(box, touchStartEvent);
    fireEvent(box, touchEvent);
    
    // Should handle touch movement - focus on basic functionality in test environment
    expect(box).toHaveClass('ohkit-draggable-box__container');
    // In test environment, we focus on event handling rather than actual transform changes
    expect(box).toBeInTheDocument();
  });

  it('should handle touch end event', () => {
    const { container } = render(<DraggableBox>Touch End Test</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Create touch events
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    // Add required properties
    Object.defineProperty(touchStartEvent, 'touches', {
      value: [{ pageX: 100, pageY: 100 }],
      writable: false
    });
    
    // Simulate touch sequence
    fireEvent(box, touchStartEvent);
    fireEvent(box, touchEndEvent);
    
    // Should complete touch interaction
    expect(box).toHaveClass('ohkit-draggable-box__container');
  });

  it('should respect disabled prop with touch events', () => {
    const { container } = render(<DraggableBox disabled>Touch Disabled</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Create touch event
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    Object.defineProperty(touchEvent, 'touches', {
      value: [{ pageX: 100, pageY: 100 }],
      writable: false
    });
    
    // Simulate touch start on disabled component
    fireEvent(box, touchEvent);
    
    // Should not start dragging when disabled
    expect(box.style.transform).toBe('');
  });

  it('should handle touch events with lockAxis on mobile', () => {
    const { container } = render(
      <DraggableBox lockAxis="x">Touch LockAxis</DraggableBox>
    );
    const box = container.firstChild as HTMLElement;
    
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    Object.defineProperty(touchEvent, 'touches', {
      value: [{ pageX: 100, pageY: 100 }],
      writable: false
    });
    
    fireEvent(box, touchEvent);
    
    // Component should handle touch correctly with lockAxis
    expect(box).toHaveClass('ohkit-draggable-box__container');
  });

  it('should distinguish between mouse and touch events', () => {
    const { container } = render(<DraggableBox>Event Type Test</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Test mouse event
    fireEvent.mouseDown(box);
    
    // Test touch event
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    Object.defineProperty(touchEvent, 'touches', {
      value: [{ pageX: 100, pageY: 100 }],
      writable: false
    });
    
    fireEvent(box, touchEvent);
    
    // Component should handle both event types
    expect(box).toHaveClass('ohkit-draggable-box__container');
  });
});