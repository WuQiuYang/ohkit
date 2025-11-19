export interface IRgb {
  r: number;
  g: number;
  b: number;
}

export interface IRgba extends IRgb {
  a: number;
}

/**
 * 色值格式转换 HEX => RGB(A)
 * @param hex 标准的16进制颜色值，支持3位或6位表示（也兼容非标的4位或8位写法）
 * @param alpha 透明度，取值0~1
 * @returns 返回rgba或rgb颜色字符串
 */
export function hexToRgba(hex: string, alpha = 1) {
  if (hex.startsWith('rgb')) {
    return hex;
  }
  // 去除前缀
  if (hex.startsWith('#')) {
      hex = hex.slice(1);
  }

  // 处理3位颜色值
  if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(char => char + char).join('');
  }

  // 提取颜色通道值
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = hex.length === 8 ? +(parseInt(hex.slice(6, 8), 16) / 255).toFixed(3) : 1;
  alpha = alpha !== 1 ? alpha : a;

  // 格式化输出
  return alpha >= 0 && alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

/**
 * 获取rgba值
 * @param rgba rgba 或 16进制颜色值
 * @returns 返回 {r, g, b, a} 对象
 */
export function rgbaToObj(rgba: string) {
  if (!rgba) {
    return null;
  }
  if (!rgba.startsWith('rgb') && rgba.startsWith('#')) {
    rgba = hexToRgba(rgba);
  }
  const rgb = rgba.match(/\d+(?:\.\d+)?/g);
  if (!rgb) {
    console.warn('[rgbaToObj]: rgba error format');
    return null;
  }
  const a = rgb[3]
    ? Math.max(0, Math.min(+rgb[3], 1))
    : 1
  return {
      r: +rgb[0],
      g: +rgb[1],
      b: +rgb[2],
      a
  };
}

/**
 * 将rgba 生成HEX 色值
 * @param r red 数值, 取值 0~255
 * @param g green 数值, 取值 0~255
 * @param b blue 数值, 取值 0~255
 * @param a 透明度，取值 0~1
 * @returns 返回HEX颜色字符串
 */
export function rgbaObjToHex(rgbaObj: IRgba) {
  const {r, g , b, a = 1} = rgbaObj || {};
  if(r > 255 || r < 0 || g > 255 || g < 0 || b > 255 || b < 0 || a > 1 || a < 0) {
    console.warn('[rgbaObjToHex]: the val of rgba over limit');
    return '';
  }
  if (a === 1) {
    return `#${((r << 16) | (g << 8) | b).toString(16)}`;
  } else {
    return `#${((r << 16) | (g << 8) | b).toString(16)}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
  }
}

/**
 * 色值格式转换 RGBA => HEX
 * @param rgba rgba 标准的rgba颜色值，取值透明度0~1
 * @returns 返回HEX颜色字符串
 */
export function rgbaToHex(rgba: string) {
  if (!rgba.startsWith('rgb')) {
    console.warn('[rgbaToHex]: the input string no startsWith `rgb`');
    return rgba;
  }
  const rgbaObj = rgbaToObj(rgba);
  if (!rgbaObj) return '';
  return rgbaObjToHex(rgbaObj);
}

/**
 * 将一组RGBA颜色混合成RGB颜色，并以指定的背景色为背景进行混合
 *
 * @param rgbaArray RGBA颜色数组，数组中的每个元素是一个对象，包含r、g、b和可选的a属性
 * @param xBgObj 背景色，是一个对象，包含r、g、b属性，默认为白色（{r: 255, g: 255, b: 255}）
 * @returns 混合后的RGB颜色对象，包含r、g、b属性
 */
export function mixRgbaToRgbWithXbg(rgbaArray: IRgba[], xBgObj: IRgb = {
  r: 255,
  g: 255,
  b: 255
}) {
    // 初始化背景色为白色
    let background = [xBgObj.r, xBgObj.g, xBgObj.b];

    // 遍历RGBA颜色数组，按顺序叠加颜色
    for (const rgbaObj of rgbaArray) {
        const {r, g, b, a = 1} = rgbaObj;
        // 与背景色混合的公式：C' = C * A + (1 - A) * W
        // 其中C是RGBA中的RGB值，A是alpha值，W是背景色对应的RGB值（假如是白色，即 255, 255, 255）
        background = [
            Math.round(r * a + (1 - a) * background[0]),
            Math.round(g * a + (1 - a) * background[1]),
            Math.round(b * a + (1 - a) * background[2])
        ];
    }

    return {
      r: background[0],
      g: background[1],
      b: background[2],
    };
}