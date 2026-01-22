# data-helper

Utility functions collection.

## Installation

```bash
npm install @ohkit/data-helper
```

## Usage

```typescript
import { NonRepeatRandomSelector } from '@ohkit/data-helper';
```

## NonRepeatRandomSelector

不重复的随机选择器(不放回抽签)，支持两种模式：

1. **普通模式**：每轮都重新随机选择，保证同一轮内不重复
2. **保持顺序模式**：第一轮随机确定顺序，后续按第一轮顺序循环

### 基本用法

```typescript
import { NonRepeatRandomSelector } from '@ohkit/data-helper';

// 普通模式
const selector = new NonRepeatRandomSelector(['A', 'B', 'C']);

// 保持顺序模式
const selector = new NonRepeatRandomSelector(['A', 'B', 'C'], { 
  preserveOrder: true 
});
```

### API

#### 构造函数
```typescript
new NonRepeatRandomSelector(list: readonly T[], options?: { preserveOrder?: boolean })
```

#### 方法
- `getRandom(): T` - 获取下一个随机元素
- `getUsedCount(): number` - 获取已使用的项目数量
- `getRemainingCount(): number` - 获取剩余未使用的项目数量
- `getTotalCount(): number` - 获取总项目数量
- `isExhausted(): boolean` - 检查是否已使用完所有项目
- `hasFixedOrder(): boolean` - 检查是否已确定固定顺序
- `getFixedOrder(): number[] | null` - 获取当前的固定顺序
- `reset(): void` - 手动重置选择器状态

### 示例场景

#### 1. 团队任务分配
每周随机分配任务，保持公平性

```typescript
const teamMembers = ['张三', '李四', '王五'];
const selector = new NonRepeatRandomSelector(teamMembers, { preserveOrder: true });

// 每周分配任务
for (let week = 1; week <= 4; week++) {
  console.log(`第${week}周任务分配:`);
  for (let i = 0; i < teamMembers.length; i++) {
    console.log(`任务 ${i+1}: ${selector.getRandom()}`);
  }
}
```

#### 2. 课堂提问顺序
保证每个学生都有提问机会，避免重复

```typescript
const students = ['小明', '小红', '小刚', '小丽'];
const selector = new NonRepeatRandomSelector(students);

// 每轮提问3个学生
for (let round = 1; round <= 2; round++) {
  console.log(`第${round}轮提问:`);
  for (let i = 0; i < 3; i++) {
    console.log(`问题 ${i+1}: ${selector.getRandom()}`);
  }
  // 如果本轮已提问完所有学生，重置选择器
  if (selector.isExhausted()) {
    selector.reset();
  }
}
```

#### 3. 抽奖活动
保证每个参与者都有中奖机会

```typescript
const participants = ['参与者A', '参与者B', '参与者C'];
const selector = new NonRepeatRandomSelector(participants);

// 设置多个奖项
const prizes = ['一等奖', '二等奖', '三等奖'];
for (let i = 0; i < prizes.length; i++) {
  console.log(`${prizes[i]}: ${selector.getRandom()}`);
}
```

### 特点

- ✅ 同一轮内保证不重复选择
- ✅ 支持两种随机策略：完全随机 vs 保持顺序
- ✅ 线程安全，支持并发使用
- ✅ 完整的统计和状态查询功能
- ✅ TypeScript 类型支持

查看 Storybook 演示获取更多使用示例。
