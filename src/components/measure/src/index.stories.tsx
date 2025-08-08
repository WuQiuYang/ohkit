import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { text } from './data';
import { Measure } from '.';

const meta = {
  component: Measure,
  tags: ['autodocs'],
} satisfies Meta<typeof Measure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    client: true,
    offset: true,
    bounds: true,
    children: ({measureRef, contentRect }) => {
      // console.log(contentRect);
      const {client, offset, bounds} = contentRect;
      const {width, height, top, left} = client || {};
      const {width: offsetWidth, height: offsetHeight, top: offsetTop, left: offsetLeft} = offset || {};
      const {width: boundsWidth, height: boundsHeight, top: boundsTop, left: boundsLeft, right, bottom} = bounds || {};
      return (
        <div>
          <h3>{'调整窗口大小查看效果：'}</h3>
          <div ref={measureRef} style={{backgroundColor: 'red', margin: 10, padding: 20, border: '2px solid'}}>{text}</div>
          <div>{`client size  =>  width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px`}</div>
          <div>{`offset size  =>  width: ${offsetWidth}px, height: ${offsetHeight}px, top: ${offsetTop}px, left: ${offsetLeft}px`}</div>
          <div>{`bounds size  =>  width: ${boundsWidth}px, height: ${boundsHeight}px, top: ${boundsTop}px, left: ${boundsLeft}px, right: ${right}px bottom: ${bottom}px`}</div>
        </div>
      );
    },
    onResize(contentRect) {
      console.log("contentRect 变化:", contentRect);
    },
  },
};

export const Client: Story = {
  args: {
    client: true,
    children: ({measureRef, contentRect }) => {
      // console.log(contentRect);
      const {client} = contentRect;
      const {width, height, top, left} = client || {};
      return (
        <div>
          <h3>{'调整窗口大小查看效果：'}</h3>
          <div ref={measureRef} style={{ backgroundColor: 'red' }}>{text}</div>
          <div>{`client size  =>  width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px`}</div>
        </div>
      );
    },
  },
};

export const Offset: Story = {
  args: {
    offset: true,
    children({measureRef, contentRect }) {
      // console.log(contentRect);
      const {offset} = contentRect;
      const {width, height, top, left} = offset || {};
      return (
        <div>
          <h3>{'调整窗口大小查看效果：'}</h3>
          <div ref={measureRef} style={{ backgroundColor: 'blue' }}>{text}</div>
          <div>{`offset size  =>  width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px`}</div>
        </div>
      );
    },
  },
};

export const Bounds: Story = {
  args: {
    bounds: true,
    children({measureRef, contentRect }) {
      // console.log(contentRect);
      const {bounds} = contentRect;
      const {width, height, top, left, right, bottom} = bounds || {};
      return (
        <div>
          <h3>{"调整窗口大小查看效果："}</h3>
          <div ref={measureRef} style={{ backgroundColor: "yellow" }}>
            {text}
          </div>
          <div>{`bounds size  =>  width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px, right: ${right}px bottom: ${bottom}px`}</div>
        </div>
      );
    },
  },
};

export const Scroll: Story = {
  args: {
    scroll: true,
    children({measureRef, contentRect }) {
      // console.log(contentRect);
      const {scroll} = contentRect;
      const {width, height, top, left} = scroll || {};
      return (
        <div>
          <h3>{"调整窗口大小及滚动条查看效果："}</h3>
          <div ref={measureRef} style={{ backgroundColor: "purple", maxHeight: "100px", maxWidth: "80%", overflow: "auto" }}>
            <div style={{ minWidth: "400px" }}>{text}</div>
          </div>
          <div>{`scroll size  =>  width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px`}</div>
        </div>
      );
    },
  },
};

export const Position: Story = {
  args: {
    position: true,
    children({measureRef, contentRect }) {
      // console.log(contentRect);
      const {position} = contentRect;
      const {top, left, right, bottom} = position || {};
      return (
        <div>
          <h3>{"调整窗口大小至出现滚动条并滚动页面查看效果："}</h3>
          <div ref={measureRef} style={{ backgroundColor: "purple", maxHeight: "100px", maxWidth: "80%", overflow: "auto" }}>
            <div style={{ minWidth: "400px" }}>{text}</div>
          </div>
          <div>{`scroll size  =>  top: ${top}px, left: ${left}px, bottom: ${bottom}px, right: ${right}px`}</div>
        </div>
      );
    },
  },
};

/**
 * margin 变化监听
 */
export const Margin: Story = {
  args: {
    margin: true,
    children({measureRef, contentRect }) {
      // console.log(contentRect);
      const {margin} = contentRect;
      const {top, left, bottom, right} = margin || {};
      const marginCss1 = "10px 20px";
      const marginCss2 = "15px 30px";
      const [marginCss, setMarginCss] = React.useState(marginCss1);
      return (
        <div>
          <h3>{"点击按钮查看效果："}</h3>
          <button
            onClick={() => {
              setMarginCss(marginCss === marginCss2 ? marginCss1 : marginCss2);
            }}
          >
            margin 切换
          </button>
          <div
            ref={measureRef}
            style={{ backgroundColor: "pink", margin: marginCss }}
          >
            {text}
          </div>
          <div>{`margin size  => top: ${top}px, left: ${left}px, bottom: ${bottom}px, right: ${right}px`}</div>
        </div>
      );
    },
    onResize(contentRect) {
      console.log("margin 变化:", contentRect.margin);
    },
  },
};