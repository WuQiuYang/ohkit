import {findParent} from '@ohkit/dom-helper';

/**
 * 检查元素是否创建了新的定位上下文(包含块)
 * @param element 要检查的元素
 * @param includePosition 是否检查position属性(absolute/relative/fixed)
 */
export function isPositioningContextCreator(element: HTMLElement, includePosition: boolean): boolean {
    const style = window.getComputedStyle(element);
    const position = style.getPropertyValue('position');
    const transform = style.getPropertyValue('transform');
    const filter = style.getPropertyValue('filter');
    const perspective = style.getPropertyValue('perspective');
    const contain = style.getPropertyValue('contain');
    const willChange = style.getPropertyValue('will-change');
    
    return (includePosition && position !== 'static') || 
        transform !== 'none' || 
        filter !== 'none' || 
        perspective !== 'none' ||
        contain.includes('paint') ||
        contain.includes('layout') ||
        contain.includes('strict') ||
        willChange.includes('transform') ||
        willChange.includes('perspective') ||
        willChange.includes('filter');
}

/**
 * 查找影响 fixed 定位的父元素
 * 当父元素有 transform/filter/perspective/contain/will-change 等属性时，fixed 定位会相对于该父元素
 */
export function findFixedPositionParent(dom?: HTMLElement | null) {
    if (!dom) {
        return document.documentElement;
    }
    const fixedPositionParent = findParent(dom, (parent) => {
        return isPositioningContextCreator(parent, false);
    }, {excludeOwn: true}); // 没有找到，返回 window（通过 document.documentElement）
    return fixedPositionParent;
}

/**
 * 查找 absolute 定位的父元素
 * 查找最近的包含块创建者，包含所有可能影响absolute定位的属性
 */
export function findAbsolutePositionParent(dom?: HTMLElement | null) {
    if (!dom) {
        return document.body;
    }
    return findParent(dom, (parent) => {
        return isPositioningContextCreator(parent, true);
    }, {excludeOwn: true});
}

/**
 * 获取容器的缩放比例
 * 通过比较元素的实际尺寸和 getBoundingClientRect 返回的尺寸来计算缩放比例
 */
export function getScaleRatio(dom?: HTMLElement | null): { scaleX: number; scaleY: number } {
    if (!dom) {
        return { scaleX: 1, scaleY: 1 };
    }
    // 通过比较 offsetWidth 和 getBoundingClientRect().width 来获取缩放比例
    const rect = dom.getBoundingClientRect();
    let scaleX = 1;
    let scaleY = 1;
    // 扩大{magnification}倍进行计算, 相当于保留小数点后4位
    const magnification = 10000;
    scaleX = dom.offsetWidth > 0 ? Math.round(rect.width / dom.offsetWidth * magnification) / magnification : 1;
    scaleY = dom.offsetHeight > 0 ? Math.round(rect.height / dom.offsetHeight * magnification) / magnification : 1;
    // console.log('rect.width dom.offsetWidth', rect.width, dom.offsetWidth);
    // console.log('rect.height dom.offsetHeight', rect.height, dom.offsetHeight);
    // console.log('scaleX', scaleX, 'scaleY', scaleY);
    return { scaleX, scaleY };
}

/**
 * 限制数值在指定范围内
 * 
 * @param value 要限制的数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值，确保在 [min, max] 范围内
 */
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}


/**
 * 检测当前环境是否支持触摸事件
 * 
 * @returns 如果环境支持触摸事件返回 true，否则返回 false
 */
export function supportsTouchEvents() {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
};