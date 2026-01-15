import { addEventListener } from '../add-event-listener';

describe('addEventListener', () => {
  let mockElement: HTMLElement;
  let mockWindow: Window;
  let mockDocument: Document;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockWindow = window;
    mockDocument = document;
  });

  it('should add event listener to HTMLElement', () => {
    const mockHandler = jest.fn();
    const remove = addEventListener(mockElement, 'click', mockHandler);
    
    mockElement.click();
    expect(mockHandler).toHaveBeenCalled();
    
    remove();
    mockElement.click();
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should add event listener to Window', () => {
    const mockHandler = jest.fn();
    const remove = addEventListener(mockWindow, 'resize', mockHandler);
    
    window.dispatchEvent(new Event('resize'));
    expect(mockHandler).toHaveBeenCalled();
    
    remove();
    window.dispatchEvent(new Event('resize'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should add event listener to Document', () => {
    const mockHandler = jest.fn();
    const remove = addEventListener(mockDocument, 'scroll', mockHandler);
    
    document.dispatchEvent(new Event('scroll'));
    expect(mockHandler).toHaveBeenCalled();
    
    remove();
    document.dispatchEvent(new Event('scroll'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});