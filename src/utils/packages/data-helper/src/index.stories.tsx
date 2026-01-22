import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';

import { NonRepeatRandomSelector } from './';

interface DataHelperDemoProps {
  scenario: ['normal-mode', 'preserve-order-mode'][number];
}

const DataHelperDemo = (props: DataHelperDemoProps) => {
  const { scenario } = props;
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = (demoType: string) => {
    setIsRunning(true);
    setOutput([]);
    
    setTimeout(() => {
      const newOutput: string[] = [];
      
      switch (demoType) {
        case 'normal-mode':
          demoNormalMode(newOutput);
          break;
        case 'preserve-order-mode':
          demoPreserveOrderMode(newOutput);
          break;
        default:
          newOutput.push('选择演示场景开始运行...');
      }
      
      setOutput(newOutput);
      setIsRunning(false);
    }, 100);
  };

  const demoNormalMode = (output: string[]) => {
    output.push('=== 普通模式演示 ===');
    output.push('特点: 每轮都完全随机选择，可能在同一轮中出现重复');
    output.push('');
    
    const selector = new NonRepeatRandomSelector(['A', 'B', 'C', 'D']);
    output.push('初始状态:');
    output.push(`总项目数: ${selector.getTotalCount()}`);
    output.push(`剩余数量: ${selector.getRemainingCount()}`);
    output.push('');
    
    output.push('第一轮选择(完全随机不重复):');
    for (let i = 0; i < 4; i++) {
      output.push(`选择 ${i+1}: ${selector.getRandom()}`);
    }
    output.push(`本轮结束后是否用完: ${selector.isExhausted()}`);
    output.push('');
    
    output.push('第二轮选择(重置后重新随机):');
    for (let i = 0; i < 6; i++) {
      output.push(`选择 ${i+1}: ${selector.getRandom()}`);
    }
  };

  const demoPreserveOrderMode = (output: string[]) => {
    output.push('=== 保持顺序模式演示 ===');
    output.push('特点: 第一轮随机确定顺序，后续按第一轮顺序循环');
    output.push('');
    
    const selector = new NonRepeatRandomSelector(['A', 'B', 'C', 'D'], { preserveOrder: true });
    output.push('初始状态:');
    output.push(`是否已确定固定顺序: ${selector.hasFixedOrder()}`);
    output.push('');
    
    output.push('第一轮选择(随机确定顺序):');
    const firstRound: string[] = [];
    for (let i = 0; i < 4; i++) {
      const item = selector.getRandom();
      firstRound.push(item);
      output.push(`选择 ${i+1}: ${item}`);
    }
    output.push(`固定顺序已确定: ${selector.hasFixedOrder()}`);
    output.push(`固定顺序: [${selector.getFixedOrder()?.map(idx => ['A','B','C','D'][idx]).join(', ')}]`);
    output.push('');
    
    output.push('第二轮选择(按第一轮顺序循环):');
    for (let i = 0; i < 8; i++) {
      output.push(`选择 ${i+1}: ${selector.getRandom()} (顺序: ${i % 4 + 1})`);
    }
  };


  useEffect(() => {
    if (scenario) {
      runDemo(scenario);
    }
  }, [scenario]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>NonRepeatRandomSelector 演示</h3>
        <p>选择不同的演示场景来查看功能效果：</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        minHeight: '400px',
        overflow: 'auto'
      }}>
        {isRunning ? (
          <div>演示运行中...</div>
        ) : (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {output.join('\n')}
          </pre>
        )}
      </div>
    </div>
  );
};

const meta = {
  // title: 'Utils/DataHelper/NonRepeatRandomSelector',
  component: DataHelperDemo,
  tags: ['autodocs'],
  // argTypes: {
  //   scenario: {
  //     control: { type: 'select' },
  //     options: ['normal-mode', 'preserve-order-mode', 'counter-example', 'team-assignment', 'quiz-sequence'],
  //     description: '选择演示场景',
  //   },
  // },
} satisfies Meta<typeof DataHelperDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const 普通模式演示: Story = {
  args: {
    scenario: 'normal-mode',
  },
};

export const 保持顺序模式演示: Story = {
  args: {
    scenario: 'preserve-order-mode',
  },
};
