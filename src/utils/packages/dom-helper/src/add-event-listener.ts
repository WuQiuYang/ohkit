/**
 * 给指定的 DOM 元素添加事件监听器，并返回一个函数，用于移除该监听器。
 *
 * @param dom DOM 元素或窗口对象
 * @param type 要监听的事件类型
 * @param cb 事件处理函数或事件处理对象
 * @param options 可选参数，表示是否使用捕获模式或添加事件监听器的其他选项
 * @returns 一个函数，用于移除添加的事件监听器
 */
export function addEventListener(dom: Window | Document, type: string, cb: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    dom.addEventListener(type, cb, options);
    return () => dom.removeEventListener(type, cb, options);
}