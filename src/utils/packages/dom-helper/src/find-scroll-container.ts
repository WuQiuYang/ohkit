// import {isSafari} from '../platform';

import {findParent} from './find-parent';

const OVERFLOWS = ['auto', 'overlay', 'scroll'];

const ScrollOffsetMap: Record<'overflowY' | 'overflowX', {
    offsetKey: 'offsetHeight' | 'offsetWidth';
    scrollKey: 'scrollHeight' | 'scrollWidth';
    // clientKey: 'clientHeight' | 'clientWidth',
}> = {
    overflowY: {
        offsetKey: 'offsetHeight',
        scrollKey: 'scrollHeight',
    },
    overflowX: {
        offsetKey: 'offsetWidth',
        scrollKey: 'scrollWidth',
    },
};

export const fallbackScrollerContainer: HTMLElement = (() => {
    // if (typeof document === 'undefined') {
    //     return null;
    // }
    return (
        (window.document.scrollingElement as HTMLElement)
        || window.document.documentElement || window.document.body
    );
})();

export interface FindScrollContainerOption {
    overflowStyleName?: 'overflowX' | 'overflowY';
    excludeOwn?: boolean;
    realScroll?: boolean;
    fallback?: () => HTMLElement;
}

// 返回滚动dom容器（但documentElement不可注册scroll事件的）
// 注意：传入的el尽量贴近目标滚动容器，中间层级非滚动目的设置的overflow会影响查找结果
// el支持Range和Element
export function findScrollContainer(el: HTMLElement | Range | null, {
    overflowStyleName = 'overflowY',
    excludeOwn = false,
    realScroll = false,
    fallback = () => fallbackScrollerContainer,
}: FindScrollContainerOption = {}) {
    if (!el) {
        return fallback && fallback();
    }
    return (
        findParent(el, (node) => {
            if (!node) {
                return false;
            }
            if (node.nodeType === 3 && node.parentElement) {
                node = node.parentElement;
            }
            if (node.nodeType !== 1) {
                return false;
            }
            const style = window.getComputedStyle(node);
            if (OVERFLOWS.includes(style[overflowStyleName])) {
                if (realScroll) {
                    const {offsetKey, scrollKey} = ScrollOffsetMap[overflowStyleName];
                    return node[scrollKey] > node[offsetKey];
                }
                return true;
            }
        }, {
            excludeOwn,
        }) || (fallback && fallback())
    );
}

// 返回滚动容器（均可注册scroll事件的）
export function findScroller(el: HTMLElement | Range, opts: FindScrollContainerOption) {
    const container = findScrollContainer(el, opts);
    if (container === fallbackScrollerContainer) {
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof document !== 'undefined') {
            return document;
        }
        return null;
    }
    return container;
}

export default findScrollContainer;
