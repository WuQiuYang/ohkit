import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { TextEllipsis } from '.';
import { text, element } from './__test__/data';

const meta = {
  // title: 'Components/TextEllipsis',
  component: TextEllipsis,
  tags: ['autodocs'],
} satisfies Meta<typeof TextEllipsis>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Right: Story = {
  args: {
    lines: 2,
    content: text,
  }
};
export const RightCustom: Story = {
  args: {
    lines: 2,
    content: text,
    renderFoldButton: (fold) => {
      return <Button
        size='middle'
        type='text'
        color='primary'
        icon={fold ? <DownOutlined /> : <UpOutlined />}
      >
        自定义{fold ? '展开' : '收起'}按钮
      </Button>;
    }
  }
};

export const Bottom: Story = {
  args: {
    lines: 2,
    uiType: 'bottom',
    content: text,
  }
};

export const RichText: Story = {
  args: {
    lines: 7,
    uiType: 'bottom',
    content: element,
  }
};