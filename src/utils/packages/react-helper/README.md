# `@ohkit/react-helper`

> React辅助工具集合，提供常用React工具函数和hooks

## 安装
```bash
npm install @ohkit/react-helper
```

## 功能特性
- Ref处理工具
- 运行时状态管理hook
- SSR兼容的effect hook
- 类型安全

## 基本用法

### Ref处理
```tsx
import { assignRef } from '@ohkit/react-helper';

function Component({ ref1, ref2 }) {
  const internalRef = useRef();
  
  useEffect(() => {
    assignRef(ref1, internalRef.current);
    assignRef(ref2, internalRef.current);
  }, []);

  return <div ref={internalRef}>...</div>;
}
```

### 运行时状态
```tsx
import { useRuntime } from '@ohkit/react-helper';

function Component(props) {
  const [runtime, assignRuntime] = useRuntime({
    count: 0,
    name: 'default'
  });

  // 更新运行时状态
  assignRuntime({ count: 1 });
}
```

### SSR兼容effect
```tsx
import { useCompatibleEffect } from '@ohkit/react-helper';

function Component() {
  useCompatibleEffect(() => {
    // 在浏览器端使用useLayoutEffect
    // 在SSR环境使用useEffect
  }, []);
}
```

## API 说明

### 工具函数

| 函数 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| assignRef | 分配ref到多个目标 | `registerRef: Ref`, `ref: RefValue` | void |

### Hooks

| Hook | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| useRuntime | 运行时状态管理 | `init: T`, `syncKeys?: Array<keyof T>` | `[T, AssignRuntime<T>]` |
| useCompatibleEffect | SSR兼容effect | `effect: EffectCallback`, `deps?: DependencyList` | void |

## 高级用法

### 组合使用
```tsx
function SmartComponent({ ref, ...props }) {
  const [runtime, assignRuntime] = useRuntime({
    mounted: false,
    width: 0
  });

  const internalRef = useRef();

  useCompatibleEffect(() => {
    assignRuntime({ mounted: true });
    assignRef(ref, internalRef.current);
  }, []);

  return <div ref={internalRef}>...</div>;
}
```

## 注意事项
1. useRuntime适合管理组件内部状态，不替代Redux等状态管理
2. assignRef可以处理callback ref和object ref
3. 在SSR项目中使用useCompatibleEffect确保兼容性