# @ohkit/dom-helper

DOM 背景色计算工具，提供精确的背景色计算功能。

## 安装

```bash
npm install @ohkit/dom-helper
# 或
yarn add @ohkit/dom-helper
```

## 功能列表

- 计算元素实际显示背景色（考虑父元素透明度叠加）
- RGB/RGBA颜色处理

## 完整 API 文档

### 类型定义

```typescript
interface IRgb {
  r: number;
  g: number;
  b: number;
}

interface IRgba extends IRgb {
  a: number;
}
```

### 背景色计算

#### `findEffectiveBgColor(dom: HTMLElement | null): IRgb`
计算元素实际显示背景色（考虑父元素透明度叠加）

```typescript
import { findEffectiveBgColor } from '@ohkit/dom-helper';

const element = document.getElementById('my-element');
const bgColor = findEffectiveBgColor(element);
console.log(bgColor); // { r: 255, g: 255, b: 255 }
```

#### `mixRgbaToRgbWithXbg(rgbaList: IRgb[], xBg: IRgb): IRgb`
混合多个RGBA颜色与基准背景色

```typescript
import { mixRgbaToRgbWithXbg } from '@ohkit/dom-helper';

const mixedColor = mixRgbaToRgbWithXbg([
  { r: 255, g: 0, b: 0, a: 0.5 },
  { r: 0, g: 255, b: 0, a: 0.5 }
], { r: 255, g: 255, b: 255 });
console.log(mixedColor); // 混合后的RGB颜色
```

### 颜色转换

#### `rgbaToObj(rgbaStr: string): IRgb | null`
将RGBA字符串转换为对象

```typescript
import { rgbaToObj } from '@ohkit/dom-helper';

const rgbaObj = rgbaToObj('rgba(255, 0, 0, 0.5)');
console.log(rgbaObj); // { r: 255, g: 0, b: 0, a: 0.5 }
```

#### `hexToRgba(hex: string, alpha?: number): string`
将HEX颜色转换为RGBA字符串

```typescript
import { hexToRgba } from '@ohkit/dom-helper';

const rgba = hexToRgba('#ff0000', 0.5);
console.log(rgba); // "rgba(255, 0, 0, 0.5)"
```

#### `rgbaToHex(rgba: string): string`
将RGBA字符串转换为HEX颜色

```typescript
import { rgbaToHex } from '@ohkit/dom-helper';

const hex = rgbaToHex('rgba(255, 0, 0, 0.5)');
console.log(hex); // "#ff000080"
```

#### `rgbaObjToHex(rgbaObj: IRgba): string`
将RGBA对象转换为HEX颜色

```typescript
import { rgbaObjToHex } from '@ohkit/dom-helper';

const hex = rgbaObjToHex({ r: 255, g: 0, b: 0, a: 0.5 });
console.log(hex); // "#ff000080"
```

## 贡献

欢迎提交 Pull Request 或 Issue。
