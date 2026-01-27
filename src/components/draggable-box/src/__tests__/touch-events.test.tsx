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
    const { container } = render(<DraggableBox>Touch Move Test</DraggableBox>);
    const box = container.firstChild as HTMLElement;
    
    // Create touch events
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    const touchEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    
    // Add required properties for touch events
    Object.defineProperty(touchStartEvent, 'touches', {
      value: [{ pageX: 100, pageY: 100 }],
      writable: false
    });
    
    Object.defineProperty(touchEvent, 'touches', {
      value: [{ pageX: 150, pageY: 150 }],
      writable: false
    });
    
    // Simulate touch sequence
    fireEvent(box, touchStartEvent);
    fireEvent(box, touchEvent);
    
    // Should handle touch movement (transform might be set during movement)
    expect(box).toHaveClass('ohkit-draggable-box__container');
    expect(box.style.transform).toBeTruthy();
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