import findScrollContainer from './find-scroll-container';
import { getInViewTypeBy, VIEW_TYPES } from './get-in-view-type-by';
import {scrollTo} from './scroll-to';

interface ScrollOptions {
    behavior?: ScrollBehavior;
    offsetTop?: number;
    offsetLeft?: number;
    offsetBottom?: number;
    offsetRight?: number;
    baseOffsetY?: 'auto' | 'top' | 'bottom';
    baseOffsetX?: 'auto' | 'left' | 'right';
    allowScrollLeft?: boolean;
    allowScrollTop?: boolean;
    forceScrollY?: boolean;
    forceScrollX?: boolean;
    scrollParentNeedIntoView?: boolean;
    scrollYContainer?: HTMLElement;
    scrollXContainer?: HTMLElement;
    scroller?: HTMLElement;
    realScroll?: boolean;
}

interface ScrollIfNeedOptions {
    allowScrollLeft?: boolean;
    allowScrollTop?: boolean;
}

export function scrollIntoViewIfNeeded(
    el: HTMLElement | Range, // el支持Range和Element
    {
        behavior,
        offsetTop = 10,
        offsetLeft = 10,
        offsetBottom = 10,
        offsetRight = 10,
        baseOffsetY = 'auto', // 'auto' 自动 就近规则, y轴offset基于 top | bottom
        baseOffsetX = 'auto', // 'auto' 自动 就近规则, x轴offset基于 left | right
        allowScrollLeft = true, // X方向定位
        allowScrollTop = true, // Y方向定位
        forceScrollY = false, // y方向强制滚动， 无视元素此时是否已可见
        forceScrollX = false, // x方向强制滚动， 无视元素此时是否已可见
        scrollParentNeedIntoView = false,
        scrollYContainer, // 外部指定Y方向滚动容器
        scrollXContainer, // 外部指定X方向滚动容器
        scroller, // 外部指定滚动容器，不区分X，Y
        realScroll = true, // 寻找父级真实能滚动的滚动容器
    }: ScrollOptions = {}
): boolean {
    // if (el && typeof el.scrollIntoViewIfNeeded === 'function') {
    //     return el.scrollIntoViewIfNeeded();
    // }

    if (!el) {
        return false;
    }
    // console.log(el, scroller, '--- el, scroller ---');
    if (scroller) {
        return scrollIfNeed(el, scroller);
    }

    const scrollYController =
        allowScrollTop
            ? (scrollYContainer || findScrollContainer(el, {overflowStyleName: 'overflowY', realScroll, excludeOwn: true}))
            : undefined;
    const scrollXController =
        allowScrollLeft
            ? (scrollXContainer || findScrollContainer(el, {overflowStyleName: 'overflowX', realScroll, excludeOwn: true}))
            : undefined;
    // console.log(scrollXController, scrollYController, '--- scrollXController, scrollYController ---');

    if (scrollYController === scrollXController) {
        return scrollIfNeed(el, scrollYController);
    }
    return !!(
        scrollIfNeed(el, scrollYController, {allowScrollLeft: false})
        || scrollIfNeed(el, scrollXController, {allowScrollTop: false})
    );

    function scrollIfNeed(
        el: HTMLElement | Range,
        scroller?: HTMLElement,
        {allowScrollLeft = true, allowScrollTop = true}: ScrollIfNeedOptions = {}
    ) {
        if (!el || !scroller) {
            return false;
        }

        if (el === scroller) {
            return false;
        }

        // todo：scroller 可见 后，但 el 还是隐藏了怎么办
        // 让 scroller 可见
        scrollParentNeedIntoView
            && scrollIntoViewIfNeeded(scroller, {
                behavior,
                offsetTop,
                offsetRight,
                offsetLeft,
                offsetBottom,
                baseOffsetY,
                baseOffsetX,
                allowScrollLeft,
                allowScrollTop,
                realScroll
            });

        const {xType, yType, elOffset, byRect} = getInViewTypeBy(el, scroller);

        let scrollLeft = scroller.scrollLeft;
        let scrollTop = scroller.scrollTop;
        let scrolled = false;
        if (forceScrollX || (allowScrollLeft && xType !== VIEW_TYPES.CONTAIN)) {
            scrolled = true;

            const baseLeftScrollValue = scrollLeft + elOffset.left - offsetLeft;

            const baseRightScrollValue = scrollLeft + (elOffset.left + elOffset.width - byRect.width) + offsetRight;

            if (forceScrollX || elOffset.left < 0) {
                // left
                scrollLeft = baseOffsetX === 'right' ? baseRightScrollValue : baseLeftScrollValue;
            } else if (elOffset.left + elOffset.width > byRect.width) {
                // right
                scrollLeft = baseOffsetX === 'left' ? baseLeftScrollValue : baseRightScrollValue;
            }

            if (forceScrollX) {
                scrollLeft =
                    baseOffsetX === 'left'
                        ? baseLeftScrollValue
                        : baseOffsetX === 'right'
                        ? baseRightScrollValue
                        : scrollLeft;
            }
        }

        if (forceScrollY || (allowScrollTop && yType !== VIEW_TYPES.CONTAIN)) {
            scrolled = true;

            const baseTopScrollValue = scrollTop + elOffset.top - offsetTop;

            const baseBottomScrollValue = scrollTop + (elOffset.top + elOffset.height - byRect.height) + offsetBottom;

            if (elOffset.top < 0) {
                // above
                scrollTop = baseOffsetY === 'bottom' ? baseBottomScrollValue : baseTopScrollValue;
            } else if (elOffset.top + elOffset.height > byRect.height) {
                // below
                scrollTop = baseOffsetY === 'top' ? baseTopScrollValue : baseBottomScrollValue;
            }

            if (forceScrollY) {
                scrollTop =
                    baseOffsetY === 'top'
                        ? baseTopScrollValue
                        : baseOffsetY === 'bottom'
                        ? baseBottomScrollValue
                        : scrollTop;
            }
        }

        // if need
        if (scrolled) {
            // console.log(scroller.scrollTop, '=>', scrollTop, scroller.scrollLeft, '=>', scrollLeft, scroller, '--- scrollTop change, scrollLeft change, scroller ---');
            scrollTo(scroller, {
                top: scrollTop,
                left: scrollLeft,
                behavior
            });
        }

        return scrolled;
    }
}
