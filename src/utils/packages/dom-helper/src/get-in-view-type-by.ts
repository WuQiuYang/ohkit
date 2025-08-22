import {getOffsetBy} from './get-offset-by';
import {getRect, Rect} from './get-rect';
import findScrollContainer from './find-scroll-container';

/**
 * 判断 DOM 是否可见视图范围
 */

export const VIEW_TYPES = {
    CONTAIN: 'contain',
    INTERSECTION: 'intersection',
    PARALLEL: 'parallel'
} as const;

export type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

interface InViewResult {
    xType: ViewType;
    yType: ViewType;
    elOffset: ReturnType<typeof getOffsetBy>;
    byRect: Rect;
}

/**
 * 根据元素或范围获取其在视口中的显示类型
 *
 * @param el 要检测的元素或范围
 * @param byEl 参照元素，默认为滚动容器
 * @returns 包含元素在视口中的显示类型的对象
 */
export function getInViewTypeBy(el: HTMLElement | Range, byEl: HTMLElement = findScrollContainer(el)): InViewResult {
    const byRect = getRect(byEl);
    const offset = getOffsetBy(el, byEl);
    // todo, 当 window.innerWidth < scroller.width 时候，需要特殊处理吗
    // 嵌套

    let xType;
    let yType;
    if (offset.top >= 0 && offset.top + offset.height <= byRect.height) {
        // 垂直方向 contain
        yType = VIEW_TYPES.CONTAIN;
    } else if (
        // 垂直方向 没有交集
        offset.top + offset.height < 0
        || offset.top > byRect.height
    ) {
        yType = VIEW_TYPES.PARALLEL;
    } else {
        yType = VIEW_TYPES.INTERSECTION;
    }

    if (offset.left >= 0 && offset.left + offset.width <= byRect.width) {
        // 水平方向 contain
        xType = VIEW_TYPES.CONTAIN;
    } else if (
        // 水平方向 没有交集
        offset.left + offset.width < 0
        || offset.left > byRect.width
    ) {
        xType = VIEW_TYPES.PARALLEL;
    } else {
        xType = VIEW_TYPES.INTERSECTION;
    }

    return {
        xType,
        yType,
        elOffset: offset,
        byRect
    };
}
