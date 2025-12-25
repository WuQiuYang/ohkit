# @ohkit/dom-helper

强大的 DOM 操作工具集，提供元素查找、滚动控制、全屏管理、颜色处理等常用功能。

## 安装

```bash
npm install @ohkit/dom-helper
# 或
yarn add @ohkit/dom-helper
```

## 功能列表

### 🎨 颜色处理
- 计算元素实际显示背景色（考虑父元素透明度叠加）
- RGB/RGBA/HEX 颜色格式转换
- 多层颜色混合计算

### 📍 元素查找与定位
- 查找父级元素
- 查找滚动容器
- 获取元素位置和尺寸信息
- 判断元素在视口中的可见性

### 📜 滚动控制
- 智能滚动到指定元素
- 自定义滚动行为
- 平滑滚动动画

### 🖥️ 全屏管理
- 浏览器全屏 API 封装
- 网页全屏实现
- 跨浏览器兼容性处理

### ⚡ 交互增强
- 动态添加/移除 CSS 类
- 事件监听器管理
- 元素闪烁效果

## 完整 API 文档

### 🎨 颜色处理

#### `findEffectiveBgColor(dom: HTMLElement | null): IRgb`
计算元素实际显示背景色（考虑父元素透明度叠加）

```typescript
import { findEffectiveBgColor } from '@ohkit/dom-helper';

const element = document.getElementById('my-element');
const bgColor = findEffectiveBgColor(element);
console.log(bgColor); // { r: 255, g: 255, b: 255 }
```

#### `hexToRgba(hex: string, alpha?: number): string`
将HEX颜色转换为RGBA字符串

```typescript
import { hexToRgba } from '@ohkit/dom-helper';

const rgba = hexToRgba('#ff0000', 0.5);
console.log(rgba); // "rgba(255, 0, 0, 0.5)"
```

#### `rgbaToObj(rgbaStr: string): IRgb | null`
将RGBA字符串转换为对象

```typescript
import { rgbaToObj } from '@ohkit/dom-helper';

const rgbaObj = rgbaToObj('rgba(255, 0, 0, 0.5)');
console.log(rgbaObj); // { r: 255, g: 0, b: 0, a: 0.5 }
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

#### `mixRgbaToRgbWithXbg(rgbaArray: IRgba[], xBgObj?: IRgb): IRgb`
混合多个RGBA颜色与基准背景色

```typescript
import { mixRgbaToRgbWithXbg } from '@ohkit/dom-helper';

const mixedColor = mixRgbaToRgbWithXbg([
  { r: 255, g: 0, b: 0, a: 0.5 },
  { r: 0, g: 255, b: 0, a: 0.5 }
], { r: 255, g: 255, b: 255 });
console.log(mixedColor); // 混合后的RGB颜色
```

### 📍 元素查找与定位

#### `findParent(el: HTMLElement | Range, match: (el: HTMLElement) => boolean, options?: { excludeOwn?: boolean }): HTMLElement | null`
向上查找满足条件的父级元素

```typescript
import { findParent } from '@ohkit/dom-helper';

const parent = findParent(element, (el) => el.classList.contains('container'));
```

#### `findScrollContainer(el: HTMLElement | Range, options?: FindScrollContainerOption): HTMLElement`
查找元素的滚动容器

```typescript
import { findScrollContainer } from '@ohkit/dom-helper';

const scroller = findScrollContainer(element, {
  overflowStyleName: 'overflowY',
  realScroll: true
});
```

#### `getRect(el: HTMLElement | Range, options?: GetRectOptions): Rect`
获取元素的矩形区域信息

```typescript
import { getRect } from '@ohkit/dom-helper';

const rect = getRect(element);
console.log(rect); // { width: 100, height: 50, left: 10, top: 20 }
```

#### `getOffsetBy(elem: HTMLElement | Range, byElem?: HTMLElement): OffsetResult`
获取元素相对于指定元素的偏移量

```typescript
import { getOffsetBy } from '@ohkit/dom-helper';

const offset = getOffsetBy(element, container);
console.log(offset); // { left: 10, top: 20, width: 100, height: 50 }
```

#### `getInViewTypeBy(el: HTMLElement | Range, byEl?: HTMLElement): InViewResult`
判断元素在视口中的可见性类型

```typescript
import { getInViewTypeBy, VIEW_TYPES } from '@ohkit/dom-helper';

const viewInfo = getInViewTypeBy(element);
console.log(viewInfo.xType); // 'contain' | 'intersection' | 'parallel'
console.log(viewInfo.yType); // 'contain' | 'intersection' | 'parallel'
```

### 📜 滚动控制

#### `scrollTo(scroller: HTMLElement, options?: ScrollToOptions): void`
滚动到指定位置

```typescript
import { scrollTo } from '@ohkit/dom-helper';

scrollTo(scroller, {
  top: 100,
  left: 0,
  behavior: 'smooth'
});
```

#### `scrollIntoViewIfNeeded(el: HTMLElement | Range, options?: ScrollOptions): boolean`
智能滚动元素到可视区域

```typescript
import { scrollIntoViewIfNeeded } from '@ohkit/dom-helper';

const scrolled = scrollIntoViewIfNeeded(element, {
  behavior: 'smooth',
  offsetTop: 20,
  offsetBottom: 20,
  allowScrollTop: true,
  allowScrollLeft: false
});
```

### 🖥️ 全屏管理

#### `launchFullscreen(element?: Element, options?: ILaunchFullscreenOptions): Promise<boolean>`
启动全屏模式

```typescript
import { launchFullscreen } from '@ohkit/dom-helper';

// 浏览器全屏
await launchFullscreen(element, {
  className: 'fullscreen-mode',
  onEnter: () => console.log('进入全屏'),
  onExit: () => console.log('退出全屏')
});

// 网页全屏
await launchFullscreen(element, {
  onlyFullPage: true
});
```

#### `exitFullscreen(): Promise<boolean>`
退出全屏模式

```typescript
import { exitFullscreen } from '@ohkit/dom-helper';

await exitFullscreen();
```

#### `launchFullPage(element?: Element, options?: IFullscreenOptions): boolean`
启动网页全屏

```typescript
import { launchFullPage } from '@ohkit/dom-helper';

launchFullPage(element, {
  className: 'full-page-mode'
});
```

#### `exitFullPage(element: Element | null): boolean`
退出网页全屏

```typescript
import { exitFullPage } from '@ohkit/dom-helper';

exitFullPage(element);
```

### ⚡ 交互增强

#### `addClass(dom: HTMLElement, className: string): (() => void) | null`
添加CSS类并返回移除函数

```typescript
import { addClass } from '@ohkit/dom-helper';

const removeClass = addClass(element, 'active');
// 稍后移除
removeClass();
```

#### `addEventListener(dom: Window | Document, type: string, cb: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): () => void`
添加事件监听器并返回移除函数

```typescript
import { addEventListener } from '@ohkit/dom-helper';

const removeListener = addEventListener(window, 'resize', handler);
// 稍后移除
removeListener();
```

#### `blinkDom(dom: HTMLElement, options?: BlinkDomOptions): void | (() => void)`
让元素闪烁

```typescript
import { blinkDom } from '@ohkit/dom-helper';

const stopBlink = blinkDom(element, {
  duration: 2000,
  className: 'blink',
  onExit: () => console.log('闪烁结束')
});
```

## 类型定义

### 颜色相关
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

### 位置相关
```typescript
interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
}

interface OffsetResult extends Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}
```

### 滚动相关
```typescript
interface ScrollToOptions {
  top?: number;
  left?: number;
  behavior?: ScrollBehavior;
}

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
}
```

### 全屏相关
```typescript
interface IFullscreenOptions {
  element?: Element | null;
  className?: string;
  onEnter?: () => void;
  onExit?: () => void;
}

interface ILaunchFullscreenOptions extends IFullscreenOptions {
  onlyFullPage?: boolean;
}
```

### 可见性类型
```typescript
const VIEW_TYPES = {
  CONTAIN: 'contain',      // 完全包含在视口内
  INTERSECTION: 'intersection', // 与视口有交集
  PARALLEL: 'parallel'     // 与视口平行（无交集）
} as const;

type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];
```

## 浏览器兼容性

- **现代浏览器**: 完全支持
- **IE11+:** 基本功能支持（全屏功能需要 polyfill）
- **Safari:** 全屏功能有特殊处理，确保兼容性

## 贡献

欢迎提交 Pull Request 或 Issue。

## 许可证

MIT License