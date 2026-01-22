import {findParent} from '@ohkit/dom-helper';

/**
 * 查找影响 fixed 定位的父元素
 * 当父元素有 transform/filter/perspective 等属性时，fixed 定位会相对于该父元素
 */
export function findFixedPositionParent(dom?: HTMLElement | null): HTMLElement {
    if (!dom) {
        return document.documentElement;
    }
    const fixedPositionParent = findParent(dom, (parent) => {
        const style = window.getComputedStyle(parent);
        const transform = style.getPropertyValue('transform');
        const filter = style.getPropertyValue('filter');
        const perspective = style.getPropertyValue('perspective');
        
        // 检查是否有影响 fixed 定位的属性
        if (transform !== 'none' || filter !== 'none' || perspective !== 'none') {
            return true;
        }
    }, {excludeOwn: true}) || document.documentElement; // 没有找到，返回 window（通过 document.documentElement）
    return fixedPositionParent;
}

/**
 * 查找 absolute 定位的父元素
 * 查找最近的 position 不为 static 的元素
 */
export function findAbsolutePositionParent(dom?: HTMLElement | null): HTMLElement {
    if (!dom) {
        return document.body;
    }
    return findParent(dom, (parent) => {
        const style = window.getComputedStyle(parent);
        const position = style.getPropertyValue('position');
        if (position !== 'static') {
            return true;
        }
    }, {excludeOwn: true}) || document.body;
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
    // 扩大10倍进行计算，避免浮点数精度问题
    const scaleX = dom.offsetWidth > 0 ? Math.round(rect.width / dom.offsetWidth * 10) / 10 : 1;
    const scaleY = dom.offsetHeight > 0 ? Math.round(rect.height / dom.offsetHeight * 10) / 10 : 1;
    // console.log('scaleX', scaleX, 'scaleY', scaleY);
    return { scaleX, scaleY };
}
