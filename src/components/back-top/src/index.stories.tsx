import type { Meta, StoryObj } from '@storybook/react';
import { BackTop, BackTopProps } from './index';

const meta: Meta<typeof BackTop> = {
  // title: 'Components/BackTop',
  component: BackTop,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackTop>;

const Demo = (props: BackTopProps) => {
  const { children, mountType, scrollTop = 100, ...restProps } = props;
  return <section style={{height: 400, overflow: 'auto', position: 'relative'}}>
      <main style={{minHeight: 600}}>
        {Array(20).fill(0).map((_, index) => <div key={index}>{'往下滚动 please' + index}</div>)}
      </main>
      <BackTop mountType={mountType} scrollTop={scrollTop} {...restProps} >
        {children}
      </BackTop>
  </section>;
}

export const Default: Story = {
  args: {},
  render: Demo
};

export const Custom: Story = {
  args: {
    children: <b>{'返回\n顶部'}</b>,
    title: '点击返回列表顶部',
    position: 'top-left',
    offset: [20, 200],
    scrollTop: 50
  },
  render: Demo
};