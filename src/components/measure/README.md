# `@ohkit/measure`

> React组件尺寸测量工具，用于获取子元素的内容区域尺寸信息

## 安装
```bash
npm install @ohkit/measure
```

## 功能特性
- 测量子元素的尺寸信息（宽/高/位置等）
- 支持响应式尺寸变化监测
- 提供简洁的API获取测量结果
- 兼容多种React组件类型

## 基本用法

```tsx
import Measure from '@ohkit/measure';

function Example() {
  return (
    <Measure>
      {({ measureRef, contentRect }) => (
        <div ref={measureRef}>
          <p>测量区域内容</p>
          {contentRect && (
            <div>
              宽度: {contentRect.client.width}px
            </div>
          )}
        </div>
      )}
    </Measure>
  );
}
```

## API 说明

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| children | 渲染函数，接收测量相关参数 | ({ measureRef, measure, contentRect }) => ReactNode | - |
| innerRef | 获取被测量元素的ref | RefObject \| (instance: HTMLElement \| null) => void | - |
| onResize | 尺寸变化回调函数 | (contentRect: IContentRect) => void | - |
| throttleMs | resize事件节流时间(ms) | number | 200 |
| client | 是否测量client尺寸 | boolean | true |
| offset | 是否测量offset尺寸 | boolean | true |
| scroll | 是否测量scroll尺寸 | boolean | false |
| bounds | 是否测量边界位置 | boolean | false |
| position | 是否测量相对位置与bounds相比少了宽高 | boolean | false |
| margin | 是否测量margin | boolean | false |
| triggerResizeInit | 是否在组件挂载时立即触发一次resize事件 | boolean | true |

### 测量参数

`children`函数接收一个对象参数，包含以下属性：

- `measureRef`: 需要绑定到被测量元素的ref
- `measure`: 手动触发测量的函数
- `contentRect`: 测量结果对象，包含以下属性：
  - `entry`: ResizeObserver返回的原始尺寸 {width, height, top, right, bottom, left, x, y}
  - `client`: {width, height, top, left}
  - `offset`: {width, height, top, left}
  - `scroll`: {width, height, top, left}
  - `bounds`: {top, right, bottom, left, width, height}
  - `position`: {top, right, bottom, left}
  - `margin`: {top, right, bottom, left}

## 高级用法

### 自定义测量属性

```tsx
<Measure client={true} offset={false} onResize={(contentRect) => {
    console.log(`Client Width: ${contentRect.client.width}px`);
    console.log(`Offset Width: ${contentRect.client.width}px`);
}}>
  {({ measureRef, contentRect }) => (
    <div ref={measureRef}>
      <p>测量区域内容</p>
    </div>
  )}
</Measure>
```

### 监测尺寸变化

```tsx
<Measure client>
  {({ measureRef, contentRect }) => {
    if (contentRect) {
      console.log('client尺寸变化:', contentRect.client.width);
    }
    return <div ref={measureRef}>...</div>;
  }}
</Measure>
```

## 注意事项
1. 测量元素必须具有确定的尺寸（非display:none）
2. 频繁测量可能影响性能，建议合理使用
3. 初次渲染时contentRect可能为undefined