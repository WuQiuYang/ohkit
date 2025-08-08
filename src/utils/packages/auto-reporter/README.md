# `@ohkit/auto-reporter`

> 自动数据上报工具，适用于自动保存、操作频次打点等场景

## 安装
```bash
npm install @ohkit/auto-reporter
```

## 功能特性
- 基于时间和操作次数的自动上报触发
- 支持页面关闭前的数据上报
- 可配置的上报策略
- 支持Promise串行上报

## 基本用法

```ts
import { AutoReporter } from '@ohkit/auto-reporter';

const reporter = new AutoReporter({
  onReport: async () => {
    // 上报逻辑
    await saveData();
  }
});

// 数据变更时调用
reporter.change();

// 手动立即上报
reporter.flush();
```

## 配置参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| onReport | 上报回调函数 | `() => Promise<void> \| void` | - |
| maxTimes | 最大变更次数触发上报 | number | 20 |
| duration | 最长等待时间(ms) | number | 30000 |
| triggerFlushBeforeUnload | 是否在页面关闭前上报 | boolean | true |
| reportPipe | 是否串行上报 | boolean | false |
| beforeUploadConfirm | 页面关闭前是否提示用户 | boolean | false |

## API 说明

### AutoReporter 类

#### 方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| change() | 记录数据变更 | void |
| flush() | 立即触发上报 | `Promise<void> \| void` |
| reset() | 重置上报状态 | void |
| cancel() | 取消上报(同reset) | void |
| updateConfig() | 更新配置 | void |
| register() | 注册上报回调 | void |

#### 属性

| 属性 | 说明 | 类型 |
|------|------|------|
| pending | 是否有待上报数据 | boolean |

## 高级用法

### 自定义上报策略

```ts
const reporter = new AutoReporter({
  maxTimes: 10, // 10次变更后上报
  duration: 5000, // 或5秒后上报
  onReport: saveData
});
```

### 串行上报

```ts
const reporter = new AutoReporter({
  reportPipe: true, // 确保上报顺序
  onReport: async () => {
    // 串行执行的上报逻辑
  }
});
```

## 注意事项
1. 确保onReport回调正确处理Promise
2. 在SPA应用中注意路由切换时的上报处理
3. 高频操作场景建议适当调整maxTimes和duration