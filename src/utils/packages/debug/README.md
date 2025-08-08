# `@ohkit/debug`

> 调试日志工具，提供统一的日志输出格式和前缀管理

## 安装
```bash
npm install @ohkit/debug
```

## 功能特性
- 统一的日志输出格式
- 支持日志前缀管理
- 提供log/warn/error三种日志级别
- 支持链式调用

## 基本用法

```ts
import { Debug } from '@ohkit/debug';

const debug = new Debug({ prefix: 'MyApp' });

// 输出日志
debug.log('This is a log message');
debug.warn('This is a warning');
debug.error('This is an error');
```

## API 说明

### Debug 类

#### 构造函数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options.prefix | 日志前缀 | string | '' |

#### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| log | 输出普通日志 | `...args: any[]` | void |
| warn | 输出警告日志 | `...args: any[]` | void |
| error | 输出错误日志 | `...args: any[]` | void |
| addPrefix | 添加前缀 | `prefix: string` | `Debug`实例 |

## 高级用法

### 链式调用

```ts
const debug = new Debug()
  .addPrefix('ModuleA')
  .addPrefix('ComponentX');

debug.log('Initialized'); 
// 输出: *** ->ModuleA->ComponentX *** : Initialized
```

### 自定义日志格式

```ts
class CustomDebug extends Debug {
  log(...args: any[]) {
    console.log(`[${new Date().toISOString()}]`, ...args);
  }
}
```

## 注意事项
1. 在生产环境建议禁用或限制日志输出
2. 前缀有助于区分不同模块的日志
3. 可继承Debug类实现自定义日志格式