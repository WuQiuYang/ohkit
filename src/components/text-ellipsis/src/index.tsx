/**
 * @file 文本截断显示组件
 * @description 基于React封装一个文本截断显示组件，富文本（仅文字样式，图片和表格效果不一定好）同普通文本处理一致
 * @author <wuqiuyang305@126.com>
 */

import React, {
  forwardRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
  MouseEvent,
} from "react";
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import {
  assignRef,
  useRuntime,
  useCompatibleEffect,
  useSyncPropsState,
} from "@ohkit/react-helper";
import {isSafari} from "@ohkit/platform";
import {rgbaToObj, findEffectiveBgColor} from "@ohkit/dom-helper";
import {Measure, MeasureProps} from "@ohkit/measure";
import "./style.scss";

export const c = p("ohkit-text-ellipsis__");

interface ITextEllipsis
  extends Pick<
    React.DOMAttributes<HTMLDivElement>,
    | "onMouseEnter"
    | "onMouseLeave"
    | "onPointerEnter"
    | "onPointerLeave"
    | "onFocus"
    | "onClick"
  > {
  /**
   * 自定义样式类名，会附加到根元素上
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * right | bottom 展开按钮在右下侧还是底部
   * @default right
   */
  uiType?: "right" | "bottom";
  /**
   * 截断模式 (若某些浏览器不支持 webkitLineClamp，可降级切换为 height 模式)
   * @default line
   */
  truncateMode?: "line" | "height";
  /**
   * truncateMode === "height" 时生效
   * 最大高度(number > 0)，没传或者传入无效值不限制，尝试取 lines * lineHeight，若仍无效 自动截断到容器的最大高度
   * 单位: px
   */
  maxHeight?: number;
  /**
   * （单位:px）未传入或无效（0也视为无效）则自动取当前文本的行高
   */
  lineHeight?: React.CSSProperties["lineHeight"];
  /**
   * truncateMode === "line" 时生效
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
   * 当 content or children or ellipsis 变化时，重置 fold 状态 
   * @default false
   */
  resetFoldWhenChildrenOrEllipsisChange?: boolean;
  /**
   * 折叠状态
   * @default true
   */
  fold?: boolean;
  /**
   * 显示展开控制按钮
   * @default true
   */
  showFoldControl?: boolean;
  /**
   * 展开按钮位置 uiType='bottom'时有效
   * @default center
   */
  controlPlacement?: 'left' | 'center' | 'right';
  /**
   * 折叠按钮文字
   * @default 收起
   */
  foldText?: string;
  /**
   * 展开按钮文字
   * @default 展开
   */
  unfoldText?: string;
  /**
   * 折叠状态下是否显示title属性
   * @default false
   */
  showTitleWhenFold?: boolean;
  /**
   * 折叠状态自定义title属性内容
   */
  titleWhenFold?: string | ((title: string) => string);
  /**
   * 是否保留换行
   */
  whiteSpace?: React.CSSProperties['whiteSpace'];
  /**
   * 容器宽度（默认自适应内容）
   * 应用场景：whiteSpace='pre*' 时，支持展示换行符，自适应内容可能导致控制按钮位置不确定
   */
  width?: React.CSSProperties['width'];
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
  /**
   * 关键状态变更触发
   * @param status
   */
  onStatusChange?: (status: {
    fold: boolean;
    ellipsis: boolean;
    title?: string;
  }) => void;
}

export type TextEllipsisProps = PropsWithChildren<ITextEllipsis>;

export const TextEllipsis = forwardRef<HTMLDivElement, TextEllipsisProps>((props, ref) => {
  const {
    className,
    style,
    lineHeight = "",
    lines,
    maskBgColor,
    content,
    children,
    resetFoldWhenChildrenOrEllipsisChange = false,
    showTitleWhenFold,
    titleWhenFold,
    showFoldControl = true,
    foldText = "收起",
    unfoldText = "展开",
    uiType = "right",
    truncateMode = "line",
    maxHeight,
    controlPlacement = 'center',
    whiteSpace,
    width,
    renderFoldButton,
    onEllipsisChange,
    onFoldChange,
    onStatusChange,
    onMouseEnter,
    onMouseLeave,
    onPointerEnter,
    onPointerLeave,
    onClick,
    onFocus,
  } = props;
  const finalContent = content || children;
  // 是否截断
  const [ellipsis, setEllipsis] = useState(false);
  const [getLineHeightFail, setGetLineHeightFail] = useState(false);
  // 折叠状态
  const [fold, setFold] = useSyncPropsState(props, 'fold', {defaultValue: true, onChange: onFoldChange});
  const [foldBtnWidth, setFoldBtnWidth] = useState(1);
  const [innerLineHeight, setInnerLineHeight] = useState(
    typeof lineHeight === "string" && lineHeight.endsWith("px")
      ? parseFloat(lineHeight)
      : 0
  );
  const [innerLines = 0, setInnerLines] = useState(lines);
  // children提取的纯文本
  const [textContent, setTextContent] = useState('');

  const [runtime] = useRuntime({
    inited: false, // mounted
    contentOffsetHeight: 0, // 内容节点offsetHeight
    containerContentHeight: 0, // 容器内容高度 = 容器高 - 上下padding
    ellipsis,
    defaultFold: fold, // 记录一下默认的折叠状态，用于 reset fold
    fold,
    foldBtnWidth,
    textContent,
    onEllipsisChange,
    onFoldChange,
    onStatusChange,
  }, ['fold', 'onEllipsisChange', 'onFoldChange', 'onStatusChange']);

  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnWrapperRef = useRef<HTMLDivElement>(null);

  const containerStyle = useMemo(() => {
    return {
      lineHeight: getLineHeightFail // 未传入且获取 lineHeight(px) 失败，则设置 default lineHeight: 1.4(em)
        ? "1.4" // more brower normal default lineHeight
        : lineHeight ? lineHeight : undefined,
      ...style,
    };
  }, [style, lineHeight, getLineHeightFail]);

  const commonWrapStyle = useMemo(() => {
    return {
      whiteSpace,
      width,
    };
  }, [whiteSpace, width]);
  // 容器样式
  const wrapStyle = useMemo(() => {
    const lines = innerLines;
    const isHeightMode = truncateMode === 'height';
    if (!ellipsis || !isHeightMode && (!lines || !innerLineHeight)) {
      return commonWrapStyle;
    }
    const paddingBottom = showFoldControl && (uiType === "bottom" && !fold) ? `${innerLineHeight}px` : undefined;
    return {
      ...commonWrapStyle,
      // HACK: 兼容safari 15+ 富文本折叠高度丢失问题
      minHeight: !isHeightMode && fold ? `${(lines - 0.2) * innerLineHeight}px` : undefined,
      // Note: safari 对WebkitLineClamp支持太差劲 判断浏览器优雅降级为高度截断方案？目前先交给用户去判断，自行选择truncateMode
      // WebkitLineClamp: isSafari ? undefined : fold ? lines : undefined, // 利用-webkit-line-clamp截断方案
      // maxHeight: isSafari && fold ? lines * innerLineHeight : undefined,
      WebkitLineClamp: isHeightMode ? undefined : fold ? lines : undefined, // 利用-webkit-line-clamp截断方案
      maxHeight: isHeightMode && fold ? (maxHeight || lines * innerLineHeight || runtime.containerContentHeight || 0) : undefined,
      paddingBottom,
      boxSizing: paddingBottom ? 'border-box' as const : undefined,
    };
  }, [innerLines, innerLineHeight, ellipsis, fold, showFoldControl, uiType, truncateMode, maxHeight, commonWrapStyle]);

  // 计算折叠按钮蒙层的渐变颜色
  const validMaskBgColor = useMemo(() => {
    if (!showFoldControl || !ellipsis) {
      return null;
    }
    const {r, g, b} = rgbaToObj(maskBgColor || '') || findEffectiveBgColor(containerRef.current);
    return {
      startColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
      endColor: `rgba(${r}, ${g}, ${b}, 1)`,
    };
  }, [maskBgColor, ellipsis, showFoldControl]);

  // 展开｜收起 按钮样式
  const btnStyle = useMemo(() => {
    if (!fold) {
      return;
    }
    // 按钮padding，取行高
    const padding = innerLineHeight;
    // 蒙层透明度所占比例
    const ratio = uiType === "right" ? Math.min((padding / foldBtnWidth) * 100, 80) : 60;
    const {startColor = 'rgba(255,255,255,0.2)', endColor = 'rgba(255,255,255,1)'} = validMaskBgColor || {};
    return {
      boxSizing: 'content-box' as const,
      height: `${innerLineHeight}px`,
      lineHeight: `${innerLineHeight}px`,
      paddingTop: uiType === "bottom" ? `${padding}px` : undefined,
      paddingLeft: uiType === "right" ? `${padding}px` : undefined,
      // 渐变蒙层
      background: `linear-gradient(to ${uiType}, ${startColor}, ${endColor} ${ratio}%, ${endColor} 100%)`,
    };
  }, [innerLineHeight, fold, uiType, foldBtnWidth, validMaskBgColor]);

  const reorganizeDom = useCallback(() => {
    // Note: safari 中仅改变 WebkitLineClamp 没触发重排，调整微小宽度以触发
    if (contentRef.current) {
      const orginStyleWidth = contentRef.current.style.width;
      const orginWidth = window.getComputedStyle(contentRef.current).width;
      // console.log('orginWidth, orginStyleWidth:', orginWidth, orginStyleWidth);
      contentRef.current.style.width = `${parseFloat(orginWidth) - 0.1}px`;
      window.requestAnimationFrame?.(() => {
        if (contentRef.current) {
          contentRef.current.style.width = orginStyleWidth;
        }
      });
    }
  }, []);

  const handleFoldChange = useCallback(
    (evt?: MouseEvent<HTMLDivElement>, fold = !runtime.fold) => {
      runtime.fold = fold;
      setFold(fold);
  }, []);

  const ButtonComp = useMemo(() => {
    return (
      <div
        className={cx(
          "btn-fold-wrapper",
          `btn-fold-wrapper-${uiType}`,
          uiType === "bottom" && `placement-${controlPlacement}`
        )}
        style={btnStyle}
        ref={btnWrapperRef}
        onClick={handleFoldChange}
      >
        {renderFoldButton ? (
          renderFoldButton(fold)
        ) : (
          <div className={"btn-fold"}>{fold ? unfoldText : foldText}</div>
        )}
      </div>
    );
  }, [
    btnStyle,
    fold,
    foldText,
    handleFoldChange,
    renderFoldButton,
    controlPlacement,
    uiType,
    unfoldText,
  ]);

  // 占位按钮
  const ButtonShadowDom = useMemo(() => {
    if (!showFoldControl || uiType !== 'right' || fold) {
      return null;
    }
    return <span style={btnStyle} className="btn-fold-right-shadow">
      {renderFoldButton ? renderFoldButton(fold) : foldText}
    </span>;
  }, [uiType, showFoldControl, fold, btnStyle, foldText, renderFoldButton]);

  // 重置状态
  const resetState = useCallback((newEllipsis = runtime.ellipsis, {
    forceResetFold = false, // 强制重置fold 比如child变化时
  } = {}) => {
    const {ellipsis, fold: preFold, defaultFold} = runtime;
    if (newEllipsis !== ellipsis) {
      setEllipsis(newEllipsis);
      runtime.ellipsis = newEllipsis;
      runtime.onEllipsisChange?.(newEllipsis);
    }
    // 从未截断状态切换为截断状态时，自动折叠（即：出现展开按钮）
    if (
      resetFoldWhenChildrenOrEllipsisChange
      && (forceResetFold  || !ellipsis && newEllipsis)
      && preFold !== defaultFold
    ) {
      handleFoldChange(undefined, defaultFold);
    }
  }, [handleFoldChange, finalContent, resetFoldWhenChildrenOrEllipsisChange]);

  const calcEllipsis = useCallback(() => {
    const wrapDom = wrapperRef.current;
    const containerDom = containerRef.current;
    if (!wrapDom || !containerDom) {
      return;
    }
    runtime.contentOffsetHeight = wrapDom.offsetHeight;
    const containerStyle = window.getComputedStyle(containerDom);
    const paddingTop = parseFloat(containerStyle.paddingTop);
    const paddingBottom = parseFloat(containerStyle.paddingBottom);
    const containerContentHeight = runtime.containerContentHeight = containerDom.clientHeight - paddingTop - paddingBottom;

    // 计算真实行高
    let realLineHeight = 0;
    // 若外部未传入, 尝试读取当前文本的行高。
    if (!realLineHeight && wrapDom) {
      const {lineHeight} = containerStyle || {};
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
      if (!realLineHeight) {
        return;
      }
    }

    const isHeightMode = truncateMode === 'height';
    // 高度截断模式，比较简单 直接判断是否超出容器高度
    if (isHeightMode) {
      resetState(runtime.contentOffsetHeight > (maxHeight || containerContentHeight));
      return;
    }

    // 行数截断模式，需要利用行高计算是否超出容器高度
    if (!lines) {
      if (runtime.contentOffsetHeight > containerContentHeight) {
          const adjustLines = Math.floor(containerContentHeight / realLineHeight) || 1;
          if (innerLines !== adjustLines) {
            setInnerLines(adjustLines);
          }
          resetState(true);
      } else {
        resetState(false);
      }
    } else {
      if (innerLines !== lines) {
        setInnerLines(lines);
      }
      // console.log('contentOffsetHeight, realLineHeight', runtime.contentOffsetHeight, realLineHeight);
      // 允许误差1px（行高为小数时, safari计算行高*行数和实践总高有差异，故将行高向下取整兼容）
        resetState(runtime.contentOffsetHeight >= (lines + 1) * Math.floor(realLineHeight) - 1);
    }
  }, [lines, innerLineHeight, truncateMode, maxHeight, resetState]);

  // 监听内容高度，是否需要折叠
  // 用useLayoutEffect方式闪屏显示
  useCompatibleEffect(() => {
    resetState(runtime.ellipsis, {
      forceResetFold: true,
    });
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
  }, [ellipsis, unfoldText, showFoldControl]);
  useEffect(() => {
    if (isSafari) {
      reorganizeDom();
    }
  }, [fold, reorganizeDom]);
  const updateTextContent = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }
    const newTextContent = wrapperRef.current.textContent || '';
    if (newTextContent !== runtime.textContent) {
      runtime.textContent = newTextContent;
      setTextContent(newTextContent);
    }
  }, []);
  const handleResize = useCallback<NonNullable<MeasureProps['onResize']>>((rect) => {
    // console.log('[handleResize] rect: ', rect, runtime.contentOffsetHeight);
    const {height} = rect.offset || {};
    if (height !== undefined && Math.abs(height - runtime.contentOffsetHeight) > 1) {
      calcEllipsis();
    }
  }, [calcEllipsis]);
  const hoverTitle = useMemo(() => {
      return ellipsis && fold
        ? (typeof titleWhenFold === 'function'
          ? titleWhenFold(textContent)
          : titleWhenFold || textContent)
        : undefined;
  }, [titleWhenFold, ellipsis, fold, textContent]);
  useEffect(() => {
    if (runtime.inited) {      
      runtime.onStatusChange?.({
          ellipsis,
          fold,
          title: hoverTitle
      });
    }
  }, [fold, ellipsis, hoverTitle]);
  useEffect(() => {
    runtime.inited = true;
  }, []);
  // 高度自适应，容器高度变化时重新计算高度(容器也需要包装Measure，TODO: 待开发 hooks -> useMeasure, 使得观测dom尺寸的方式更简洁)
  // if (!maxHeight && !lines) {
  //    calcEllipsis();
  // }
  // console.log('[render TextEllipsis]: ellipsis fold wrapStyle: ', ellipsis, fold, wrapStyle);
  return (
    <div
      className={cx(c("container"), className)}
      style={containerStyle}
      ref={(r) => {
        assignRef(containerRef, r);
        ref && assignRef(ref, r);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      onFocus={onFocus}
    >
      {/* 此dom仅用于计算高度 用.text-ellipsis-inner计算 在不重新初始化情况下切换文本时高度计算有问题 */}
      <Measure offset throttleMs={100} onResize={handleResize} triggerResizeInit={false}>
        {({measureRef, /* contentRect */}) => {
          // console.log('contentRect:', contentRect, contentRect.offset?.height, runtime.contentOffsetHeight);
          // const {height} = contentRect.offset || {};
          // if (height !== undefined && Math.abs(height - runtime.contentOffsetHeight) > 1) {
          //   calcEllipsis();
          // }
          return <div style={commonWrapStyle} className={"content-shadow-dom"} ref={(r) => {
            assignRef(measureRef, r);
            assignRef(wrapperRef, r);
            updateTextContent();
          }}>
            {finalContent}
          </div>
        }}
      </Measure>
      {/* <div style={commonWrapStyle} className={"content-shadow-dom"} ref={wrapperRef}>
          {finalContent}
      </div> */}
      {/* 主文本显示 */}
      <div
        className={"text-ellipsis-inner"}
        title={showTitleWhenFold ? hoverTitle : undefined}
        style={wrapStyle}
        ref={contentRef}
      >
        {/* {finalContent} */}
        {/* firefox >= 133 绝对定位的按钮放文本后面也会被截断隐藏！！ , 放文本前面可解决 */}
        {ellipsis && showFoldControl && ButtonComp}
        {finalContent}
        {ButtonShadowDom}
      </div>
    </div>
  );
});
