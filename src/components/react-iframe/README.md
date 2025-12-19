# @ohkit/react-iframe

iframe封装，replace变更src，避免干扰主页面history

## 安装

```bash
npm install @ohkit/react-iframe
```

## 特性

- 🔄 使用 `location.replace()` 替换 URL，避免干扰主页面历史记录
- ⚡ 智能加载状态管理，仅在必要时重新加载资源
- 🎯 支持同源 iframe 的 hashchange 事件监听
- 📱 响应式设计，自适应容器大小
- 🎨 内置加载状态提示
- 🔧 TypeScript 支持，完整的类型定义

## 使用

### 基础用法

```tsx
import { ReactIframe } from '@ohkit/react-iframe';
import '@ohkit/react-iframe/dist/index.css';

function App() {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ReactIframe src="https://example.com" />
    </div>
  );
}
```

### 带加载回调

```tsx
function App() {
  const handleLoadStart = () => {
    console.log('开始加载');
  };

  const handleLoadEnd = () => {
    console.log('加载完成');
  };

  return (
    <ReactIframe 
      src="https://example.com"
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoadEnd}
    />
  );
}
```

### 自定义样式

```tsx
function App() {
  return (
    <ReactIframe 
      src="https://example.com"
      className="custom-iframe"
      style={{ border: '2px solid #ccc' }}
    />
  );
}
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | `string` | - | **必需**，iframe 的源地址 |
| iframeName | `string` | - | iframe 名称，会作为查询参数添加到 URL 中 |
| className | `string` | '' | 容器的自定义类名 |
| onLoadStart | `() => void` | - | 开始加载时的回调函数 |
| onLoadEnd | `() => void` | - | 加载完成时的回调函数 |
| onLoad | `(event: React.SyntheticEvent<HTMLIFrameElement>) => void` | - | iframe 加载完成的原生事件回调 |
| children | `ReactNode` | '你的浏览器不支持iframe' | iframe 的后备内容 |

### 继承属性

ReactIframe 组件继承了所有标准的 `HTMLIFrameElement` 属性，包括但不限于：

- `width` (默认: '100%')
- `height` (默认: '100%')  
- `frameBorder` (默认: 0)
- `allowFullScreen`
- `sandbox`
- `loading`
- 等等...

## 工作原理

### URL 替换策略

组件使用 `location.replace()` 方法来更新 iframe 的源地址，而不是直接修改 `src` 属性。这样做的好处是：

- 不会在浏览器历史记录中产生新条目
- 避免用户点击后退按钮时意外回到 iframe 的上一个页面
- 提供更流畅的用户体验

### 智能重载

组件会检测 URL 变化的类型：

- **仅 hash 变化**：不会重新加载，直接更新
- **origin、pathname 或 search 变化**：会显示加载状态并重新加载资源

### 同源支持

对于同源的 iframe，组件会自动监听内部的 `hashchange` 事件，便于与 iframe 内容进行交互。

## 许可证

ISC

## 相关链接

- [GitHub 仓库](https://github.com/WuQiuYang/ohkit)
- [Storybook 文档](https://wuqiuyang.github.io/ohkit/storybook-static)
- [npm 包](https://www.npmjs.com/package/@ohkit/react-iframe)