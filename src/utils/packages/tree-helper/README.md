# tree-helper

树形结构操作工具库，提供深度优先搜索(DFS)遍历功能。

## 功能特性

- 树形结构的深度优先遍历
- 支持带上下文信息的灵活节点访问
- 支持自定义子节点属性名称
- 可在遍历过程中跳过或中断

## 安装

```bash
npm install @ohkit/tree-helper
```

## API 文档

### `dfsTree<T extends object, C extends boolean>(tree: T | T[], visit: Visit<T, C>, options?: IOption<T, C>): T | null`

对树形结构执行深度优先搜索。

#### 参数
- `tree`: 要遍历的根节点或节点数组
- `visit`: 为每个节点执行的回调函数
- `options`: 可选配置
  - `path`: 子节点属性名 (默认: "children")
  - `needCtx`: 是否向访问者提供上下文信息 (默认: false)

#### 返回值
第一个满足访问者条件的节点，如果未找到则返回 null

### `TreeContext<TreeNode, Path>`

提供树遍历过程中的上下文信息:
- `node`: 当前访问的节点
- `depth`: 当前在树中的深度
- `index`: 当前节点在父节点子数组中的索引
- `parent`: 父节点引用
- `parents`: 所有父节点数组
- `paths`: 表示从根节点路径的索引数组
- `children`: 当前节点的子节点
- `skip()`: 跳过当前节点的子节点
- `break()`: 完全中断遍历

## 使用示例

### 基础DFS遍历
```typescript
import { dfsTree } from '@ohkit/tree-helper';

const tree = {
  value: 'root',
  children: [
    { value: 'child1' },
    { 
      value: 'child2',
      children: [
        { value: 'grandchild1' },
        { value: 'grandchild2' }
      ]
    }
  ]
};

dfsTree(tree, (node) => {
  console.log(node.value);
  // 输出: root, child1, child2, grandchild1, grandchild2
});
```

### 带上下文的DFS遍历
```typescript
import { dfsTree } from '@ohkit/tree-helper';

const tree = {
  id: 1,
  children: [
    { id: 2 },
    { 
      id: 3,
      children: [
        { id: 4 },
        { id: 5 }
      ]
    }
  ]
};

dfsTree(tree, (node, ctx) => {
  console.log(`节点 ${node.id} 在深度 ${ctx?.depth}`);
  // 输出: 节点 1 在深度 1, 节点 2 在深度 2, 等等
}, { needCtx: true });
```

### 提前终止遍历
```typescript
import { dfsTree } from '@ohkit/tree-helper';

const tree = {
  id: 1,
  children: [
    { id: 2, isTarget: true },
    { id: 3 }
  ]
};

const target = dfsTree(tree, (node) => {
  return node.isTarget === true;
});

console.log(target?.id); // 输出: 2
```
