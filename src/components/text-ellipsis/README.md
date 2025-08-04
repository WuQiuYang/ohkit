# `@ohkit/text-ellipsis`

> 多功能文本截断显示组件，支持多行截断、展开/收起功能，兼容富文本内容

## 安装
```bash
npm install @ohkit/text-ellipsis
```

## 功能特性
- 支持多行文本截断显示
- 可配置展开/收起功能按钮
- 支持富文本内容（保留文字样式）
- 提供两种UI布局模式（右侧按钮/底部按钮）
- 可自定义按钮文本和样式
- 支持动态内容高度检测
- 完善的回调机制

## 基本用法

```tsx
import { TextEllipsis } from '@ohkit/text-ellipsis';
import '@ohkit/text-ellipsis/dist/index.css';

function Demo() {
  return (
    <TextEllipsis 
      lines={3}
      content="这是一段需要截断的长文本内容..."
    />
  );
}
```

## API 说明

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| className | 自定义样式类名，会附加到根元素上 | string | - |
| lines | 超过几行折叠 (number > 0) | number | - |
| uiType | 展开按钮位置 `right`(右下侧) 或 `bottom`(底部) | string | `right` |
| lineHeight | 行高(支持px/em等单位或数字) | number/string | - |
| content | 文本内容 | ReactNode | - |
| fold | 是否折叠 | boolean | `true` |
| showFoldControl | 是否显示展开控制按钮 | boolean | `true` |
| foldText | 折叠状态按钮文字 | string | `收起` |
| unfoldText | 展开状态按钮文字 | string | `展开` |
| maskBgColor | 展开按钮蒙层背景色(16进制) | string | `#fff` |
| showTitleWhenFold | 折叠状态下是否显示title属性 | boolean | `false` |
| titleWhenFold | 自定义折叠状态下的title内容 | string \| (title: string) => string | - |
| resetFoldWhenChildrenOrEllipsisChange | 当内容变化时重置折叠状态 | boolean | `false` |
| controlPlacement | 底部按钮对齐方式 `left`/`center`/`right` | string | `center` |
| whiteSpace | 是否保留换行符 | CSSProperties['whiteSpace'] | - |
| width | 容器宽度（默认自适应） | CSSProperties['width'] | - |
| renderFoldButton | 自定义渲染展开按钮 | (fold: boolean) => ReactNode | - |

### 事件

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| onFoldChange | 折叠状态变化时触发 | (fold: boolean) => void |
| onEllipsisChange | 截断状态变化时触发 | (ellipsis: boolean) => void |
| onStatusChange | 关键状态变更触发 | ({fold, ellipsis, title}) => void |

## 高级示例

```tsx
<TextEllipsis
  lines={2}
  uiType="bottom"
  maskBgColor="#f5f5f5"
  content={
    <div>
      <strong>富文本内容</strong> 也可以正常截断，
      <span style={{color: 'red'}}>包括样式</span>
    </div>
  }
  renderFoldButton={(fold) => (
    <button>{fold ? '显示更多' : '收起'}</button>
  )}
  onFoldChange={(fold) => console.log('折叠状态:', fold)}
/>
```

## 注意事项
1. Safari浏览器下富文本截断可能有轻微高度计算偏差
2. 图片和表格等复杂内容可能无法完美截断
3. 动态内容变化后会自动重新计算截断状态
4. 使用`whiteSpace`保留换行符时建议设置`width`属性
