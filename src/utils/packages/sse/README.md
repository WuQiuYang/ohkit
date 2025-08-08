# `@ohkit/sse`

> Server-Sent Events (SSE) 处理工具，用于解析和分割SSE流数据

## 安装
```bash
npm install @ohkit/sse
```

## 功能特性
- SSE流数据解析
- 流数据分割处理
- JSON数据自动解析
- 支持多种事件类型(message/heartbeat/error/end)

## 基本用法

### 解析SSE流
```ts
import { formatSSEStream } from '@ohkit/sse';

const events = formatSSEStream(`
id:1
event:message
data:{"status":"success","data":{"key":"value"}}

id:2
event:message
data:{"status":"success","data":{"key":"value2"}}
`);

events.forEach(event => {
  console.log(event.dataJson); // 已解析的JSON数据
});
```

### 流分割器
```ts
import { createSSEStreamSpliter } from '@ohkit/sse';

const splitter = createSSEStreamSpliter();

// 在XHR onprogress回调中使用
const onprogress = (text) => {
  const completeEvents = splitter(text);
  if (completeEvents) {
    const parsedEvents = formatSSEStream(completeEvents);
    // 处理完整事件
  }
};
```

## API 说明

### 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| formatSSEStream | 解析SSE流数据 | `stream: string` | `SSEEvent[]` |
| createSSEStreamSpliter | 创建流分割器 | - | `(text: string) => string` |

### 类型

| 类型 | 说明 |
|------|------|
| SSEEvent | SSE事件对象结构 |
| IEventData | 事件数据格式 |
| ResponseJSON | 响应JSON格式 |

## 高级用法

### 处理分块流
```ts
const splitter = createSSEStreamSpliter();
let buffer = '';

function handleStreamChunk(chunk) {
  buffer += chunk;
  const completeEvents = splitter(buffer);
  
  if (completeEvents) {
    const events = formatSSEStream(completeEvents);
    events.forEach(event => {
      // 处理每个完整事件
    });
  }
}
```

### 自定义事件处理
```ts
const events = formatSSEStream<CustomData>(stream);

events.forEach(event => {
  if (event.event === 'message') {
    const customData = event.dataJson as CustomData;
    // 处理自定义数据
  }
});
```

## 注意事项
1. 确保服务端发送的SSE格式正确
2. 处理分块数据时注意缓冲区管理
3. 错误事件需要特殊处理