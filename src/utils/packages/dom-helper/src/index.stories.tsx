import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef } from "react";

import { hexToRgba, rgbaToHex, launchFullscreen, exitFullscreen } from ".";
import "./index.scss";

interface DomHelperProps {
  // todo add
  hex?: string;
  rgba?: string;
}
const DomHelperDemo = (props: DomHelperProps) => {
  const { hex, rgba } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenClassName = "fullscreen-demo";
  const fullpageClassName = "fullpage-demo";
  return (
    <div ref={wrapperRef} style={{ background: "white", width: "450px" }}>
      <h4>Color:</h4>
      <div>[hexToRgba]: {hex ? `${hex} => ${hexToRgba(hex)}` : null}</div>
      <hr />
      <div>[rgbaToHex]: {rgba ? `${rgba} => ${rgbaToHex(rgba)}` : null}</div>
      <h4>Fullscreen:</h4>
      <h5>launchFullscreen / exitFullscreen</h5>
      <div>
        <a href={window.location.href} target="_blank">若iframe中无法拉起全屏，请点击打开新窗口进行测试</a>
      </div>
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

const meta = {
  component: DomHelperDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DomHelperDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // add props
    hex: "#1cfcd380",
    rgba: "rgba(28, 252, 211, 0.5)",
  },
};
