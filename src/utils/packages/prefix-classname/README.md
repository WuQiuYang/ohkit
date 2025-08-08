# `@ohkit/prefix-classname`

> 类名前缀工具，基于classnames库添加前缀功能

## 安装
```bash
npm install @ohkit/prefix-classname
```

## 功能特性
- 为CSS类名添加统一前缀
- 兼容classnames库的所有功能
- 支持嵌套类名处理
- 类型安全

## 基本用法

```ts
import prefixClassname from '@ohkit/prefix-classname';

const prefix = prefixClassname('prefix-');

// 添加前缀
const className = prefix('btn', { active: true });
// 输出: 'prefix-btn prefix-active'
```

## API 说明

### prefixClassname 函数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prefix | 类名前缀 | string | '' |

返回一个函数，该函数接受与classnames相同的参数，返回添加前缀后的类名字符串。

## 高级用法

### 结合classnames使用

```ts
import { classNames, prefixClassname } from '@ohkit/prefix-classname';

const prefix = prefixClassname('prefix-');
const baseClass = classNames('base', 'component');

const className = prefix(baseClass, 'variant');
// 输出: 'prefix-base prefix-component prefix-variant'
```

### 多级前缀

```ts
const componentPrefix = prefixClassname('comp-');
const themePrefix = prefixClassname('theme-');

const className = themePrefix(componentPrefix('button'));
// 输出: 'theme-comp-button'
```

## 注意事项
1. 前缀会应用于所有类名，包括通过对象语法添加的类名
2. 空字符串或undefined/null值会被忽略
3. 支持嵌套数组结构