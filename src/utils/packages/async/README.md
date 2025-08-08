# `@ohkit/async`

> Promise串行管道工具，用于管理异步任务的顺序执行

## 安装
```bash
npm install @ohkit/async
```

## 功能特性
- 管理Promise任务的串行执行
- 支持任务队列
- 提供任务执行状态回调
- 灵活的任务触发控制

## 基本用法

```ts
import { PromisePipe } from '@ohkit/async';

const pipe = new PromisePipe();

// 添加并立即执行任务
pipe.add(async () => {
  await fetch('/api/data1');
});

// 添加延迟执行任务
pipe.add(async () => {
  await fetch('/api/data2');
}, { fireImmediately: false });

// 手动启动执行
pipe.start();
```

## API 说明

### PromisePipe 类

#### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| add | 添加异步任务 | `fun: PromiseTask`, `opt?: { returnWaitAll?: boolean, fireImmediately?: boolean }` | `Promise<T>` |
| start | 开始执行队列中的任务 | - | - |

#### 参数说明

- `PromiseTask`: `() => Promise<T> | void` 异步任务函数
- `returnWaitAll`: 是否等待所有任务完成
- `fireImmediately`: 是否立即执行任务

## 高级用法

### 获取任务执行结果

```ts
const result = await pipe.add(async () => {
  return await fetch('/api/data');
}, { returnWaitAll: true });
```

### 任务状态回调

```ts
pipe.add(async () => {
  // 任务逻辑
}, {
  fireImmediately: false,
  returnWaitAll: true
}).then(res => {
  console.log('任务完成:', res);
});
```

## 注意事项
1. 任务函数需要返回Promise才能保证串行执行
2. 默认情况下任务会立即执行
3. 使用returnWaitAll表示需要等待pipe中所有任务完成后才resolve