import type { Meta, StoryObj } from '@storybook/react';
import { DraggableBox } from './index';

const meta: Meta<typeof DraggableBox> = {
  component: DraggableBox,
  tags: ['autodocs'],
  argTypes: {
    lockAxis: {
      control: { type: 'select' },
      options: ['none', 'x', 'y'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DraggableBox>;

export const Default: Story = {
  args: {
    children: '自由拖拽 - 默认限制在窗口范围内',
  },
};

export const TopLeftRelativeBounds: Story = {
  args: {
    children: "Top-Left: 左边范围 50-200px",
    placement: 'top-left',
    boundsX: [50, 200],
  },
};

export const BottomRightRelativeBounds: Story = {
  args: {
    children: 'Bottom-Right: 右边范围 100-300px',
    placement: 'bottom-right',
    boundsX: [100, 300],
  },
};

export const TopYRelativeBounds: Story = {
  args: {
    children: 'Top: 顶边范围 30-150px',
    placement: 'top-right',
    boundsY: [30, 150],
  },
};

export const CombinedRelativeBounds: Story = {
  args: {
    children: '组合边界限制',
    placement: 'bottom-left',
    boundsX: [50, 200],
    boundsY: [80, 250],
  },
};

export const LockHorizontal: Story = {
  args: {
    children: '锁定水平 + 自定义边界',
    lockAxis: 'x',
    boundsX: [100, 500],
  },
};

export const XAxisSingleBound: Story = {
  args: {
    children: 'X轴单边限制：只有最小边界',
    placement: 'bottom-right',
    boundsX: [100, undefined], // 只有minBound
  },
};

export const YAxisSingleBound: Story = {
  args: {
    children: 'Y轴单边限制：只有最大边界',
    placement: 'bottom-right',
    boundsY: [undefined, 50], // 只有maxBound
  },
};

export const MixedSingleBounds: Story = {
  args: {
    children: '混合单边限制',
    placement: 'bottom-right',
    boundsX: [100, undefined], // X轴只有minBound
    boundsY: [undefined, 30],  // Y轴只有maxBound
  },
};

export const TopLeftSingleBounds: Story = {
  args: {
    children: 'Top-Left单边限制',
    placement: 'top-left',
    boundsX: [50, undefined], // X轴只有minBound
    boundsY: [undefined, 100], // Y轴只有maxBound
  },
};
