import {useState, useCallback} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Tooltip, Popover } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { TextEllipsis, TextEllipsisProps } from '.';
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
    showTitleWhenFold: true,
    renderFoldButton: (fold) => {
      return <Button
        size='small'
        type='link'
        color='primary'
        iconPosition='end'
        icon={fold ? <DownOutlined /> : <UpOutlined />}
      >
        自定义{fold ? '展开' : '收起'}
      </Button>;
    }
  }
};

export const Bottom: Story = {
  args: {
    lines: 2,
    uiType: 'bottom',
    showTitleWhenFold: true,
    titleWhenFold: '如果太长了hover我也就不展示全了，可自定义title文案',
    content: text,
    lineHeight: '22px',
  }
};

export const RichText: Story = {
  args: {
    lines: 7,
    uiType: 'bottom',
    content: element,
  }
};

export const CustomWithTooltip: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const handleVisibleChange = useCallback((newVisible: boolean) => {
      console.log('handleVisibleChange newVisible', newVisible);
      setVisible(newVisible);
    }, []);
    const handleStatusChange = useCallback<NonNullable<TextEllipsisProps['onStatusChange']>>((status) => {
      console.log('触发了 onStatusChange 回调', status);
      const {ellipsis, fold, title} = status;
      if (ellipsis && fold && title) {
        setTitle(title);
      } else {
        setTitle('');
        setVisible(false);
      }
    }, []);
    return (
      <Tooltip
        title={<div style={{maxHeight: 350, overflowY: 'auto'}}>{title}</div>}
        open={visible}
        onOpenChange={title ? handleVisibleChange : undefined}
        placement='bottomRight'
        mouseEnterDelay={0.3}
      >
        <TextEllipsis {...args} onStatusChange={handleStatusChange} />
      </Tooltip>
    )
  },
  args: {
    lines: 2,
    uiType: 'right',
    content: '适合不是特别长的文本，太长出滚动条比较丑:\n' + text,
    lineHeight: '22px',
    onFoldChange: (fold) => {
      console.log('触发了 onFoldChange 回调 fold', fold);
    },
    onEllipsisChange: (ellipsis) => {
      console.log('触发了 onEllipsisChange 回调 ellipsis', ellipsis);
    },
  }
};

export const CustomWithPopover: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const handleVisibleChange = useCallback((newVisible: boolean) => {
      setVisible(newVisible);
    }, []);
    const handleStatusChange = useCallback<NonNullable<TextEllipsisProps['onStatusChange']>>((status) => {
      console.log('触发了 onStatusChange 回调', status);
      const {ellipsis, fold, title} = status;
      if (ellipsis && fold && title) {
        setTitle(title);
      } else {
        setTitle('');
        setVisible(false);
      }
    }, []);
    return (
      <Popover
        title={<div style={{maxHeight: 300, maxWidth: 400, overflowY: 'auto'}}>{title}</div>}
        open={visible}
        onOpenChange={title ? handleVisibleChange : undefined}
        placement='bottomRight'
        mouseEnterDelay={0.3}
      >
        <TextEllipsis {...args} onStatusChange={handleStatusChange} />
      </Popover>
    )
  },
  args: {
    lines: 2,
    uiType: 'right',
    showFoldControl: false,
    content: '适合超长文本，出滚动条:\n' + text + text + text,
    lineHeight: '22px',
    onFoldChange: (fold) => {
      console.log('触发了 onFoldChange 回调 fold', fold);
    },
    onEllipsisChange: (ellipsis) => {
      console.log('触发了 onEllipsisChange 回调 ellipsis', ellipsis);
    },
  }
};