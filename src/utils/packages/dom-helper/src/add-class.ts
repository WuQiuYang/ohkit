
/**
 * 给指定的 DOM 元素添加指定的类名，并返回一个移除该类名的函数
 *
 * @param dom 要添加类名的 DOM 元素
 * @param className 要添加的类名
 * @returns 返回一个移除该类名的函数
 */
export const addClass = (dom: HTMLElement, className: string) => {
    if (!dom) {
        return null;
    }
    dom.classList.add(className);
    return () => dom.classList.remove(className);
};