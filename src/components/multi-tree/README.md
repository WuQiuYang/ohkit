# MultiTree 组件

一个支持多根节点和双向分支的树形结构React组件

## 功能特性
- 支持多根节点
- 双向树形结构（左/右分支）
- 可自定义节点渲染
- 缩放和平移功能
- 响应式布局
- 可自定义样式
- 支持子节点懒加载
- 支持虚线连接节点

## 安装
```bash
npm install @ohkit/multi-tree
```

## 基础用法
```tsx
import { MultiTree } from '@ohkit/multi-tree';

interface TreeNode {
  id: string | number;
  label: string;
  left?: TreeNode[];
  right?: TreeNode[];
  [key: string]: any;
}

const data: TreeNode[] = [{
  id: 1,
  label: '根节点',
  left: [{ id: 2, label: '左子节点' }],
  right: [{ id: 3, label: '右子节点' }]
}];

function App() {
  return (
    <MultiTree 
      treeList={data}
      renderCard={(node) => (
        <div className="custom-node">
          {node.label}
        </div>
      )}
    />
  );
}
```

## Props说明

### 核心Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| treeList | `T[]` | `[]` | 根节点数组(T需继承ITreeData) |
| renderCard | `(node: T) => React.ReactNode` | - | 自定义节点渲染函数 |
| fetchChildTree | `(node: T, direction: 'left'\|'right') => Promise<T[]>` | - | 异步获取子节点的函数 |
| onToggle | `(node: T, direction: 'left'\|'right') => void` | - | 节点展开/收起回调 |

### 布局Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| height | `number` | 800 | 画布高度 |
| width | `number` | 1280 | 画布宽度 |
| layoutSafeMargin | `number` | 100 | 布局安全边距 |
| layoutBgColor | `string` | "#f7f8fa" | 画布背景色 |
| cardWidth | `number` | 200 | 节点默认宽度 |
| cardWidthSpan | `number` | 86 | 节点水平间距 |
| cardHeightSpan | `number` | 20 | 节点垂直间距 |
| treeTopSpan | `number` | 50 | 树分支垂直间距 |

### 节点Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| leftTreePath | `keyof T` | "left" | 左分支路径键名 |
| rightTreePath | `keyof T` | "right" | 右分支路径键名 |
| leftNumKey | `keyof T` | "leftNum" | 左子节点数量键名 |
| rightNumKey | `keyof T` | "rightNum" | 右子节点数量键名 |
| leftVirtualNumKey | `keyof T` | "leftVirtualNum" | 左虚拟子节点数量键名 |
| rightVirtualNumKey | `keyof T` | "rightVirtualNum" | 右虚拟子节点数量键名 |
| openLeftKey | `keyof T` | "openLeft" | 左分支展开状态键名 |
| openRightKey | `keyof T` | "openRight" | 右分支展开状态键名 |
| virtualNodeKey | `keyof T` | "isVirtual" | 虚拟节点标记键名 |

### 缓存Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| needCache | `boolean` | true | 是否缓存子节点 |
| cacheMaxAge | `number` | Infinity | 缓存持续时间(毫秒) |

### 样式Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| className | `string` | - | 自定义类名 |
| cardWrapClassName | `string` | - | 节点容器自定义类名 |
| topBottomLineRadius | `number` | 12 | 边缘节点圆角半径 |
| toggleBtnSpan | `number` | 16 | 节点与切换按钮间距 |

### 工具栏Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| renderToolbar | `(opt: { zoom: number, zoomIn: () => void, zoomOut: () => void, goBackCenter: () => void }) => React.ReactNode` | - | 自定义工具栏渲染函数 |
| toolbarProps | `MultiTreeToolbarProps<T>` | - | 工具栏组件属性 |

### 其他Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| visiableNode | `T` | - | 初始可见节点 |

## 类型定义

```ts
interface ITreeData {
  id?: string | number;
  key?: string | number;
  label?: string;
  left?: T[];
  right?: T[];
  [key: string]: any;
}
```

## 许可协议
MIT