# `@ohkit/json-helper`

> JSON处理工具，提供安全的JSON解析、序列化和深拷贝功能

## 安装
```bash
npm install @ohkit/json-helper
```

## 功能特性
- 安全的JSON解析（错误处理）
- 安全的JSON序列化
- 深拷贝实现
- 自动处理常见JSON格式问题

## 基本用法

```ts
import { safeParse, safeStringify, safeCloneDeep } from '@ohkit/json-helper';

// 安全解析JSON
const data = safeParse('{"key":"value"}'); 

// 安全序列化
const jsonStr = safeStringify({ key: 'value' });

// 深拷贝
const cloned = safeCloneDeep(originalObj);
```

## API 说明

### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| safeParse | 安全解析JSON字符串 | `data: string` | `T \| null` |
| safeStringify | 安全序列化为JSON字符串 | `data: any` | `string` |
| safeCloneDeep | 深拷贝对象 | `data: T` | `T` |

## 高级用法

### 处理特殊JSON格式

```ts
// 自动处理包含换行符的JSON
const data = safeParse('{"text":"line1\nline2"}');
```

### 组合使用

```ts
// 安全的深拷贝实现
function clone<T>(obj: T): T {
  return safeParse<T>(safeStringify(obj)) as T;
}
```

## 注意事项
1. safeParse在解析失败时会返回null
2. safeStringify在序列化失败时会返回空字符串
3. 对于循环引用的对象，建议使用专门的处理库