# @ohkit/back-top

返回顶部组件。当页面或容器滚动超过指定距离后自动显示返回顶部按钮，点击后平滑滚动到顶部。

## 安装

```bash
npm install @ohkit/back-top
```

## 使用

### 基本用法
```tsx
import { BackTop } from '@ohkit/back-top';
import '@ohkit/back-top/dist/index.css';

function App() {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <div style={{ minHeight: '2000px' }}>
        {/* 很长的高度内容 */}
      </div>
      {/* 组件放入滚动容器中，自动查找所属的滚动容器 */}
      <BackTop />
    </div>
  );
}
```

### 指定滚动容器
```tsx
import { useRef } from 'react';
import { BackTop } from '@ohkit/back-top';

function CustomContainer() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section>
      <div ref={scrollContainerRef} style={{ height: '400px', overflow: 'auto' }}>
        <div style={{ minHeight: '800px' }}>
          {/* 内容 */}
        </div>
      </div>
      <BackTop 
        scrollDomRef={scrollContainerRef}
        mountType="absolute"
      />
    </section>
  );
}
```

### 自定义按钮内容
```tsx
<BackTop title="回到顶部" children={<>↑<br/>顶部</>} />
```

## API

### BackTop Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | string | '' | 自定义类名 |
| children | ReactNode | '↑' | 按钮内容，支持React节点 |
| mountType | 'fixed' \| 'absolute' | 'fixed' | 按钮定位方式 |
| scrollTop | number | 500 | 显示按钮的滚动阈值（像素） |
| scrollDomRef | React.RefObject<HTMLElement> | - | 自定义滚动容器 |
| position | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'bottom-right' | 按钮位置 |
| offset | [number, number] | [50, 100] | 按钮偏移量 [top/bottom, left/right] |
| realScroll | boolean | false | 是否查找真实可滚动容器 |
| title | string | '返回顶部' | 按钮提示文本 |

## 特性说明

### 自动滚动容器检测
组件会自动查找包含它的第一个滚动容器。如果设置 `realScroll={true}`，会查找 `scrollHeight > clientHeight` 的真实滚动容器。

### 平滑滚动
点击按钮时会使用 `scrollTo({ top: 0, behavior: 'smooth' })` 实现平滑滚动效果。

### 性能优化
- 使用防抖机制避免频繁的滚动事件处理
- 只有滚动状态变化时才触发重渲染

## 依赖说明

组件依赖以下工具包：
- `@ohkit/dom-helper`：DOM事件处理
- `@ohkit/prefix-classname`：CSS类名前缀
- `@ohkit/react-helper`：React运行时工具

## 样式定制

组件支持通过 `className` 属性进行样式覆盖：

```tsx
<BackTop className="custom-back-top" />
```

然后通过CSS或CSS-in-JS定义样式：

```css
.custom-back-top {
  background: #007bff;
  border-radius: 8px;
  /* 其他自定义样式 */
}
```