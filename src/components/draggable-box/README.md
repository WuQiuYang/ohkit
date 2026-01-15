# @ohkit/draggable-box

🚀 功能强大的可拖拽容器组件

一个灵活的拖拽容器组件，支持方向锁定、边界限制和多种位置配置，适用于悬浮窗口、工具栏、侧边栏等各种需要拖拽交互的场景。
## ✨ 特性亮点

- 🎯 **灵活拖拽**: 支持窗口范围内的自由拖拽
- 🔒 **方向锁定**: 可锁定水平或垂直方向拖动
- 🎚️ **边界控制**: 智能边界限制，支持相对和绝对边界
- 📐 **多种定位**: 支持四角定位，适应不同布局需求
- ♿ **可访问性**: 支持禁用状态，提升用户体验
- 🎨 **样式自定义**: 支持自定义类名和样式覆盖
- 📱 **响应式**: 自适应窗口大小变化

## 📦 安装

```bash
npm install @ohkit/draggable-box
```

## 🚀 快速开始

```tsx
import React from 'react';
import { DraggableBox } from '@ohkit/draggable-box';
import '@ohkit/draggable-box/dist/index.css';

function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 基本用法 - 自由拖拽 */}
      <DraggableBox>
        <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
          我可以自由拖拽！
        </div>
      </DraggableBox>
    </div>
  );
}
```

## 📖 详细使用

### 方向锁定

```tsx
function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 锁定水平拖拽 */}
      <DraggableBox lockAxis="x" placement="top-left">
        <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '6px' }}>
          我只能水平拖拽
        </div>
      </DraggableBox>
      
      {/* 锁定垂直拖拽 */}
      <DraggableBox lockAxis="y" placement="top-right">
        <div style={{ padding: '16px', background: '#f3e5f5', borderRadius: '6px' }}>
          我只能垂直拖拽
        </div>
      </DraggableBox>
    </div>
  );
}
```

### 边界限制

边界限制基于 `placement` 属性进行相对定位，智能计算有效拖动范围：

```tsx
function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 左上角相对边界 */}
      <DraggableBox 
        placement="top-left" 
        offsetX={50} 
        offsetY={50}
        boundsX={[20, 300]}  // 左边最小20px，最大300px
        boundsY={[20, 200]}  // 顶边最小20px，最大200px
      >
        <div style={{ padding: '12px', background: '#fff3e0' }}>
          左上角边界限制
        </div>
      </DraggableBox>

      {/* 右下角相对边界 */}
      <DraggableBox 
        placement="bottom-right" 
        offsetX={50} 
        offsetY={50}
        boundsX={[100, 500]}  // 右边最小100px，最大500px
        boundsY={[50, 300]}   // 底边最小50px，最大300px
      >
        <div style={{ padding: '12px', background: '#e8f5e8' }}>
          右下角边界限制
        </div>
      </DraggableBox>
    </div>
  );
}
```

### 组合功能

```tsx
function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 水平锁定 + 边界限制 */}
      <DraggableBox 
        lockAxis="x"
        placement="top-left"
        boundsX={[50, 400]}
        zIndex={10000}
      >
        <div style={{ 
          padding: '15px', 
          background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
          color: 'white',
          borderRadius: '8px'
        }}>
          水平锁定 + 边界限制
        </div>
      </DraggableBox>

      {/* 禁用状态 */}
      <DraggableBox 
        placement="bottom-right"
        disabled={true}
      >
        <div style={{ padding: '12px', background: '#bdbdbd', color: '#666' }}>
          禁用的拖拽框
        </div>
      </DraggableBox>
    </div>
  );
}
```

### 高级用法 - 浮动工具栏

```tsx
function FloatingToolbar() {
  const [visible, setVisible] = useState(true);

  return (
    <DraggableBox 
      placement="top-right"
      offsetX={20}
      offsetY={100}
      boundsX={[10, 500]}
      boundsY={[50, window.innerHeight - 200]}
      zIndex={9999}
    >
      <div style={{ 
        padding: '10px 15px', 
        background: 'white',
        borderRadius: '25px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setVisible(!visible)}>
            {visible ? '隐藏' : '显示'}
          </button>
          <span>浮动工具栏</span>
        </div>
      </div>
    </DraggableBox>
  );
}
```

## 📋 API 参考

### DraggableBoxProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | `''` | 自定义 CSS 类名 |
| `children` | `ReactNode` | - | 拖拽框内容 |
| `zIndex` | `number` | `9999` | z-index 层级 |
| `offsetX` | `number` | `20` | 初始位置横向偏移量（px） |
| `offsetY` | `number` | `20` | 初始位置纵向偏移量（px） |
| `disabled` | `boolean` | `false` | 是否禁用拖拽功能 |
| `placement` | `'top-left'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-right'` | `'bottom-right'` | 初始定位位置 |
| `lockAxis` | `'none'` \| `'x'` \| `'y'` | `'none'` | 拖拽方向锁定 |
| `boundsX` | `[number?, number?]` | - | X轴边界范围 `[min, max]` |
| `boundsY` | `[number?, number?]` | - | Y轴边界范围 `[min, max]` |

### 💡 边界说明

边界值基于 `placement` 属性进行智能计算：

#### 单边边界约束
除了完整的边界范围，DraggableBox 还支持单边边界约束，可以只设置最小边界或最大边界：

```tsx
// 只有最小边界约束
<DraggableBox 
  placement="bottom-right"
  boundsX={[100, undefined]}  // 右边最小距离100px，无最大限制
  boundsY={[50, undefined]}   // 底边最小距离50px，无最大限制
>
  单边最小边界约束
</DraggableBox>

// 只有最大边界约束
<DraggableBox 
  placement="top-left"
  boundsX={[undefined, 200]}  // 左边最大距离200px，无最小限制
  boundsY={[undefined, 150]}  // 顶边最大距离150px，无最小限制
>
  单边最大边界约束
</DraggableBox>

// 混合单边约束
<DraggableBox 
  placement="bottom-right"
  boundsX={[100, undefined]}  // X轴只有最小边界
  boundsY={[undefined, 30]}   // Y轴只有最大边界
>
  混合单边约束
</DraggableBox>
```

#### 当 `placement="top-left"` 时：

#### 当 `placement="top-left"` 时：
- `boundsX=[min, max]`: 左边最小距离 - 左边最大距离
- `boundsY=[min, max]`: 顶边最小距离 - 顶边最大距离

#### 当 `placement="bottom-right"` 时：
- `boundsX=[min, max]`: 右边最小距离 - 右边最大距离  
- `boundsY=[min, max]`: 底边最小距离 - 底边最大距离

#### 当 `placement="top-right"` 时：
- `boundsX=[min, max]`: 右边最小距离 - 右边最大距离
- `boundsY=[min, max]`: 顶边最小距离 - 顶边最大距离

#### 当 `placement="bottom-left"` 时：
- `boundsX=[min, max]`: 左边最小距离 - 左边最大距离
- `boundsY=[min, max]`: 底边最小距离 - 底边最大距离

## ??️ 最佳实践

### 1. 边界配置建议
```tsx
// ✅ 推荐：合理设置边界，确保用户体验
<DraggableBox 
  placement="top-right"
  boundsX={[20, 400]}  // 右边距离20px-400px
  boundsY={[50, 300]}  // 顶边距离50px-300px
>
  优化边界配置
</DraggableBox>

// ❌ 避免：边界设置不合理
<DraggableBox boundsX={[0, 10]}>边界太窄</DraggableBox>
```

### 2. 性能优化
```tsx
// ✅ 推荐：合理的初始位置
<DraggableBox placement="bottom-right" offsetX={20} offsetY={20}>
  合适的初始位置
</DraggableBox>

// ✅ 推荐：单边边界约束使用场景
<DraggableBox boundsX={[100, undefined]}>
  {/* 确保组件不贴边，但又给予最大的移动自由 */}
</DraggableBox>

// ✅ 推荐：在需要时启用拖拽
<DraggableBox disabled={!isEditing}>
  仅在编辑模式下可拖拽
</DraggableBox>
```

### 3. 响应式设计
```tsx
function ResponsiveDraggable() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DraggableBox 
      boundsX={[20, windowSize.width - 200]}
      boundsY={[20, windowSize.height - 150]}
    >
      响应式拖拽框
    </DraggableBox>
  );
}
```

## 🌟 使用场景

### 浮动控制面板
```tsx
function ControlPanel() {
  return (
    <DraggableBox 
      placement="bottom-right"
      offsetX={50}
      offsetY={50}
      boundsX={[50, 600]}
      boundsY={[100, 500]}
      zIndex={10000}
    >
      <div style={{ 
        padding: '20px', 
        background: 'white', 
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}>
        <h3>控制面板</h3>
        {/* 控制项 */}
      </div>
    </DraggableBox>
  );
}
```

### 可拖拽侧边工具栏
```tsx
function DraggableToolbar() {
  return (
    <DraggableBox 
      lockAxis="y"
      placement="top-right"
      offsetX={0}
      offsetY={100}
      boundsX={[0, 0]}  // 锁定在右侧
      boundsY={[50, 600]}
    >
      <div style={{ 
        padding: '10px', 
        background: '#f8f9fa',
        borderLeft: '1px solid #dee2e6',
        width: '200px',
        height: '300px'
      }}>
        <h4>侧边工具栏</h4>
        {/* 工具栏按钮 */}
      </div>
    </DraggableBox>
  );
}
```

## 🔧 自定义样式

组件支持通过 `className` 属性传入自定义样式类名，实现样式覆盖：

### 基础样式自定义
```tsx
function CustomStyledDraggable() {
  return (
    <DraggableBox className="my-custom-draggable">
      <div>自定义样式的拖拽框</div>
    </DraggableBox>
  );
}
```

```css
/* 在您的 CSS 文件中 */
.my-custom-draggable {
  /* 覆盖容器样式 */
  position: fixed;
  cursor: grab;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid #e0e0e0;
  transition: box-shadow 0.2s ease;
}

.my-custom-draggable:hover {
  cursor: grabbing;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.my-custom-draggable:active {
  cursor: grabbing;
}
```

### 拖拽状态样式
```tsx
function DraggableWithState() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DraggableBox 
      className={`custom-draggable ${isDragging ? 'dragging' : ''}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      <div>{isDragging ? '拖拽中...' : '可以拖拽'}</div>
    </DraggableBox>
  );
}
```

```css
.custom-draggable {
  background: white;
  padding: 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.custom-draggable.dragging {
  background: #f0f8ff;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
  transform: scale(1.02);
}
```

### 响应式样式
```tsx
function ResponsiveDraggable() {
  return (
    <DraggableBox className="responsive-draggable">
      <div>响应式拖拽框</div>
    </DraggableBox>
  );
}
```

```css
.responsive-draggable {
  max-width: 300px;
  min-width: 200px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .responsive-draggable {
    max-width: 250px;
    font-size: 14px;
  }
}
```

### 主题化样式
```tsx
function ThemedDraggable({ theme = 'light' }) {
  return (
    <DraggableBox className={`draggable-theme-${theme}`}>
      <div>主题化拖拽框 - {theme}</div>
    </DraggableBox>
  );
}
```

```css
.draggable-theme-light {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.draggable-theme-dark {
  background: #1a1a1a;
  color: white;
  border: 1px solid #444;
}

.draggable-theme-accent {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}
```

## 📊 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🔗 相关链接

- [源码](https://github.com/WuQiuYang/ohkit/tree/main/src/components/draggable-box)
- [Storybook 演示](https://wuqiuyang.github.io/ohkit/storybook-static)
- [Issue 反馈](https://github.com/WuQiuYang/ohkit/issues)

## 📄 许可证

ISC License