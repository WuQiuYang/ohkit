import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";

import { hexToRgba, rgbaToHex, launchFullscreen, exitFullscreen, findScrollContainer, findScroller } from ".";
import "./index.scss";

interface ColorProps {
  hex?: string;
  rgba?: string;
  // todo add
}
const ColorDemo = (props: ColorProps) => {
    const { hex, rgba } = props;
    return <div>
      <div>[hexToRgba]: {hex ? `${hex} => ${hexToRgba(hex)}` : null}</div>
      <hr />
      <div>[rgbaToHex]: {rgba ? `${rgba} => ${rgbaToHex(rgba)}` : null}</div>
    </div>;
};


const FullscreenDemo = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenClassName = "fullscreen-demo";
  const fullpageClassName = "fullpage-demo";
  return (
    <div ref={wrapperRef} style={{ background: "white", width: "450px" }}>
      <div>
        <a href={window.location.href} target="_blank">若iframe中无法拉起全屏，请点击打开新窗口进行测试</a>
      </div>
      <h5>launchFullscreen / exitFullscreen</h5>
      <div>
        <button
          onClick={() =>
            launchFullscreen({
              className: fullscreenClassName,
              onEnter: () => {
                console.log("launchFullscreen body onEnter");
              },
              onExit: () => {
                console.log("launchFullscreen body onExit");
              },
            })
          }
        >
          launchFullscreen body
        </button>
        <button
          onClick={() =>
            launchFullscreen({
              // transform 会影响fixed定位
              element:
                document.querySelector(".sbdocs-content") || wrapperRef.current,
              onlyFullPage: true,
              className: fullpageClassName,
              onEnter: () => {
                console.log("launchFullPage wrapper onEnter");
              },
              onExit: () => {
                console.log("launchFullPage wrapper onExit");
              },
            })
          }
        >
          launchFullPage wrapper
        </button>
        <button
          onClick={() =>
            launchFullscreen({
              // transform 会影响fixed定位
              element:
                document.querySelector(".sbdocs-content") || wrapperRef.current,
              className: fullscreenClassName,
              onEnter: () => {
                console.log("launchFullscreen wrapper onEnter");
              },
              onExit: () => {
                console.log("launchFullscreen wrapper onExit");
              },
            })
          }
        >
          launchFullscreen wrapper
        </button>
        <button onClick={() => exitFullscreen()}>exitFullscreen</button>
      </div>
      <h5>dinamic toggle fullscreen</h5>
      <div>
        <button
          onClick={() =>
            isFullscreen
              ? exitFullscreen()
              : launchFullscreen({
                  element: wrapperRef.current,
                  className: fullscreenClassName,
                  onEnter: () => setIsFullscreen(true),
                  onExit: () => setIsFullscreen(false),
                })
          }
        >
          {isFullscreen ? "exitFullscreen wrapper" : "launchFullscreen wrapper"}
        </button>
      </div>
    </div>
  );
};

interface ScrollProps {
  height?: string;
  width?: string;
  // todo add
}
const ScrollDemo = ({width: outWidth = '100%', height: outHeight = '100%'}: ScrollProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<Element | Window | null>(null);
  const scrollContainer = useRef<Element | null>(null);
  const [refresh, setRefresh] = useState(1);
  const [height, setHeight] = useState(outHeight);
  const [width, setWidth] = useState(outWidth);
  const toggleHeight = '200px';
  const toggleWidth = '150px';
  const find = () => {
    if(targetRef.current) {}
    scrollContainer.current = findScrollContainer(targetRef.current, {
      realScroll: true
    });
    scroller.current = findScroller(targetRef.current, {
      realScroll: true
    });
    console.log("scrollContainer, scroller", scrollContainer.current, scroller.current);
    setRefresh(refresh + 1);
  }
  useEffect(() => {
    find();
  }, []);
  return <div style={{width, height, overflow: "auto"}}>
      <div ref={targetRef} >
          <button
            onClick={()=> {
              setHeight(height === toggleHeight ? outHeight : toggleHeight)
            }}
          >
            切换视窗高度
          </button>
          或
          <button
            onClick={()=> {
              setWidth(width === toggleWidth ? outWidth : toggleWidth)
            }}
          >
            切换视窗宽度
          </button>
          后
          <button
            onClick={() => {
              find();
            }}
          >
            重新查找滚动容器
          </button>
      </div>
      <hr />
      <div>
        <h3>findScrollContainer</h3>
        <div>
          TagName -- {scrollContainer.current?.tagName}
          <br/>
          Attribute -- {Array.from(scrollContainer.current?.attributes || []).map((attr) => `${attr.localName}: ${attr.value}`).join(" ")}
        </div>
        <h3>findScroller</h3>
        <div>
          TagName -- {scroller.current instanceof Window ? "window" : scroller.current?.tagName}
          <br/>
          Attribute -- {Array.from(scroller.current instanceof Window ? [] : scroller.current?.attributes || []).map((attr) => `${attr.localName}: ${attr.value}`).join(" ")}
        </div>
      </div>
    </div>
};


interface DomHelperProps extends ColorProps, ScrollProps {
  children: <T extends Record<string, any>>(props: T) => React.ReactNode;
  // todo add
}
const DomHelperPlayground = (props: DomHelperProps) => {
  const {children, ...rest} = props;
  return (
    <div>
      {children?.(rest)}
    </div>
  );
};

const meta = {
  component: DomHelperPlayground,
  tags: ["autodocs"],
} satisfies Meta<typeof DomHelperPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Color: Story = {
  args: {
    // add props
    hex: "#1cfcd380",
    rgba: "rgba(28, 252, 211, 0.5)",
    children: (props) => <ColorDemo {...props} />,
  },
};

export const Fullscreen: Story = {
  args: {
    // add props
    children: (props) => <FullscreenDemo {...props} />,
  },
};

export const Scroll: Story = {
  args: {
    // add props
    children: (props) => <ScrollDemo {...props} />,
  },
};
