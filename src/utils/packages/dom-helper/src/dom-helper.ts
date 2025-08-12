import {mixRgbaToRgbWithXbg, rgbaToObj, IRgb} from './color';

/**
 * 获取指定元素的背景颜色rgb值（考虑多层透明度叠加，计算近似值）
 *
 * @param dom 需要获取背景颜色的 DOM 元素，如果为 null 则返回白色背景
 * @returns 包含背景颜色 RGBA 值的对象，若无法获取到有效背景颜色则返回白色背景（rgba(255, 255, 255, 1)）
 */
function findEffectiveBgColor(dom: HTMLElement | null) {
  let node = dom;
  // 有透明度的图层
  const rgbaBgList = [];
  // 非透明图层rgb
  let xBgRgb: IRgb | null = null;
  while (node && !xBgRgb) {
    const style = window.getComputedStyle(node);
    if (style.backgroundColor) {
      const rgbaObj = rgbaToObj(style.backgroundColor);
      if (rgbaObj && rgbaObj.a > 0) {
        if (rgbaObj.a === 1) {
          xBgRgb = rgbaObj;
        } else {
          // 插入unshift 保持相对底层的透明度先行叠加
          rgbaBgList.unshift(rgbaObj)
        }
      }
    }
    node = node.parentElement;
  }
  // console.log('[findEffectiveBgColor]: xBgRgb:', xBgRgb);
  xBgRgb = xBgRgb || {
    r: 255,
    g: 255,
    b: 255,
  }
  // 有需要混合的透明图层
  if (rgbaBgList.length) {
    // console.log('[findEffectiveBgColor]: rgbaBgList:', rgbaBgList);
    const finalBg = mixRgbaToRgbWithXbg(rgbaBgList, xBgRgb);
    // console.log('[findEffectiveBgColor]: finalBg', finalBg);
    return finalBg;
  }

  return xBgRgb;
}