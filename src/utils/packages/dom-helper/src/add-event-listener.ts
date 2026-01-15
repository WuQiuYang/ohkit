/**
 * 给指定的 DOM 元素添加事件监听器，并返回一个函数，用于移除该监听器。
 */

export function addEventListener<K extends keyof WindowEventMap>(
  dom: Window,
  type: K,
  cb: (this: Window, evt: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void;
export function addEventListener(
  dom: Window,
  type: string,
  cb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

// Document 事件监听器  
export function addEventListener<K extends keyof DocumentEventMap>(
  dom: Document,
  type: K,
  cb: (this: Document, evt: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void;
export function addEventListener(
  dom: Document,
  type: string,
  cb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

// HTMLElement 事件监听器
export function addEventListener<K extends keyof HTMLElementEventMap>(
  dom: HTMLElement,
  type: K | string,
  cb: (this: HTMLElement, evt: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void
export function addEventListener(
  dom: HTMLElement,
  type: string,
  cb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void;

export function addEventListener(dom: HTMLElement | Document | Window, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): () => void {
  dom.addEventListener(type, listener, options);
  return () => dom.removeEventListener(type, listener, options);
}
