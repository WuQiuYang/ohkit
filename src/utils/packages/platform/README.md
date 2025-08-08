# `@ohkit/platform`

> 平台检测工具，提供浏览器环境判断和浏览器类型检测

## 安装
```bash
npm install @ohkit/platform
```

## 功能特性
- 浏览器环境检测
- 浏览器类型判断(Chrome/Safari/Firefox)
- 安全的全局对象访问
- SSR(服务端渲染)兼容

## 基本用法

```ts
import { inBrowser, isChrome, platform } from '@ohkit/platform';

if (inBrowser) {
  console.log('Running in browser');
  if (isChrome) {
    console.log('Using Chrome browser');
  }
}

// 安全访问全局对象
const globalObj = platform.global;
```

## API 说明

### 变量

| 变量 | 说明 | 类型 |
|------|------|------|
| inBrowser | 是否在浏览器环境 | boolean |
| isChrome | 是否是Chrome浏览器 | boolean |
| isSafari | 是否是Safari浏览器 | boolean |
| isFirefox | 是否是Firefox浏览器 | boolean |

### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| safeRunInSSR | 安全执行SSR兼容代码 | `fn: Fn`, `failback?: Fn` | `ReturnType<T> \| ReturnType<K>` |

### platform 对象

| 属性 | 说明 | 类型 |
|------|------|------|
| global | 安全的全局对象 | `Window \| Global \| object` |
| isChrome | 是否是Chrome浏览器 | boolean |
| isSafari | 是否是Safari浏览器 | boolean |
| isFirefox | 是否是Firefox浏览器 | boolean |
| inBrowser | 是否在浏览器环境 | boolean |

## 高级用法

### SSR兼容代码

```ts
import { safeRunInSSR } from '@ohkit/platform';

const result = safeRunInSSR(
  () => window.localStorage.getItem('key'),
  () => null
);
```

### 扩展平台检测

```ts
const isMobile = safeRunInSSR(
  () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  () => false
);
```

## 注意事项
1. 在SSR环境下，浏览器相关API不可用
2. 浏览器检测基于userAgent，可能被伪造
3. 建议在需要时动态导入此工具