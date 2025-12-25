import type { Meta, StoryObj } from '@storybook/react';
import {useState} from 'react';
import { ReactIframe } from './index';

const meta: Meta<typeof ReactIframe> = {
  // title: 'Components/ReactIframe',
  component: ReactIframe,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReactIframe>;

const DefaultSrcList = [
  'https://juejin.cn',
  'https://juejin.cn/following',
  'https://juejin.cn/post/7255570274271412261#heading-1',
  'https://juejin.cn/post/7255570274271412261#heading-5',
  'https://wuqiuyang.github.io/ohkit/storybook-static',
];

export const Default: Story = {
  args: {
    src: DefaultSrcList[0],
    // height: '100%',
  },
  render(props) {
    const {src: outSrc, ...rest} = props;
    const [src, setSrc] = useState(outSrc);
    return <div style={{height: '80vh'}}>
      {DefaultSrcList.map(item => <button key={item} onClick={() => setSrc(item)}>{item}</button>)}
      <hr />
      <ReactIframe src={src} {...rest} />
    </div>;
  },
};