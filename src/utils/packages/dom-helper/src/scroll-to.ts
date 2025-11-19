interface ScrollToOptions {
    top?: number;
    left?: number;
    behavior?: ScrollBehavior;
}

interface CustomSmoothScrollOptions {
    top?: number;
    left?: number;
    onAnimationEnd?: () => void;
}

/**
 * 滚动到指定位置
 *
 * @param scroller 需要滚动的元素
 * @param options 滚动选项
 * @param options.top 目标垂直位置
 * @param options.left 目标水平位置
 * @param options.behavior 滚动行为，可选值为 'auto' 或 'smooth'，默认为 'auto'
 */
export function scrollTo(scroller: HTMLElement, {top, left, behavior}: ScrollToOptions = {}): void {
    const fallbackScroll = () => {
        typeof left !== 'undefined' && (scroller.scrollLeft = left);
        typeof top !== 'undefined' && (scroller.scrollTop = top);
    };

    if (typeof scroller.scroll === 'function') {
        try {
            // console.log(scroller.scrollTop, scroller.scrollLeft, top, left, scroller === document.scrollingElement, 'scroll before');
            if (behavior === 'smooth') {
                customSmoothScroll(scroller, {
                    top,
                    left
                })
            } else {
                scroller.scroll({
                    top,
                    left,
                    behavior
                });
            }
            // console.log(scroller.scrollTop, scroller.scrollLeft, top, left, scroller === document.scrollingElement, 'scroll after');
            // fallbackScroll();
        } catch (err) {
            console.error(err);
            fallbackScroll();
        }
    } else {
        fallbackScroll();
    }
}

/**
 * 自定义平滑滚动函数
 *
 * @param scroller 滚动的元素
 * @param opt 滚动选项
 */
export function customSmoothScroll(scroller: HTMLElement, opt: CustomSmoothScrollOptions): void {
    if (scroller && typeof scroller.scroll === 'function' && opt) {
        const {top = scroller.scrollTop, left = scroller.scrollLeft, onAnimationEnd} = opt;
        const allowDiff = 1;
        let times = 0;
        const runner = () => {
            // 兜底处理，避免未知异常导致死循环
            if (times > 20) {
                return;
            }
            times++;
            const diffTop = top - scroller.scrollTop;
            const diffLeft = left - scroller.scrollLeft;
            const needMoveTop = Math.abs(diffTop) > allowDiff;
            const needMoveLeft = Math.abs(diffLeft) > allowDiff;
            if (needMoveTop || needMoveLeft) {
                // 滚动值低于1px时无法执行
                const preTickTop = scroller.scrollTop + (diffTop > 0 ? Math.ceil(diffTop / 2) : Math.floor(diffTop / 2));
                const preTickLeft = scroller.scrollLeft + (diffLeft > 0 ? Math.ceil(diffLeft / 2) : Math.floor(diffLeft / 2));
                const opt: ScrollToOptions = {
                    behavior: 'instant' as ScrollBehavior
                };
                needMoveTop && (opt.top = preTickTop);
                needMoveLeft && (opt.left = preTickLeft);
                scroller.scroll(opt);
                // console.log(scroller.scrollTop, '=>', top, ';', scroller.scrollLeft, '=>', left, scroller, 'scroll to target with smooth animation, scroller');
                // scroll的smooth效果会被打断，使用requestAnimationFrame模拟smooth动画
                requestAnimationFrame(() => {
                    runner();
                });
            } else {
                // console.log('scroll animation end');
                onAnimationEnd && onAnimationEnd();
            }
        };
        runner();
    }
}