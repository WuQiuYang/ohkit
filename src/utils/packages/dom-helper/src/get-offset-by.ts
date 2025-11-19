import { getRect, Rect } from './get-rect';

interface OffsetResult extends Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * 根据指定的基准元素获取目标元素的偏移量
 *
 * @param elem 目标元素，可以是HTMLElement或Range对象
 * @param byElem 基准元素，默认为document.body。如果指定，将以其左上角为坐标原点计算目标元素的偏移量
 * @returns 返回目标元素相对于基准元素的偏移量，包括left和top属性
 */
export function getOffsetBy(elem: HTMLElement | Range, byElem: HTMLElement = document.body): OffsetResult {
    // 获取根节点滚动元素
    const rootScrollingElement = window.document.scrollingElement || window.document.body ||  window.document.documentElement;
    const byElemisRoot = byElem === rootScrollingElement;
    // 基准元素（滚动元素）就为根节点滚动元素时，不需要再次调整偏移量
    const eleRect = getRect(elem, {needAdjustOffset: !byElemisRoot});
    const byEleRect = getRect(byElem);
    return {
        ...eleRect,
        left: eleRect.left - byEleRect.left,
        top: eleRect.top - byEleRect.top
    };
}
