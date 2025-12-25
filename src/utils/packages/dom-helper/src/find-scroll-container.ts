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

export const fallbackScrollerContainer = (() => {
    // if (typeof document === 'undefined') {
    //     return null;
    // }
    return (
        (window.document.scrollingElement as HTMLElement)
        || window.document.documentElement || window.document.body
    );
})();

export interface FindScrollContainerOption<F extends (undefined | (() => HTMLElement | null)) = undefined> {
    /**
     * 滚动方向
     * @default 'both'
     */
    overflowStyleName?: 'overflowX' | 'overflowY' | 'both';
    /**
     * 是否排除自身
     * @default false
     */
    excludeOwn?: boolean;
    /**
     * 是否需要真实的滚动容器，即滚动内容高度大于容器高度
     * @default false
     */
    realScroll?: boolean;
    /**
     * 找不到滚动容器时返回的默认容器
     * @default () => document.scrollingElement || document.documentElement || document.body
     */
    fallback?: F;
}

/**
 * 返回滚动dom容器（特殊：根文档元素滚动时，返回的是documentElement 不可注册scroll事件的）
 * 
 * document.documentElement 的特殊性：
 * 它是整个文档的根元素（通常是 <html>）
 * 浏览器将视口滚动委托给 window 对象处理
 * 即使设置了 overflow，也不直接在根元素上触发 scroll 事件
 * 
 * 注意：传入的el尽量贴近目标滚动容器，中间层级非滚动目的设置的overflow会影响查找结果
 * @returns 
 */
export function findScrollContainer<F extends (undefined | (() => HTMLElement | null)) = undefined>(el: HTMLElement | Range | null, {
    overflowStyleName = 'both',
    excludeOwn = false,
    realScroll = false,
    fallback = () => fallbackScrollerContainer,
}: FindScrollContainerOption<F> = {}) {
    if (!el) {
        return fallback() as F extends undefined ? HTMLElement : ReturnType<NonNullable<F>>;
    }
    const scrollContainer =  (
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
            const check = (overflowStyleKey: 'overflowX' | 'overflowY') => {
                if (OVERFLOWS.includes(style[overflowStyleKey])) {
                    if (realScroll) {
                        const {offsetKey, scrollKey} = ScrollOffsetMap[overflowStyleKey];
                        return node[scrollKey] > node[offsetKey];
                    }
                    return true;
                }
                return false;
            }
            return (
                overflowStyleName === 'both'
                    ? check('overflowY') || check('overflowX')
                    : check(overflowStyleName)
            );
        }, {
            excludeOwn,
        }) || fallback?.()
    );
    return scrollContainer as F extends undefined ? HTMLElement : ReturnType<NonNullable<F>>;
}

/**
 * 返回滚动容器（特殊：根文档元素滚动时，返回的是window对象，均可注册scroll事件的）
 */
export function findScroller<F extends (undefined | (() => HTMLElement | null)) = undefined>(el: HTMLElement | Range | null, opts?: FindScrollContainerOption<F>) {
    const container = findScrollContainer(el, opts);
    if (container === fallbackScrollerContainer) {
        // if (typeof window !== 'undefined') {
        //     return window;
        // }
        // if (typeof document !== 'undefined') {
        //     return document;
        // }
        // return null;
        return window;
    }
    return container;
}

export default findScrollContainer;
