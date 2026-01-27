/**
 * 给指定的 DOM 元素添加事件监听器，并返回一个函数，用于移除该监听器。
 */

export function addEventListener<K extends keyof WindowEventMap>(
  dom: Window,
  type: K,
  cb: (this: Window, evt: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void;
// Document 事件监听器  
export function addEventListener<K extends keyof DocumentEventMap>(
  dom: Document,
  type: K,
  cb: (this: Document, evt: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void;

// HTMLElement 事件监听器
export function addEventListener<K extends keyof HTMLElementEventMap>(
  dom: HTMLElement,
  type: K,
  cb: (this: HTMLElement, evt: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void

export function addEventListener(
  dom: Window | Document | HTMLElement,
  type: string,
  cb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

export function addEventListener(
  dom: Window | Document | HTMLElement,
  type: string,
  cb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
    dom.addEventListener(type, cb, options);
    return () => dom.removeEventListener(type, cb, options);
}

