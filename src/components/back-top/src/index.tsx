import React, { PropsWithChildren, useEffect, useState, useMemo, useRef } from "react";
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import { useRuntime, useScrollEntry } from "@ohkit/react-helper";
import { addEventListener } from "@ohkit/dom-helper";

import "./style.scss";

export const c = p("ohkit-back-top__");

export interface IBackTop {
  className?: string;
  /**
   * 按钮位置，fixed 或 absolute
   * @default "fixed"
   */
  mountType?: "fixed" | "absolute";
  /**
   * 滚动距离，当滚动距离大于此值时显示返回顶部按钮
   * @default 500
   */
  scrollTop?: number;
  scrollRefDom?: React.MutableRefObject<HTMLElement>;
  /**
   * 按钮位置，top-right 或 top-left 或 bottom-right 或 bottom-left
   * @default "bottom-right"
   */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /**
   * 按钮位置偏移量px, 即[position.split("-")[0], position.split("-")[1]]
   * @default[50, 100]
   */
  offset?: [number, number];
  /**
   * 是否查找真实可滚动的容器，scrollHeight > clientHeight
   * @default false
   */
  realScroll?: boolean;
  /**
   * 按钮标题
   * @default "返回顶部"
   */
  title?: string;
}

export type BackTopProps = PropsWithChildren<IBackTop>;

export const BackTop = ({
  children,
  className,
  scrollTop = 500,
  mountType = "fixed",
  position = "bottom-right",
  offset = [50, 100],
  title = "返回顶部",
  scrollRefDom,
  realScroll = false,
}: BackTopProps) => {
  const [visible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const [runtime] = useRuntime<{
    preVisible: boolean;
    scrollListenerRemover: null | (() => void);
  }>({
    preVisible: visible,
    scrollListenerRemover: null,
  });

  const scrollEntry = useScrollEntry(scrollRefDom ? scrollRefDom : domRef, {
    realScroll,
    autoFind: true,
    intervalTime: 3000,
  });

  const positionStyle = useMemo(() => {
    const [x, y] = position.split("-");
    return {
      [x]: `${offset[0]}px`,
      [y]: `${offset[1]}px`,
    };
  }, [position, offset]);

  useEffect(() => {
    console.log('scrollEntry', scrollEntry);
    if (scrollEntry && scrollEntry.scroller) {
      runtime.scrollListenerRemover?.();
      const onScroll = () => {
        const { scrollContainer } = scrollEntry;
        const curVisible = !!(
          scrollContainer &&
          (scrollContainer as HTMLElement).scrollTop > scrollTop
        );
        if (runtime.preVisible !== curVisible) {
          runtime.preVisible = curVisible;
          setVisible(curVisible);
        }
      };
      onScroll();
      runtime.scrollListenerRemover = addEventListener(
        scrollEntry.scroller,
        "scroll",
        onScroll
      );
      return () => {
        runtime.scrollListenerRemover?.();
      };
    }
  }, [scrollEntry.scroller]);

  return (
      <div
        title={title}
        ref={domRef}
        style={positionStyle}
        className={cx(
          c("container", {
            visible: !!visible,
            invisible: !visible,
          }),
          c({ absolute: mountType === "absolute" }),
          className
        )}
        onClick={() => {
          scrollEntry.scroller?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        {children || '↑'}
      </div>
  );
};
