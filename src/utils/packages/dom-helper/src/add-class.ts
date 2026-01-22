
/**
 * 给指定的 DOM 元素添加指定的类名，并返回一个移除该类名的函数
 *
 * @param dom 要添加类名的 DOM 元素
 * @param className 要添加的类名
 * @returns 返回一个移除该类名的函数
 */
export const addClass = (dom: HTMLElement | null | Array<HTMLElement | null>, className: string) => {
    if (!dom) {
        return null;
    }
    let domList = Array.isArray(dom) ? dom : [dom];
    domList.forEach(item => item?.classList.add(className));
    return () => {
        domList.forEach(item => item?.classList.remove(className));
        // 移除后清空数组, 防止重复移除, 且清除引用, 防止内存泄漏
        domList = [];
    }
};