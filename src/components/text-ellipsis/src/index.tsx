/**
 * @file 文本截断显示组件
 * @description 基于React封装一个文本截断显示组件，富文本（仅文字样式，图片和表格效果不一定好）同普通文本处理一致
 * @author <wuqiuyang305@126.com>
 */

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  MouseEvent,
} from "react";
import "./style.scss";
import {
  isSafari,
  prefixClassname as p,
  classNames as cx,
  assignRef,
  useRuntime,
  useCompatibleEffect,
} from "@ohkit/utils";
import { Measure } from "@ohkit/measure";

export const c = p("ohkit-text-ellipsis__");

interface ITextEllipsis {
  /**
   * right | bottom 展开按钮在右下侧还是底部
   * @default right
   */
  uiType?: "right" | "bottom";
  className?: string;
  /**
   * （单位:px）未传入或无效（0也视为无效）则自动取当前文本的行高
   */
  lineHeight?: React.CSSProperties["lineHeight"];
  /**
   * 超过几行折叠(number > 0), 没传或者传入无效值不限制，自动截断到容器的最大高度
   */
  lines?: number;
  /**
   * 展开按钮蒙层背景色(仅支持16进制表示)
   * @default #fff
   */
  maskBgColor?: string;
  /**
   * text｜ReactNode  与children任传一个
   */
  content?: React.ReactNode;
  /**
   * 显示展开控制按钮
   * @default true
   */
  showFoldControl?: boolean;
  /**
   * 展开按钮文字
   * @default 收起
   */
  foldText?: string;
  /**
   * 展开按钮文字
   * @default 展开
   */
  unfoldText?: string;
  /**
   * 自定义渲染展开按钮
   */
  renderFoldButton?: (fold: boolean) => React.ReactNode;
  /**
   * @param fold 折叠状态，true 折叠，false 展开
   */
  onFoldChange?: (fold: boolean) => void;
  /**
   * @param ellipsis 是否截断，true 截断，false 未截断
   */
  onEllipsisChange?: (ellipsis: boolean) => void;
}

export type TextEllipsisProps = PropsWithChildren<ITextEllipsis>;

export function TextEllipsis({
  className,
  /**
   * （单位:px）未传入或无效（0也视为无效）则自动取当前文本的行高
   */
  lineHeight = "",
  /**
   * 超过几行折叠(number > 0), 没传或者传入无效值不限制，自动截断到容器的最大高度
   */
  lines,
  /**
   * 展开按钮蒙层背景色(仅支持16进制表示)
   */
  maskBgColor = "#fff",
  /**
   * text｜ReactNode  与children任传一个
   */
  content,
  children,
  /**
   * 显示展开控制按钮
   */
  showFoldControl = true,
  foldText = "收起",
  unfoldText = "展开",
  /**
   * right | bottom 展开按钮在右下侧还是底部
   */
  uiType = "right",
  renderFoldButton,
  onEllipsisChange,
  onFoldChange,
}: TextEllipsisProps) {
  // 是否截断
  const [ellipsis, setEllipsis] = useState(false);
  const [getLineHeightFail, setGetLineHeightFail] = useState(false);
  // 折叠状态
  const [fold, setFold] = useState(true);
  const [foldBtnWidth, setFoldBtnWidth] = useState(1);
  const [innerLineHeight, setInnerLineHeight] = useState(0);
  const [innerLines = 0, setInnerLines] = useState(lines);

  const [runtime] = useRuntime({
    contentOffsetHeight: 0,
    ellipsis,
    fold,
    foldBtnWidth,
    onEllipsisChange,
    onFoldChange,
  }, ['onEllipsisChange', 'onFoldChange']);

  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnWrapperRef = useRef<HTMLDivElement>(null);

  const containerStyle = useMemo(() => {
    return {
      lineHeight: lineHeight
        ? lineHeight
        : // 未传入且获取 lineHeight(px) 失败，则设置 default lineHeight: 1.5(em)
        getLineHeightFail
        ? "1.5"
        : undefined,
    };
  }, [lineHeight, getLineHeightFail]);

  // 容器样式
  const wrapStyle = useMemo(() => {
    const lines = innerLines;
    if (!ellipsis || !lines || !innerLineHeight) {
      return;
    }
    return {
      // HACK: 兼容safari 15+ 富文本折叠高度丢失问题
      minHeight: fold ? `${(lines - 0.5) * innerLineHeight}px` : undefined,
      WebkitLineClamp: fold ? lines : undefined, // 利用-webkit-line-clamp截断方案
      // maxHeight: ellipsis && fold && lines * innerLineHeight, // TODO: 上面方案不支持 则需优雅降级为高度截断方案
      paddingBottom:
        uiType === "bottom" || !fold ? `${innerLineHeight}px` : undefined,
    };
  }, [innerLines, innerLineHeight, ellipsis, fold, uiType]);

  // 展开｜收起 按钮样式
  const btnStyle = useMemo(() => {
    if (!fold) {
      return;
    }
    // 按钮padding，取行高
    const padding = innerLineHeight;
    // 蒙层透明度所占比例
    const ratio = uiType === "right" ? (padding / foldBtnWidth) * 100 : 60;
    // 16进制透明色(考虑简写方式), 不直接使用css的transparent是因为safari的表现是灰色
    const transparent = `${maskBgColor}${
      maskBgColor.length === 4 ? "0" : "00"
    }`;
    return {
      height: `${innerLineHeight}px`,
      lineHeight: `${innerLineHeight}px`,
      paddingTop: uiType === "bottom" ? `${padding}px` : undefined,
      paddingLeft: uiType === "right" ? `${padding}px` : undefined,
      // 渐变蒙层
      background: `linear-gradient(to ${uiType}, ${transparent}, ${maskBgColor} ${ratio}%, ${maskBgColor} 100%)`,
    };
  }, [innerLineHeight, maskBgColor, fold, uiType, foldBtnWidth]);

  const reorganizeDom = useCallback(() => {
    // safari 中仅改变 WebkitLineClamp 没触发重排，调整微小宽度以触发
    if (contentRef.current) {
      contentRef.current.style.width = "99.999%";
      window.requestAnimationFrame?.(() => {
        if (contentRef.current) {
          contentRef.current.style.width = "100%";
        }
      });
    }
  }, []);

  const handleFoldChange = useCallback((evt?: MouseEvent<HTMLDivElement>, fold = !runtime.fold) => {
    runtime.fold = fold;
    setFold(fold);
    runtime.onFoldChange?.(fold);
  }, []);

  const ButtonComp = useMemo(() => {
    return (
      <div
        className={cx("btn-fold-wrapper", `btn-fold-wrapper-${uiType}`)}
        style={btnStyle}
        ref={btnWrapperRef}
        onClick={handleFoldChange}
      >
        {renderFoldButton ? (
          renderFoldButton(fold)
        ) : (
          <div className={"btn-fold"}>
            {fold ? unfoldText : foldText}
          </div>
        )}
      </div>
    );
  }, [
    btnStyle,
    fold,
    foldText,
    handleFoldChange,
    renderFoldButton,
    // renderIcon,
    uiType,
    unfoldText,
  ]);

  // 重置状态
  const resetState = useCallback((ellipsis = false) => {
    const {ellipsis: preEllipsis, fold: preFold} = runtime;
    if (ellipsis !== preEllipsis) {
      runtime.ellipsis = ellipsis;
      setEllipsis(ellipsis);
      runtime.onEllipsisChange?.(ellipsis);
      // 从未截断状态切换为截断状态时，自动折叠（即：出现展开按钮）
      if (ellipsis && !preFold) {
        handleFoldChange(undefined, true);
      }
    }
  }, [handleFoldChange]);

  const calcEllipsis = useCallback(() => {
    const wrapDom = wrapperRef.current;
    const containerDom = containerRef.current;
    if (!wrapDom || !containerDom) {
      return;
    }
    runtime.contentOffsetHeight = wrapDom.offsetHeight;
    let realLineHeight = 0;

    // 若外部未传入, 尝试读取当前文本的行高。
    if (!realLineHeight && wrapDom) {
      const realStyle = window.getComputedStyle?.(wrapDom);
      const { lineHeight } = realStyle || {};
      if (lineHeight) {
        // 未设置行高的为 normal
        realLineHeight = parseFloat(lineHeight);
        if (!realLineHeight) {
          setGetLineHeightFail(true);
        }
      }
    }
    // lineHeight同步到innerLineHeight
    if (innerLineHeight !== realLineHeight) {
      setInnerLineHeight(realLineHeight);
    }
    if (!lines) {
      if (runtime.contentOffsetHeight > containerDom?.offsetHeight) {
          const adjustLines = Math.floor(containerDom.offsetHeight / realLineHeight);
          setInnerLines(adjustLines);
          resetState(true);
      } else {
        resetState(false);
      }
    } else {
      setInnerLines(lines);
      if (runtime.contentOffsetHeight >= (lines + 1) * realLineHeight) {
        resetState(true);
      } else {
        resetState(false);
      }
    }
  }, [lines, innerLineHeight, resetState]);

  // 监听内容高度，是否需要折叠
  // 用useLayoutEffect方式闪屏显示
  useCompatibleEffect(() => {
    resetState();
    calcEllipsis();
  }, [calcEllipsis, resetState]);

  // 监听"展开"按钮宽度变化
  useEffect(() => {
    if (ellipsis && btnWrapperRef.current) {
      const {offsetWidth} = btnWrapperRef.current;
      if (offsetWidth !== runtime.foldBtnWidth) {
        runtime.foldBtnWidth = offsetWidth;
        setFoldBtnWidth(offsetWidth);
      }
    }
  }, [ellipsis, unfoldText]);
  useEffect(() => {
    if (isSafari) {
      reorganizeDom();
    }
  }, [fold, reorganizeDom]);
  const finalContent = content || children;
  const hoverTitle = useMemo(() => {
      return ellipsis && fold ? wrapperRef.current?.textContent || '' : undefined;
  }, [ellipsis, fold]);
  // console.log('[render TextEllipsis]: ellipsis, fold: ', ellipsis, fold);
  return (
    <div className={cx(c("container"), className)} style={containerStyle} ref={containerRef}>
      {/* 此dom仅用于计算高度 用.text-ellipsis-inner计算 在不重新初始化情况下切换文本时高度计算有问题 */}
      <Measure offset>
        {({measureRef, contentRect}) => {
          // console.log('contentRect:', contentRect.offset?.height, runtime.contentOffsetHeight);
          const {height} = contentRect.offset || {};
          if (height !== undefined && Math.abs(height - runtime.contentOffsetHeight) > 1) {
            calcEllipsis();
          }
          return <div className={"offset-height-computer"} ref={(r) => {
            assignRef(measureRef, r);
            assignRef(wrapperRef, r);
          }}>
            {finalContent}
          </div>
        }}
      </Measure>
      {/* <div className={"offset-height-computer"} ref={wrapperRef}>
          {finalContent}
      </div> */}
      {/* 主文本显示 */}
      <div className={"text-ellipsis-inner"} title={hoverTitle} style={wrapStyle} ref={contentRef}>
        {/* {finalContent} */}
        {/* firefox >= 133 绝对定位的按钮放文本后面也会被截断隐藏！！ , 放文本前面可解决 */}
        {ellipsis && showFoldControl && ButtonComp}
        {finalContent}
      </div>
    </div>
  );
}

