
export interface Rect {
    width: number;
    height: number;
    left: number;
    top: number;
}

interface GetRectOptions {
    needAdjustOffset?: boolean;
}

/**
 * 获取元素的矩形区域信息
 *
 * @param el HTML元素或Range对象
 * @param options 配置选项, needAdjustOffset为true时 需要根据根节点滚动容器的滚动位置调整偏移量
 * @returns 矩形区域信息
 */
export function getRect(el: HTMLElement | Range, {needAdjustOffset = true}: GetRectOptions = {}): Rect {
    const elRect = el.getBoundingClientRect();
    const rootScrollingElement = window.document.scrollingElement || window.document.body ||  window.document.documentElement;
    const elIsRoot = el === rootScrollingElement;
    if (elIsRoot) {
        return {
            width: rootScrollingElement.clientWidth,
            height: rootScrollingElement.clientHeight,
            left: 0,
            top: 0
        }
    }
    return {
        width: elRect.width,
        height: elRect.height,
        left: elRect.left + (needAdjustOffset ? (rootScrollingElement.scrollLeft) : 0),
        top: elRect.top + (needAdjustOffset ? (rootScrollingElement.scrollTop) : 0)
    };
}
