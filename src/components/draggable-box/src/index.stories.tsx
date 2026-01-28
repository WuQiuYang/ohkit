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
    showDragArea: {
      control: { type: 'boolean' },
    },
    positionMode: {
      control: { type: 'select' },
      options: ['fixed', 'absolute'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DraggableBox>;

const DraggableContentWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        color: "#1890ff",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

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
    children: "Bottom-Right: 右 50-100px",
    placement: 'bottom-right',
    boundsX: [50, 100],
    showDragArea: true
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

    // 只有maxBound
    boundsY: [undefined, 50],

    showDragArea: true
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

export const WithDragAreaVisualization: Story = {
  args: {
    children: <DraggableContentWrapper>{'拖拽区域可视化 - 开始拖拽后显示可拖拽区域'}</DraggableContentWrapper>,
    placement: 'bottom-right',
    boundsX: [100, 300],
    boundsY: [50, 200],
    showDragArea: true,
  },
};

export const LockHorizontalWithDragArea: Story = {
  args: {
    children: '锁定水平+拖拽区域可视化',
    lockAxis: 'x',
    boundsX: [100, 500],
    showDragArea: true,
  },
};

export const MixedBoundariesWithDragArea: Story = {
  args: {
    children: '混合边界+拖拽区域可视化',
    placement: 'top-left',
    boundsX: [50, 200],
    boundsY: [30, 150],
    showDragArea: true,
  },
};

export const TransformParent: Story = {
  args: {
    children: '在 transform 父元素中拖拽',
    placement: 'bottom-right',
    offsetX: 50,
    offsetY: 50,
  },
  render: (args) => (
    <div style={{ 
      width: '600px', 
      height: '400px', 
      border: '20px solid #1890ff',
      transform: 'scale(0.6)',
      transformOrigin: 'top left',
      padding: '20px',
      background: '#f0f0f0'
    }}>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        父容器有 transform: scale(0.6)，组件应该能正常拖拽
      </p>
      <DraggableBox {...args} />
    </div>
  ),
};

export const TransformParentWithBounds: Story = {
  args: {
    children: <DraggableContentWrapper>{'在 transform 父元素中带边界拖拽'}</DraggableContentWrapper>,
    placement: 'bottom-right',
    offsetX: 50,
    offsetY: 50,
    boundsX: [20, 300],
    boundsY: [20, 200],
    showDragArea: true,
  },
  render: (args) => (
    <div style={{ 
      width: '600px', 
      height: '400px', 
      border: '20px solid #1890ff',
      transform: 'scale(0.8)',
      transformOrigin: 'top left',
      padding: '20px',
      background: '#f0f0f0',
      overflow: 'auto'
    }}>
      <div style={{ height: '500px' }}>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          父容器有 transform: scale(0.8)，组件应该能正常拖拽并受边界限制
        </p>
        <DraggableBox {...args} />
      </div>
    </div>
  ),
};

export const AbsoluteMode: Story = {
  args: {
    children: <DraggableContentWrapper>{'Absolute 定位模式'}</DraggableContentWrapper>,
    placement: 'bottom-right',
    offsetX: 50,
    offsetY: 50,
    positionMode: 'absolute',
  },
  render: (args) => (
    <div style={{ 
      position: 'relative',
      width: '600px', 
      height: '400px', 
      border: '10px solid #52c41a',
      padding: '20px',
      background: '#f6ffed'
    }}>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        父容器 position: relative，组件使用 absolute 定位
      </p>
      <DraggableBox {...args} />
    </div>
  ),
};

export const AbsoluteModeWithBounds: Story = {
  args: {
    children: <DraggableContentWrapper>{'Absolute 模式带边界'}</DraggableContentWrapper>,
    placement: 'bottom-right',
    offsetX: 50,
    offsetY: 50,
    positionMode: 'absolute',
    boundsX: [20, 300],
    boundsY: [20, 200],
    showDragArea: true,
  },
  render: (args) => (
    <div style={{ 
      // position: 'relative',
      width: '600px', 
      height: '400px', 
      border: '10px solid #52c41a',
      padding: '20px',
      background: '#f6ffed',
      overflow: 'auto'
    }}>
      <div style={{position: 'relative', height: '500px', background: '#e294c381'}}>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          父容器 position: relative，组件使用 absolute 定位并受边界限制
        </p>
        <DraggableBox {...args} />
      </div>
    </div>
  ),
};

export const WithCallbacks: Story = {
  args: {
    children: <DraggableContentWrapper>{'拖拽回调函数示例 - 查看控制台输出'}</DraggableContentWrapper>,
    placement: 'bottom-right',
    offsetX: 50,
    offsetY: 50,
    boundsX: [50, 300],
    boundsY: [50, 200],
    showDragArea: true,
    onDragStart: (positionChange) => {
      console.log('🚀 拖拽开始 - 位置:', positionChange);
    },
    onDrag: (positionChange) => {
      console.log('🔄 拖拽中 - 实时位置:', positionChange);
    },
    onDragEnd: (positionChange) => {
      console.log('✅ 拖拽结束 - 最终位置:', positionChange);
    },
  },
};
