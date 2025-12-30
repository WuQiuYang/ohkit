import type { Meta, StoryObj } from '@storybook/react';
import { BackTop, BackTopProps } from './index';
import {useRef} from 'react';

const meta: Meta<typeof BackTop> = {
  // title: 'Components/BackTop',
  component: BackTop,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackTop>;

const Demo = (props: BackTopProps) => {
  const { children, mountType, scrollTop = 100, ...restProps } = props;
  return <section style={{height: 300, overflow: 'auto'}}>
      <main style={{minHeight: 500}}>
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

export const CustomUI: Story = {
  args: {
    children: <b>{'返回\n顶部'}</b>,
    title: '点击返回列表顶部',
    position: 'top-left',
    offset: [20, 200],
    scrollTop: 50
  },
  render: Demo
};

export const CustomScroller: Story = {
  args: {
    mountType: 'absolute',
    position: 'bottom-left',
    offset: [20, 200],
    scrollTop: 50
  },
  render(args) {
    const scrollRef = useRef<HTMLDivElement>(null);
    return <section style={{position: 'relative'}}>
      <Demo {...args} scrollDomRef={scrollRef} />
      <div ref={scrollRef} style={{height: 300, overflow: 'auto'}}>
        <main style={{minHeight: 500}}>
          {Array(20).fill(0).map((_, index) => <div key={index}>{'监听的是我 往下滚动 please' + index}</div>)}
        </main>
      </div>
    </section>;
  }
};