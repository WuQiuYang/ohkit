import React, { Fragment, Component, createRef } from "react";
import { sync as syncVisitTree, Context } from "@moyuyc/visit-tree";
import { get, isNil, throttle, debounce } from "lodash-es";
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import Measure from "@ohkit/measure";
import { assignRef } from "@ohkit/react-helper";
import {
  addClass,
  addEventListener,
  scrollIntoViewIfNeeded,
} from "@ohkit/dom-helper";
import { MultiTreeToolbar, MultiTreeToolbarProps } from "./toolbar";
import "./style.scss";

export interface ITreeData {
  id?: string | number;
  key?: string | number;
  label?: string;
  __direction?: Direction;
  __treeIndex?: number;
  __isRoot?: boolean;
  __isFirst?: boolean;
  __isLast?: boolean;
  /**
   * 分支点相对节点top偏移量
   */
  __forkPointTopOffset?: number;
  /**
   * 记录最后一次获取子节点的时间
   */
  __childrenUpdateTime?: number;
  /**
   * 每个节点的唯一标识
   */
  __uniKey?: string | number;
  /**
   * 每个节点的dom引用
   */
  // ref?: HTMLDivElement | null;
  __position?: Position;
  // [key: string]: any;

  left?: Array<ITreeData>;
  right?: Array<ITreeData>;
  leftNum?: number;
  rightNum?: number;
  leftVirtualNum?: number;
  rightVirtualNum?: number;
  openLeft?: boolean;
  openRight?: boolean;
  isVirtual?: boolean;
  // [key: string]: any;
}

type Direction = "left" | "right" | "center";
interface Position {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}
/**
 * 多树组件属性接口定义
 * @template T extends ITreeData
 */
export interface MultiTreeProps<T extends ITreeData = ITreeData> {
  /** 自定义类名 */
  className?: string;
  /** 树形结构数据列表 */
  treeList: T[];
  /** 子节点展开状态切换回调函数 */
  onToggle?: (node: T, direction: "left" | "right") => void;
  /** 获取子树数据的异步函数 */
  fetchChildTree?: (node: T, direction: "left" | "right") => Promise<Array<T>>;
  /** 缓存最大生存时间（毫秒） */
  cacheMaxAge?: number;
  /** 当前可视节点 */
  visiableNode?: T;
  /** 画布高度 */
  height?: number;
  /** 画布宽度 */
  width?: number;
  /** 布局安全边距 */
  layoutSafeMargin?: number;
  /** 布局背景颜色 */
  layoutBgColor?: string;
  /** 子节点获取是否需要缓存 */
  needCache?: boolean;
  /** 卡片宽度 */
  cardWidth?: number;
  /** 卡片高度 目前不必传入 是自适应的 */
  // cardHeight?: number;
  /** 叶子节点左右间隙 应该大于 toggleBtnSpan * 2 + ToggleBtnSize */
  cardWidthSpan?: number;
  /** 卡片高度间距 树内部叶子节点上下间隙 */
  cardHeightSpan?: number;
  /** 上下树分支间隙 */
  treeTopSpan?: number;
  /** 顶部和底部线条圆角 */
  topBottomLineRadius?: number;
  /** 节点与按钮间隙 */
  toggleBtnSpan?: number;
  /** 左树路径（在T中的key） */
  leftTreePath?: keyof T;
  /** 右树路径（在T中的key） */
  rightTreePath?: keyof T;
  /** 左树子节点数取值key */
  leftNumKey?: keyof T;
  /** 右树子节点数取值key */
  rightNumKey?: keyof T;
  /** 左树虚拟子节点数取值key */
  leftVirtualNumKey?: keyof T;
  /** 右树虚拟子节点数取值key */
  rightVirtualNumKey?: keyof T;
  /** 左树虚拟子节点数量 */
  leftVirtualChildNum?: number;
  /** 右树虚拟子节点数量 */
  rightVirtualChildNum?: number;
  /** 打开/收起左树取值key */
  openLeftKey?: keyof T;
  /** 打开/收起右树取值key */
  openRightKey?: keyof T;
  /** 标记节点是虚拟节点（与父节点虚线连接）的取值key */
  virtualNodeKey?: keyof T;
  /** 渲染卡片节点回调函数 */
  renderCard?: (node: T) => React.ReactNode;
  /** 卡片包裹容器类名 */
  cardWrapClassName?: string;
  /** 渲染工具栏回调函数 */
  renderToolbar?: (opt: {
    zoom: number;
    zoomIn: () => number;
    zoomOut: () => number;
    goBackCenter: () => void;
  }) => React.ReactNode;
  /** 工具栏属性 */
  toolbarProps?: MultiTreeToolbarProps<T>;
}

export const c = p("ohkit-multi-tree__");

const toggleBtnSize = "26px"; // 对应scss中 $toggle-btn-size: 26px; 需同步调整
const lineSize = "2px"; // 对应scss中 $toggle-border-width: 2px; 需同步调整

const getUniKey = () => {
  return (Math.random() * 1000000) | 0;
};

let treeChange = true;
const ShortLineWidth = 16; // default
const ToggleBtnSize = parseFloat(toggleBtnSize); // 26
const LineSize = parseFloat(lineSize); // 2

function getDefaultProps<T extends ITreeData = ITreeData>() {
  return {
    treeList: [] as T[],
    height: 800, // 画布高
    width: 1280, // 画布宽
    layoutSafeMargin: 100, // 画布布局安全边距（节点离画布边缘的最大距离）
    layoutBgColor: "#f7f8fa", // 画布背景颜色
    // centerLeft: 350,
    // centerTop: 250,
    needCache: true, // 是否缓存子节点
    cacheMaxAge: Infinity, // 缓存时长ms, 默认永久
    cardWidth: 200, // 卡片默认宽度 // TODO: 待调整为响应式的参数，暂不实现
    // cardHeight: 80, // 卡片默认高度
    cardWidthSpan: 40 + ShortLineWidth * 2 + ToggleBtnSize, // 叶子节点左右间隙 应该大于 toggleBtnSpan * 2 + ToggleBtnSize
    cardHeightSpan: 20, // 树内部叶子节点上下间隙
    treeTopSpan: 50, // 上下树分支间隙
    topBottomLineRadius: 12, // 边界子节点圆角值
    toggleBtnSpan: ShortLineWidth, // 节点与按钮间隙 ShortLineWidth
    leftTreePath: "left", // 左树path key
    rightTreePath: "right" as keyof T, // 右树path key
    leftNumKey: "leftNum" as keyof T, // 左树真实子节点总数
    rightNumKey: "rightNum" as keyof T,
    leftVirtualNumKey: "leftVirtualNum" as keyof T, // 左树虚拟节点的数量
    rightVirtualNumKey: "rightVirtualNum" as keyof T,
    openLeftKey: "openLeft" as keyof T, // 控制左树子节点是否展开 key
    openRightKey: "openRight" as keyof T, // 控制右树子节点是否展开 key
    virtualNodeKey: "isVirtual" as keyof T, // 标记节点是虚拟节点（与父节点虚线连接）
  };
}

type TyMultiTreeProps<T extends ITreeData = ITreeData> = MultiTreeProps<T> &
  ReturnType<typeof getDefaultProps<T>>;
type TyState<T extends ITreeData = ITreeData> = {
  renderSeq: number;
  treeList: T[];
};
interface NodeWithTop<T> {
  maxTop?: number;
  node?: T;
}

export class MultiTree<T extends ITreeData = ITreeData> extends Component<
  MultiTreeProps<T>,
  TyState<T>
> {
  // static defaultProps = getDefaultProps();
  static defaultProps = {};

  static getDerivedStateFromProps(
    nextProps: Readonly<MultiTreeProps<ITreeData>>,
    prevState: TyState<ITreeData>
  ) {
    if (nextProps.treeList !== prevState.treeList) {
      // console.log('---getDerivedStateFromProps treeChange---');
      treeChange = true;
      return {
        treeList: nextProps.treeList,
      };
    }
    return null;
  }

  // 前提：节点宽度必须一致，默认取第一个节点宽度（可优化为取所有节点中最大宽度）
  nodeWidth = 0;

  scrollWrapperRef = createRef<HTMLDivElement>();
  layoutRef = createRef<HTMLDivElement>();
  containerRef = createRef<HTMLDivElement>();
  treeWrapperRef = createRef<HTMLDivElement>();

  /**
   * 节点 DOM 映射表
   */
  nodeDomWeakMap = new WeakMap<T, HTMLDivElement>();

  getNodeDom(node: T) {
    return this.nodeDomWeakMap.get(node);
  }
  setNodeDom(node: T, dom: HTMLDivElement) {
    this.nodeDomWeakMap.set(node, dom);
  }

  /**
   * 节点 dfs上下文 映射表
   */
  nodeCtxWeakMap = new WeakMap<T, Context<T>>();
  getNodeCtx(node: T) {
    return this.nodeCtxWeakMap.get(node);
  }
  setNodeCtx(node: T, ctx: Context<T>) {
    this.nodeCtxWeakMap.set(node, ctx);
  }

  /**
   * 节点 位置信息 映射表
   */
  nodePositionWeakMap = new WeakMap<T, Position>();
  setNodePosition = (node: T, position: Position) => {
    const oldPosition = this.nodePositionWeakMap.get(node);
    if (oldPosition) {
      Object.assign(oldPosition || {}, position);
    } else {
      this.nodePositionWeakMap.set(node, position);
    }
  };
  getNodePosition = <
    K extends keyof Position | undefined = undefined,
    D extends number | undefined = undefined
  >(
    node: T,
    key?: K,
    defaultValue?: D
  ): K extends undefined
    ? Position | undefined
    : D extends undefined
    ? Position[keyof Position]
    : D => {
    const position = this.nodePositionWeakMap.get(node);
    if (key) {
      // @ts-ignore
      return get(position, key, defaultValue);
    }
    // @ts-ignore
    return position;
  };

  // 底板
  layout = {
    minLeft: 0,
    minTop: 0,
    maxLeft: 0,
    maxTop: 0,
  };

  state: TyState<T> = {
    renderSeq: 0,
    treeList: [], // this.props.treeList
  };

  /**
   * 运行时状态信息
   */
  runtime: {
    treeRending: boolean;
    treeRenderCompleted: boolean;
    moveStartPos: {
      x: number;
      y: number;
      scrollLeft: number;
      scrollTop: number;
    };
    moveStart: boolean;
    moveEnd: boolean;
    moving: boolean;
    zoom: number;
    positionDirty: boolean;
    refreshTriggerNode: T | null;
    scrollTopBeforeChange: number;
    scrollLeftBeforeChange: number;
    nodeClientRectTopBeforeChange: number;
    nodeClientRectLeftBeforeChange: number;
    offsetInfoReady: boolean;
  } = {
    treeRending: false,
    treeRenderCompleted: false,
    moveStartPos: { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 },
    moveStart: false,
    moveEnd: true,
    moving: false,
    zoom: 1,
    positionDirty: false,
    refreshTriggerNode: null,
    scrollTopBeforeChange: 0,
    scrollLeftBeforeChange: 0,
    nodeClientRectTopBeforeChange: 0,
    nodeClientRectLeftBeforeChange: 0,
    offsetInfoReady: false,
  };

  get getLayoutOffset() {
    const { height, width } = this.props as Readonly<TyMultiTreeProps<T>>;
    // const {zoom} = this.runtime;
    const minWidth = get(this.containerRef.current, "offsetWidth", width) * 1.5;
    const minHeight =
      get(this.containerRef.current, "offsetHeight", height) * 1.5;
    return {
      height: Math.max(minHeight, height * 1.5),
      width: Math.max(minWidth, width * 1.5),
    };
  }

  refresh = (cb?: () => void) => {
    if (this.runtime.treeRending) {
      return;
    }
    if (this.runtime.positionDirty) {
      console.log("--- has node size change, exec refresh ---");
    }
    this.setState(
      {
        renderSeq: this.state.renderSeq + 1, // 触发组件更新
      },
      () => {
        this.runtime.positionDirty = false;
        cb?.();
      }
    );
  };

  debounceHeightChange = debounce((node: T) => {
    this.recordChangeNodeInfo(node);
    this.refresh();
  }, 20);

  debounceRefresh = debounce(this.refresh.bind(this), 20);

  treeBuildBefore = () => {
    this.runtime.treeRending = true;
    this.runtime.offsetInfoReady = true;
    this.runtime.treeRenderCompleted = false;
    this.maxTopMap = {};
    Object.assign(this.layout, {
      minLeft: Infinity,
      minTop: Infinity,
      maxLeft: 0,
      maxTop: 0,
    });
  };

  treeBuildAfter = () => {
    this.runtime.treeRending = false;
    // 叶子节点位置信息是否获取成功 TODO: 待优化
    if (!this.runtime.offsetInfoReady) {
      this.debounceRefresh();
      return;
    }
    this.runtime.treeRenderCompleted = true;
  };

  // TODO: 缩放逻辑有待优化(卡片位置问题)
  zoomSize = (zoom = this.runtime.zoom) => {
    const { layoutSafeMargin } = this.props as Readonly<TyMultiTreeProps<T>>;
    requestAnimationFrame(() => {
      if (this.layoutRef.current) {
        // 安全距离
        const safeBase = layoutSafeMargin;
        const safeSpan = safeBase * zoom * (zoom + 1);

        const { maxLeft, minLeft, minTop, maxTop } = this.layout;
        const { height, width } = this.getLayoutOffset;
        const newWidth = Math.max(maxLeft, width);
        const newHeight = Math.max(maxTop, height);
        const needTransX = -Math.min(minLeft, 0);
        const needTransY = -Math.min(minTop, 0);
        // 由于缩放，需要上下左右均分增/减的size
        const zoomAddWidth = (newWidth * (1 / zoom - 1)) / 2;
        // TODO: 待优化 竖直方向缩放中心是center，处理逻辑与水平方向（缩放中心left）不同
        const zoomAddHeight = (newHeight * (zoom - 1)) / 2;
        let transX = needTransX * zoom + zoomAddWidth * zoom;
        let transY = needTransY + zoomAddHeight * zoom;

        // zoomIn可能会导致transX变成负值，需修正transX
        if (minLeft < -transX) {
          transX = -minLeft;
        }

        const style = {
          width: `${newWidth + zoomAddWidth + safeSpan}px`, // right
          height: `${newHeight + (zoom > 1 ? 0 : zoomAddHeight) + safeBase}px`, // bottom
          transform: `translate(${transX + safeSpan}px, ${
            transY + safeBase
          }px) scale(${zoom})`, // left ｜ top
        };

        // 放大偏移
        if (zoom >= 1 && zoom !== this.runtime.zoom && this.runtime.zoom >= 1) {
          const cDom = this.scrollWrapperRef.current;
          if (!cDom) {
            return;
          }
          const { scrollLeft, scrollWidth } = cDom;
          setTimeout(() => {
            const { scrollWidth: nextScrollWidth, offsetWidth } = cDom;
            cDom.scrollTo({
              left:
                (scrollLeft * (nextScrollWidth - offsetWidth)) /
                (scrollWidth - offsetWidth),
              behavior: "smooth",
            });
          }, 300);
        }
        // 画布尺寸更新后
        Object.assign(this.layoutRef.current.style, style);
        this.runtime.zoom = zoom;
        // 画布尺寸更新后 修正滚动条位置保证视觉中心不变
        this.adjustTopIfNeed();
      }
    });
  };

  // 需要销毁的拖拽事件
  disposeMoveEvent = () => {
    this.moveEndRemover && this.moveEndRemover();
    this.movingRemover && this.movingRemover();
  };

  __animationFrame: number | null = null;
  animateRemover: (() => void) | null = null;
  moveEndRemover: (() => void) | null = null;
  movingRemover: (() => void) | null = null;

  initPosition() {
    if (this.__animationFrame) {
      cancelAnimationFrame(this.__animationFrame);
      this.__animationFrame = null;
    }
    this.__animationFrame = requestAnimationFrame(() => {
      this.setCenterPosition({ init: true });

      // 定位后再添加动画（初始化定位不需要动画效果）
      this.animateRemover && this.animateRemover();
      this.animateRemover = this.layoutRef.current
        ? addClass(this.layoutRef.current, c("translate-animate"))
        : null;
    });
  }

  componentDidMount() {
    // 节点从有切为空，dom卸载，再切回来，然后再挂载dom时 不触发componentDidUpdate，但这时treeRenderCompleted = true
    if (this.runtime.treeRenderCompleted) {
      this.zoomSize(this.runtime.zoom);
      if (treeChange) {
        treeChange = false;
        this.initPosition();
      }
    }
  }

  componentDidUpdate(prevProps: MultiTreeProps<T>, prevState: TyState<T>) {
    if (
      this.runtime.treeRenderCompleted &&
      prevState.renderSeq !== this.state.renderSeq
    ) {
      // update 完毕
      this.zoomSize(this.runtime.zoom);
      // props.treeList change
      if (treeChange) {
        treeChange = false;
        // this.nodeWidth = 0;
        this.initPosition();
      }
    }
  }

  componentWillUnmount() {
    treeChange = false;
    this.disposeMoveEvent();
    this.animateRemover && this.animateRemover();
  }

  renderTreeGroup(treeList = this.state.treeList) {
    const {
      openLeftKey,
      openRightKey,
      leftTreePath,
      rightTreePath,
      layoutBgColor,
    } = this.props as Readonly<TyMultiTreeProps<T>>;
    this.treeBuildBefore();
    const treeNodeList: T[] = [];
    treeList.forEach((tree, treeIndex) => {
      // 左树包含center node
      const leftTreeNodeList = this.buildTreeToList({
        data: tree,
        treeIndex,
        path: leftTreePath,
        openKey: openLeftKey,
        direction: "left",
        includeCenterNode: true,
      });
      const rightTreeNodeList = this.buildTreeToList({
        data: tree,
        treeIndex,
        path: rightTreePath,
        openKey: openRightKey,
        direction: "right",
        otherSideTreeList: leftTreeNodeList,
      });
      treeNodeList.push(...leftTreeNodeList, ...rightTreeNodeList);
    });
    const treeDomList = treeNodeList.map((node) => this.renderNode(node));
    const result = (
      <div
        style={{ backgroundColor: layoutBgColor }}
        className={c("tree-layout-wrapper")}
        ref={this.scrollWrapperRef}
        onMouseDownCapture={(e) => {
          // 非右键 (这样反向判断不影响移动端)
          if (e.button !== 2) {
            // 捕获阶段 防止被阻止冒泡打断
            const cDom = this.scrollWrapperRef.current;
            if (!cDom) {
              return;
            }
            Object.assign(this.runtime.moveStartPos, {
              x: e.pageX,
              y: e.pageY,
              scrollTop: cDom.scrollTop,
              scrollLeft: cDom.scrollLeft,
            });
            this.enableMoveAction();
          }
        }}
        onMouseMove={(e) => {
          // 禁止浏览器默认行为：拖拽到边界时，滚动条会自动滚动
          e.preventDefault();
        }}
      >
        <div className={c("tree-layout")} ref={this.layoutRef}>
          {treeDomList}
        </div>
      </div>
    );
    this.treeBuildAfter();
    return result;
  }

  // 记录每列最大top，辅助节点的位置计算
  // 路径：treeIndex.path.depth
  maxTopMap: Record<
    number,
    {
      [P in Direction]?: Record<number, NodeWithTop<T>>;
    }
  > = {};

  // 计算节点位置的核心方法
  // tree to node list
  buildTreeToList = ({
    treeList = this.state.treeList,
    data = this.state.treeList[0],
    treeIndex = 0,
    path,
    openKey,
    direction = "left",
    includeCenterNode = false, // 是否包含中心节点
    otherSideTreeList = [], // 另一边tree，对于right来说就是leftTree
  }: {
    treeList?: T[];
    data?: T;
    treeIndex?: number;
    path: keyof T;
    openKey: keyof T;
    direction?: "left" | "right";
    includeCenterNode?: boolean;
    otherSideTreeList?: T[];
  }) => {
    const treeToList: T[] = [];
    if (!data) {
      return treeToList;
    }
    const { cardWidth, cardHeightSpan, cardWidthSpan, treeTopSpan } = this
      .props as Readonly<TyMultiTreeProps<T>>;
    const { height, width } = this.getLayoutOffset;
    const { getNodePosition, setNodePosition } = this;

    syncVisitTree(
      data,
      (node, ctx) => {
        // console.log(node, ctx, ':---visitTree before---');

        // 给节点注入上下文信息，方便回溯
        this.setNodeCtx(node, ctx);
        node.__direction = direction;
        node.__treeIndex = treeIndex;
        if (!ctx.parent) {
          node.__isRoot = true;
          // 节点注入树方向信息
          node.__direction = "center";
        }

        // 有一个节点没有位置信息，则需要再次render，通过key值标示提高render性能。
        if (isNil(getNodePosition(node, "width"))) {
          this.runtime.offsetInfoReady = false;
          if (!node.__isRoot || includeCenterNode) {
            treeToList.push(node);
          }
          return;
        }

        const nodeHeight = getNodePosition(node, "height");
        if (!isNil(nodeHeight)) {
          // 默认取节点中心
          if (!node.__forkPointTopOffset) {
            node.__forkPointTopOffset = nodeHeight / 2;
          } else {
            // 树杈点不能高于节点中心
            node.__forkPointTopOffset = Math.min(
              nodeHeight / 2,
              node.__forkPointTopOffset
            );
          }
        }

        // ****** 中心节点单独处理 Start ******
        if (!ctx.parent) {
          // skip root node when is not includeCenterNode
          if (!includeCenterNode) {
            if (!node[openKey]) {
              ctx.skip();
            }
            return;
          }

          let top = 0;
          let left = 0;
          if (treeIndex === 0) {
            // 确定第一个tree的root位置
            const centerCardTotalHeight =
              treeList.reduce((pre, cur) => {
                return pre + getNodePosition(cur, "height", 0);
              }, 0) +
              (treeList.length - 1) * cardHeightSpan;

            // const spanWidth = getNodePosition(node, 'width', cardWidth);
            const spanWidth = this.nodeWidth || cardWidth;
            top =
              (Math.max(centerCardTotalHeight, height) -
                centerCardTotalHeight) /
              2;
            left = (width - spanWidth) / 2;
          } else {
            const prevPeedNode = treeList[treeIndex - 1];
            const spanHeight =
              getNodePosition(prevPeedNode, "height", 0) + cardHeightSpan;
            top = getNodePosition(prevPeedNode, "top", 0) + spanHeight;
            left = getNodePosition(prevPeedNode, "left", 0);

            // 更新layout maxTop
            this.layout.maxTop = Math.max(this.layout.maxTop, top + spanHeight);
          }

          // 给节点注入位置信息
          setNodePosition(node, {
            top,
            left,
          });

          treeToList.push(node);
          if (!node[openKey]) {
            ctx.skip();
          }
          return;
        }
        // ****** 中心节点单独处理 End ******

        const peerNodes = ctx.parent[path] as T[];
        // 注入渲染信息
        node.__isFirst = ctx.index === 0;
        node.__isLast = ctx.index === peerNodes.length - 1;

        const prevPeerNode = peerNodes[ctx.index - 1];
        // const spanWidth = getNodePosition(ctx.parent, 'width', cardWidth) + cardWidthSpan;
        const spanWidth = this.nodeWidth + cardWidthSpan;
        const spanHeight =
          getNodePosition(prevPeerNode, "height", 0) + cardHeightSpan;

        const totalHeight =
          peerNodes.reduce((pre, cur) => {
            return pre + getNodePosition(cur, "height", 0);
          }, 0) +
          (peerNodes.length - 1) * cardHeightSpan;

        // 父节点到子节点的分叉点top位置（默认取第一次渲染时节点高度中心，即后续改变卡片高度，分叉点位置恒定）
        const parentForkPointTopOffset =
          get(ctx.parent, "__forkPointTopOffset") ||
          getNodePosition(ctx.parent, "height", 0) / 2;
        let firstPeerNodeTop =
          getNodePosition(ctx.parent, "top", 0) +
          parentForkPointTopOffset -
          totalHeight / 2;

        // 多个peer
        if (peerNodes.length > 1) {
          const firstPeer = peerNodes[0];
          const lastPeer = peerNodes[peerNodes.length - 1];
          const heightDiff =
            getNodePosition(firstPeer, "height", 0) -
            getNodePosition(lastPeer, "height", 0);
          // INFO: 第一个节点和最后一个节点存在高度差，top需要偏移修正 /2/2
          firstPeerNodeTop -= heightDiff / 4;
        }
        let top = !ctx.index
          ? firstPeerNodeTop
          : getNodePosition(prevPeerNode, "top", 0) + spanHeight;
        const left =
          getNodePosition(ctx.parent, "left", 0) +
          (direction === "left" ? -spanWidth : +spanWidth);

        // 记录同列叶子的最大top位置
        const setSameColumnMaxTopInfo = (depth = ctx.depth) => {
          // 记录树每一列的最大top
          if (!this.maxTopMap[treeIndex]) {
            this.maxTopMap[treeIndex] = {
              [direction]: {},
            };
          }
          if (!this.maxTopMap[treeIndex][direction]) {
            this.maxTopMap[treeIndex][direction] = {};
          }
          if (!this.maxTopMap[treeIndex][direction][depth]) {
            this.maxTopMap[treeIndex][direction][depth] = {};
          }
          const preMaxTop =
            this.maxTopMap[treeIndex][direction][depth].maxTop || -Infinity;
          const curNodeTop =
            top + getNodePosition(node, "height", 0) + treeTopSpan;
          if (preMaxTop < curNodeTop) {
            Object.assign(this.maxTopMap[treeIndex][direction][depth], {
              maxTop: curNodeTop,
              node,
            });
          }
        };

        // 获取同列叶子的最大top位置
        const getSameColumnMaxTopInfo = () => {
          const curTreePreNode = get(
            this.maxTopMap[treeIndex],
            `${direction}.${ctx.depth}`
          );
          // 最大top位置出现在 current tree
          if (curTreePreNode) {
            return {
              preMaxTop: curTreePreNode.maxTop,
              node: curTreePreNode.node,
              atCurTree: true,
            };
          } else {
            // else other tree
            let preTreePreNode: NodeWithTop<T> = {};
            // 查找最大top位置出现在的树
            for (let i = treeIndex - 1; i >= 0; i--) {
              preTreePreNode = get(
                this.maxTopMap[i],
                `${direction}.${ctx.depth}`,
                {}
              );
              if (preTreePreNode.node) {
                break;
              }
            }

            return {
              preMaxTop: preTreePreNode.maxTop,
              node: preTreePreNode.node,
              atCurTree: false,
            };
          }
        };

        const { preMaxTop = -Infinity, atCurTree } = getSameColumnMaxTopInfo();

        // 位置被占用，需要调整
        if (top < preMaxTop) {
          let diff = preMaxTop - top;
          top = preMaxTop;

          // INFO: 位置冲突发生在同根树，仅调整当前节点回溯至根节点的部分
          if (atCurTree) {
            const len = ctx.parents.length; // ctx.parents 为当前节点的所有祖先节点
            let walkDepth = ctx.depth;
            for (let i = len - 1; i >= 0; i--) {
              const walkNode = ctx.parents[i];
              setNodePosition(walkNode, {
                top: getNodePosition(walkNode, "top")! + diff,
              });
              --walkDepth;

              // INFO: 更新每列最大top
              const nodeInfo = get(
                this.maxTopMap,
                `${treeIndex}.${direction}.${walkDepth}`
              );
              if (nodeInfo) {
                nodeInfo.maxTop = diff + (nodeInfo.maxTop || 0);
              }
              const walkNodeCtx = this.getNodeCtx(walkNode);

              // INFO: 按需更新diff（当前节点不是第一个peer叶子的话，父节点偏移减半）
              if (walkNodeCtx && walkNodeCtx.index > 0) {
                diff = diff / 2;
              }
            }
          } else {
            const adjusted: Record<number, boolean> = {};
            // 调整所有已push的node
            treeToList.forEach((n) => {
              if (getNodePosition(n)) {
                setNodePosition(n, {
                  top: getNodePosition(n, "top")! + diff,
                });
              }
              const nodeCtx = this.getNodeCtx(n);
              if (nodeCtx && !adjusted[nodeCtx.depth]) {
                adjusted[nodeCtx.depth] = true;
                const nodeInfo = get(
                  this.maxTopMap,
                  `${treeIndex}.${direction}.${nodeCtx.depth}`
                );
                if (nodeInfo) {
                  nodeInfo.maxTop = diff + (nodeInfo.maxTop || 0);
                }
              }
            });
          }

          // INFO: 无论哪种情况的位置冲突都需要调整另一边树的node
          const adjusted: Record<number, boolean> = {};
          otherSideTreeList.forEach((n) => {
            // 排除root节点
            if (!atCurTree || !n.__isRoot) {
              if (getNodePosition(n)) {
                setNodePosition(n, {
                  top: getNodePosition(n, "top")! + diff,
                });
              }
              const nodeCtx = this.getNodeCtx(n);
              if (nodeCtx && n.__direction && !adjusted[nodeCtx.depth]) {
                adjusted[nodeCtx.depth] = true;
                const nodeInfo = get(
                  this.maxTopMap,
                  `${treeIndex}.${n.__direction}.${nodeCtx.depth}`
                );
                if (nodeInfo) {
                  nodeInfo.maxTop = diff + (nodeInfo.maxTop || 0);
                  // this.maxTopMap[treeIndex][n.__direction][nodeCtx.depth].maxTop += diff;
                }
              }
            }
          });
        }

        // 给节点注入位置信息
        setNodePosition(node, {
          top,
          left,
        });

        // 更新画布边界位置
        if (direction === "left") {
          this.layout.minLeft = Math.min(this.layout.minLeft, left);
        } else {
          this.layout.maxLeft = Math.max(this.layout.maxLeft, left + spanWidth);
        }
        this.layout.minTop = Math.min(this.layout.minTop, top);
        this.layout.maxTop = Math.max(this.layout.maxTop, top + spanHeight);

        // 需要记录最大top位置
        if (peerNodes.length === ctx.index + 1) {
          setSameColumnMaxTopInfo();
        }

        treeToList.push(node);

        // 子节点未展开，跳过
        if (!node[openKey]) {
          ctx.skip();
        }
      },
      {
        path: path as string,
      }
    );

    return treeToList;
  };

  // 整体调整（修正）节点及画布top位置
  adjustTopIfNeed = () => {
    const {
      refreshTriggerNode,
      scrollTopBeforeChange,
      scrollLeftBeforeChange,
    } = this.runtime;
    if (refreshTriggerNode) {
      const refreshTriggerNodeDom = this.getNodeDom(refreshTriggerNode);
      if (!refreshTriggerNodeDom) {
        return;
      }

      // 使用getBoundingClientRect获取最新位置与变更之前位置求差 进行修正
      const { top, left } = refreshTriggerNodeDom.getBoundingClientRect();
      const clientRectTopDiff =
        top - this.runtime.nodeClientRectTopBeforeChange;
      const clientRectLeftDiff =
        left - this.runtime.nodeClientRectLeftBeforeChange;
      // scrollTop 不支持小数位
      const diffTop =
        clientRectTopDiff >= 0
          ? Math.ceil(clientRectTopDiff)
          : Math.floor(clientRectTopDiff);
      const diffLeft =
        clientRectLeftDiff >= 0
          ? Math.ceil(clientRectLeftDiff)
          : Math.floor(clientRectLeftDiff);

      // 通过调整滚动条实现，变化节点作为视觉中心定位
      const sDom = this.scrollWrapperRef.current;
      const nextScrollTop = scrollTopBeforeChange + diffTop;
      const nextScrollLeft = scrollLeftBeforeChange + diffLeft;
      // console.log(
      //     'sDom sHeight sTop sTopBefore diff next:',
      //     sDom,
      //     sDom.scrollHeight,
      //     sDom.scrollTop,
      //     scrollTopBeforeChange,
      //     diffTop,
      //     scrollLeftBeforeChange,
      //     diffLeft,
      //     nextScrollTop
      // );
      sDom?.scrollTo({
        top: nextScrollTop,
        left: nextScrollLeft,
      });
      this.runtime.refreshTriggerNode = null;
    }
  };

  // 记录变化的节点（导致计算树进行重新渲染）
  recordChangeNodeInfo = (node: T) => {
    this.runtime.refreshTriggerNode = node;
    const scrollDom = this.scrollWrapperRef.current;
    if (scrollDom) {
      this.runtime.scrollTopBeforeChange = scrollDom.scrollTop;
      this.runtime.scrollLeftBeforeChange = scrollDom.scrollLeft;
    }
    const dom = this.getNodeDom(node);
    if (dom) {
      const { top, left } = dom.getBoundingClientRect();
      this.runtime.nodeClientRectTopBeforeChange = top;
      this.runtime.nodeClientRectLeftBeforeChange = left;
    }
  };

  // 不足一屏整体居中，超过一屏默认第一个节点可见，也可传入visiableNode
  setCenterPosition = (
    options: {
      behavior?: "auto" | "smooth";
      init?: boolean;
    } = {}
  ) => {
    const { behavior = "auto", init = false } = options;
    if (init) {
      const sDom = this.scrollWrapperRef.current;
      if (sDom) {
        // 先居中
        sDom.scrollTo({
          left: (sDom.scrollWidth - sDom.offsetWidth) / 2,
          top: (sDom.scrollHeight - sDom.offsetHeight) / 2,
          behavior,
        });

        const { visiableNode = this.state.treeList[0] } = this.props;
        const visiableNodeDom = visiableNode
          ? this.getNodeDom(visiableNode)
          : null;
        // 再检查定位需可见的node
        visiableNodeDom &&
          this.scrollNodeIntoView(visiableNodeDom, {
            behavior: "auto",
          });
      }
    } else {
      const cDom = this.getNodeDom(this.state.treeList[0]);
      if (cDom) {
        cDom.scrollIntoView({
          behavior, // auto | smooth
          block: "center", // start, center, end, 或 nearest, Defaults to start.
          inline: "center", // Defaults to nearest.
        });
      }
    }
  };

  scrollNodeIntoView = (
    dom: HTMLElement | undefined,
    opt: {
      behavior?: "auto" | "smooth";
      offsetTop?: number;
      offsetBottom?: number;
      offsetLeft?: number;
      offsetRight?: number;
    } = {}
  ) => {
    const { toggleBtnSpan } = this.props as Readonly<TyMultiTreeProps<T>>;
    const xSpan = toggleBtnSpan + ToggleBtnSize + 20;
    dom &&
      scrollIntoViewIfNeeded(dom, {
        behavior: "smooth",
        offsetTop: 100,
        offsetBottom: 100,
        offsetLeft: xSpan,
        offsetRight: xSpan,
        ...opt,
      });
  };

  // 启动拖拽事件监听
  enableMoveAction = () => {
    const cDom = this.scrollWrapperRef.current;
    if (!cDom) {
      return;
    }
    const { x, y, scrollLeft, scrollTop } = this.runtime.moveStartPos;
    this.runtime.moveStart = true;
    this.runtime.moveEnd = false;
    cDom.style.cursor = "grabbing";
    this.disposeMoveEvent();
    this.movingRemover = addEventListener(
      document,
      "mousemove",
      throttle((e) => {
        const diffX = e.pageX - x;
        const diffY = e.pageY - y;
        // 拖动意图识别阈值
        const threshold = 1;
        if (
          !this.runtime.moveEnd &&
          !this.runtime.moving &&
          (Math.abs(diffX) > threshold || Math.abs(diffY) > threshold)
        ) {
          // 视为拖拽移动
          this.runtime.moving = true;
          // 拖拽中鼠标样式
          // cDom.style.cursor = 'move';
        }
        if (this.runtime.moving) {
          cDom && cDom.scrollTo(scrollLeft - diffX, scrollTop - diffY);
        }
      }, 50)
    );
    this.moveEndRemover = addEventListener(
      document,
      "mouseup",
      (e) => {
        this.runtime.moving = false;
        this.runtime.moveStart = false;
        this.runtime.moveEnd = true;
        cDom.style.cursor = "";
        this.disposeMoveEvent();
      },
      true
    ); // 捕获阶段 防止被阻止冒泡打断
  };

  getNodeCenterTop = (node: T, offset?: number) => {
    return (
      this.getNodePosition(node, "top", 0) +
      (offset || this.getNodePosition(node, "height", 0) / 2)
    );
  };

  getHorizontalLineWidth = () => {
    const { cardWidthSpan, toggleBtnSpan } = this.props as Readonly<
      TyMultiTreeProps<T>
    >;
    // - shortLine * 2 - btnSize
    const base = cardWidthSpan - toggleBtnSpan * 2 - ToggleBtnSize;
    return base;
  };

  getVerticalLineHeight = (nodeList: T[]) => {
    if (!nodeList) {
      return 0;
    }
    const { getNodeCenterTop } = this;
    const buffer = 1;
    const topNode = nodeList[0];
    const bottomNode = nodeList[nodeList.length - 1];
    const topNodeHalfHeight = this.getNodePosition(topNode, "height", 0) / 2;
    const bottomNodeHalfHeight =
      this.getNodePosition(bottomNode, "height", 0) / 2;
    return (
      getNodeCenterTop(bottomNode) -
      getNodeCenterTop(topNode) -
      Math.min(topNodeHalfHeight, bottomNodeHalfHeight) * 2 +
      buffer
    );
  };

  // 某个节点到父级分叉点（树杈）的距离
  getTopBottomToParentDistance = (node: T) => {
    const { parent: parentNode } = this.getNodeCtx(node) || {};
    if (!parentNode) {
      return 0;
    }
    const { getNodeCenterTop } = this;
    return Math.abs(
      getNodeCenterTop(parentNode, parentNode.__forkPointTopOffset) -
        getNodeCenterTop(node)
    );
  };

  getVerticalSolidLineHeightAndTop = (nodeList: T[], parentNode: T) => {
    const { virtualNodeKey, topBottomLineRadius } = this.props as Readonly<
      TyMultiTreeProps<T>
    >;
    const { getNodeCenterTop } = this;
    const parentNodeCenterTop = getNodeCenterTop(
      parentNode,
      parentNode.__forkPointTopOffset
    );

    const buffer = 1;
    let height = 0;

    // 第一个真实节点
    let firstRealNodeCenterTop = null;
    // 最后一个真实节点
    let lastRealNodeCenterTop = null;

    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      if (!node[virtualNodeKey]) {
        const centerTop = getNodeCenterTop(node);
        if (firstRealNodeCenterTop === null) {
          firstRealNodeCenterTop = centerTop;
        }
        lastRealNodeCenterTop = centerTop;
      }
    }

    // 相对父节点树杈中心的纵向偏移量
    let offsetTop = 0;
    if (firstRealNodeCenterTop !== null && lastRealNodeCenterTop !== null) {
      // 第一个真实节点是否在树杈的上支
      if (firstRealNodeCenterTop < parentNodeCenterTop) {
        height =
          Math.max(lastRealNodeCenterTop, parentNodeCenterTop) -
          firstRealNodeCenterTop;
        offsetTop = firstRealNodeCenterTop - parentNodeCenterTop;
      } else {
        height = lastRealNodeCenterTop - parentNodeCenterTop;
      }

      // 第一个节点非虚
      if (!nodeList[0][virtualNodeKey]) {
        height -= topBottomLineRadius;
        offsetTop += topBottomLineRadius - LineSize / 2;
      }

      // 最后一个节点非虚
      if (!nodeList[nodeList.length - 1][virtualNodeKey]) {
        height -= topBottomLineRadius;
      }
    }

    return {
      height: height ? height + LineSize / 2 + buffer : 0,
      top: offsetTop,
    };
  };

  /**
   * 切换子树展开/折叠状态
   *
   * @param node 当前节点
   * @param direction 展开/折叠的方向，可选值为 'left' 或 'right'，默认为 'left'
   */
  toggleChildTree = async (node: T, direction: "left" | "right" = "left") => {
    const {
      fetchChildTree,
      needCache,
      cacheMaxAge,
      leftTreePath,
      openLeftKey,
      leftNumKey,
      rightTreePath,
      openRightKey,
      rightNumKey,
      leftVirtualNumKey,
      // leftVirtualChildNum,
      rightVirtualNumKey,
      // rightVirtualChildNum,
      virtualNodeKey,
    } = this.props as Readonly<TyMultiTreeProps<T>>;
    let treePath: keyof T;
    let openKey: keyof T;
    let numKey: keyof T;
    let virtualNumKey: keyof T;
    if (direction === "left") {
      treePath = leftTreePath;
      openKey = openLeftKey;
      numKey = leftNumKey;
      virtualNumKey = leftVirtualNumKey;
    } else {
      treePath = rightTreePath;
      openKey = openRightKey;
      numKey = rightNumKey;
      virtualNumKey = rightVirtualNumKey;
    }

    if (!node[openKey] && fetchChildTree) {
      const fetchData = async () => {
        const childList = (await fetchChildTree(node, direction)) || [];
        (node[treePath] as T[]) = childList;
        let virtualChildNum = 0;
        for (const childNode of childList) {
          if (childNode[virtualNodeKey]) {
            virtualChildNum++;
          }
        }
        (node[virtualNumKey] as number) = virtualChildNum;
        (node[numKey] as number) = childList.length - virtualChildNum;
        // 记录最后一次获取子节点的时间
        node.__childrenUpdateTime = Date.now();
      };

      if (needCache) {
        const noChildren = !node[treePath] || !(node[treePath] as T[]).length;
        if (
          noChildren ||
          !node.__childrenUpdateTime ||
          Date.now() - node.__childrenUpdateTime > cacheMaxAge
        ) {
          await fetchData();
        }
      } else {
        await fetchData();
      }
    }
    (node[openKey] as boolean) = !node[openKey];
    this.recordChangeNodeInfo(node);
    this.refresh(() => {
      setTimeout(() => {
        let dom;
        if (node[openKey]) {
          const childList = node[treePath] as T[];
          const middleNode = childList[Math.floor(childList.length / 2)];
          dom = this.getNodeDom(middleNode);
        } else {
          dom = this.getNodeDom(node);
        }
        this.scrollNodeIntoView(dom);
      }, 150);
    });
  };

  renderNode(node: T) {
    const {
      cardWrapClassName,
      cardHeightSpan,
      cardWidth,
      // cardHeight,
      treeTopSpan,
      renderCard,
      leftTreePath,
      openLeftKey,
      leftNumKey,
      leftVirtualNumKey,
      rightVirtualNumKey,
      rightTreePath,
      openRightKey,
      rightNumKey,
      virtualNodeKey,
      topBottomLineRadius,
      toggleBtnSpan,
      onToggle,
    } = this.props as Readonly<TyMultiTreeProps<T>>;
    const { getNodePosition } = this;
    const isLeftNode = node.__direction === "left"; // 左树节点标示
    const isRightNode = node.__direction === "right"; // 右树节点标示
    const leftChildren = node[leftTreePath] as T[] | undefined;
    const leftRealChildNum = leftChildren?.length
      ? leftChildren.filter((c: T) => !c[virtualNodeKey]).length
      : (node[leftNumKey] as number) || 0;
    const rightChildren = node[rightTreePath] as T[] | undefined;
    const rightRealChildNum = rightChildren?.length
      ? rightChildren.filter((c: T) => !c[virtualNodeKey]).length
      : (node[rightNumKey] as number) || 0;
    const leftVirtualChildNum = (node[leftVirtualNumKey] as number) || 0;
    const rightVirtualChildNum = (node[rightVirtualNumKey] as number) || 0;
    const leftChildNum = leftRealChildNum + leftVirtualChildNum;
    const rightChildNum = rightRealChildNum + rightVirtualChildNum;
    const hasLeftBtn = !isRightNode && !!leftChildNum;
    const hasRightBtn = !isLeftNode && !!rightChildNum;
    const openLeft = !isRightNode && (node[openLeftKey] as boolean);
    const openRight = !isLeftNode && (node[openRightKey] as boolean);
    const isVirtualNode = node[virtualNodeKey] as boolean;
    const isTopChild = !!node.__isFirst && !node.__isLast;
    const isBottomChild = !!node.__isLast && !node.__isFirst;
    const height = getNodePosition(node, "height");
    const width = getNodePosition(node, "width");
    const left = getNodePosition(node, "left");
    const top = getNodePosition(node, "top");
    const nodeCtx = this.getNodeCtx(node);
    const key = `${node.__treeIndex}-${node.__direction}-${nodeCtx?.paths.join(
      "-"
    )}-${
      node.id || node.key || node.__uniKey || (node.__uniKey = getUniKey())
    }`;

    // console.log('---renderNode---:', key);
    return (
      <Measure client throttleMs={0} key={`mea-${key}`}>
        {({ measureRef, contentRect }) => {
          if (contentRect.client) {
            const { width: newWidth, height: newHeight } = contentRect.client;

            // TODO: 主要是高度变化（已有高度的情况下）， 宽度后续看看按需吧
            if (newHeight && height && newHeight !== height) {
              console.log(
                height,
                "=>",
                newHeight,
                "--- node height size change, need refresh"
              );
              const diff = Math.abs(newHeight - height);
              // INFO: 允许误差在1px以内（某些浏览器上会有1px误差导致一直触发刷新导致页面来回抖动）
              if (diff > 1) {
                // 卡片大小变化， 位置需要重新计算
                this.runtime.positionDirty = true;
                this.debounceHeightChange(node);
              }
            }

            // 避免 高度从 有效值 变为 undefined
            // 高度和宽度突然都变成0？一般是整体被隐藏了（display为none），这时候其实可不更新高度和宽度
            // 后续如果需要精确知道node对应的dom是否隐藏，可在高宽均为0时进一步获取dom的display属性看是否为none，然后再针对处理
            if (
              newHeight !== undefined &&
              newWidth !== undefined &&
              newHeight + newWidth > 0
            ) {
              // const dom = this.nodeRefWeakMap.get(node);
              // const nodeDomStyle = window.getComputedStyle(dom);
              // const isHidden = nodeDomStyle.display === 'none';
              // 记录节点最大宽度
              this.nodeWidth = Math.max(this.nodeWidth, newWidth || cardWidth);
              this.setNodePosition(node, {
                width: newWidth,
                height: newHeight,
              });
            }
          }

          return (
            <div
              className={cx(c("card"), cardWrapClassName)}
              key={key}
              ref={(r) => {
                r && this.setNodeDom(node, r);
                assignRef(measureRef, r);
              }}
              style={{
                top: top || 0,
                left: left || 0,
                // height,
                width: this.nodeWidth, // width,
                visibility: isNil(top) ? "hidden" : "inherit",
              }}
            >
              <div className={c("card-content")}>
                {renderCard
                  ? renderCard(node)
                  : this.renderDefaultCard(node, key)}
                {this.renderToggleButton({
                  hasLeftBtn,
                  hasRightBtn,
                  openLeft,
                  openRight,
                  onToggle,
                  node,
                  rightTreePath,
                  rightRealChildNum,
                  rightVirtualChildNum,
                  leftTreePath,
                  leftVirtualChildNum,
                  leftRealChildNum,
                  toggleBtnSpan,
                })}
                {this.renderHorizontalLine({
                  isLeftNode,
                  isRightNode,
                  isTopChild,
                  isBottomChild,
                  isVirtualNode,
                  node,
                  topBottomLineRadius,
                  // cardHeightSpan,
                  treeTopSpan,
                })}
              </div>
            </div>
          );
        }}
      </Measure>
    );
  }

  /**
   * 渲染默认节点卡片
   */
  renderDefaultCard(node: T, key: string) {
    const { cardWidth } = this.props as Readonly<TyMultiTreeProps<T>>;
    const style = {
      width: cardWidth,
      textAlign: "center" as const,
    };
    return (
      <div className={c("d-card")} style={style}>
        {node.label || key}
      </div>
    );
  }

  /**
   * 渲染展开收起按钮
   */
  renderToggleButton({
    hasLeftBtn,
    hasRightBtn,
    openLeft,
    openRight,
    onToggle,
    node,
    rightTreePath,
    rightRealChildNum,
    rightVirtualChildNum,
    leftTreePath,
    leftVirtualChildNum,
    leftRealChildNum,
    toggleBtnSpan,
  }: {
    hasLeftBtn: boolean;
    hasRightBtn: boolean;
    openLeft: boolean;
    openRight: boolean;
    onToggle?: (node: T, xKey: "left" | "right") => void;
    node: T;
    rightTreePath: keyof T;
    rightRealChildNum: number;
    rightVirtualChildNum: number;
    leftTreePath: keyof T;
    leftVirtualChildNum: number;
    leftRealChildNum: number;
    toggleBtnSpan: number;
  }) {
    if (!hasLeftBtn && !hasRightBtn) {
      return null;
    }

    const getComp = (xKey: "left" | "right") => {
      const isRenderLeft = xKey === "left";
      const childIsAllVirtual = isRenderLeft
        ? !leftRealChildNum
        : !rightRealChildNum;
      const showChild = isRenderLeft ? openLeft : openRight;
      const hasVirtualChild =
        (isRenderLeft ? leftVirtualChildNum : rightVirtualChildNum) > 0;
      const childNodeList =
        (node[isRenderLeft ? leftTreePath : rightTreePath] as T[]) || [];
      const showVerticalLine = childNodeList?.length > 1;
      const childOffsetInfoReady =
        this.getNodePosition(childNodeList[0], "height", -1) >= 0;
      const displayChildCount = isRenderLeft
        ? leftRealChildNum
        : rightRealChildNum;
      return (
        <div
          className={c("btn-line-wrapper")}
          style={{
            top: node.__forkPointTopOffset,
            [xKey]: 0,
          }}
        >
          <div
            className={cx(c("toggle-btn"), hasVirtualChild && "has-virtual")}
            style={{
              [xKey]: -(toggleBtnSpan + ToggleBtnSize),
            }}
            onClick={async (e) => {
              const dom = this.getNodeDom(node);
              const loadingRemover =
                dom && addClass(dom, `loading-${xKey}-child-tree`);
              await this.toggleChildTree(node, xKey);
              loadingRemover && loadingRemover();
              onToggle && onToggle(node, xKey);
            }}
          >
            {showChild ? (
              <span className={"icon-fold"} />
            ) : (
              `${displayChildCount}`
            )}
            <div className={cx("loading-icon", `${xKey}-loading`)}></div>
          </div>
          <div
            className={cx(c("short-line"), childIsAllVirtual && "dashed-line")}
            style={{
              [xKey]: -toggleBtnSpan,
              width: toggleBtnSpan,
            }}
          ></div>
          {showChild && childOffsetInfoReady && (
            <Fragment>
              <div
                className={cx(
                  c("short-line"),
                  childIsAllVirtual && "dashed-line"
                )}
                style={{
                  [xKey]: -(2 * toggleBtnSpan + ToggleBtnSize),
                  width: toggleBtnSpan,
                }}
              />
              {showVerticalLine && (
                <Fragment>
                  <div
                    className={c("vertical-line-dashed")}
                    style={{
                      height: this.getVerticalLineHeight(childNodeList),
                      [xKey]: -(2 * toggleBtnSpan + ToggleBtnSize + LineSize),
                    }}
                  />
                  <div
                    className={c("vertical-line")}
                    style={{
                      // TODO: 由于渲染顺序是先父后子（前序遍历的），所以这里渲染node时取childNodeList的位置可能不是最新，待优化
                      ...this.getVerticalSolidLineHeightAndTop(
                        childNodeList,
                        node
                      ),
                      [xKey]: -(2 * toggleBtnSpan + ToggleBtnSize + LineSize),
                    }}
                  />
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      );
    };
    return (
      <Fragment>
        {hasLeftBtn && getComp("left")}
        {hasRightBtn && getComp("right")}
      </Fragment>
    );
  }

  /**
   * 渲染水平线条
   */
  renderHorizontalLine({
    isLeftNode,
    isRightNode,
    isTopChild,
    isVirtualNode,
    isBottomChild,
    node,
    topBottomLineRadius,
    // cardHeightSpan, // 高度计算暂时不加这个
    treeTopSpan,
  }: {
    isLeftNode: boolean;
    isRightNode: boolean;
    isTopChild: boolean;
    isVirtualNode: boolean;
    isBottomChild: boolean;
    node: T;
    topBottomLineRadius: number;
    // cardHeightSpan: number;
    treeTopSpan: number;
  }) {
    if (!isLeftNode && !isRightNode) {
      return null;
    }
    const ryKey = isTopChild ? "Top" : "Bottom";
    const rxKey = isLeftNode ? "Right" : "Left";
    const halfHeight = this.getNodePosition(node, "height", 0) / 2 || Infinity;
    const isTopOrBottomChild = isTopChild || isBottomChild;
    const width = this.getHorizontalLineWidth();
    return (
      <Fragment>
        <div
          className={cx(
            c(
              "horizontal-line",
              isLeftNode ? "horizontal-line-right" : "horizontal-line-left"
            ),
            isVirtualNode && "dashed-line",
            isBottomChild
              ? "bottom-line"
              : isTopChild
              ? "top-line"
              : "middle-line"
          )}
          style={{
            height: isTopOrBottomChild
              ? Math.min(this.getTopBottomToParentDistance(node), halfHeight) // + cardHeightSpan)
              : 0,
            width,
            [rxKey.toLowerCase()]: -width,
            [ryKey.toLowerCase()]: isBottomChild ? "50%" : halfHeight,
            [`border${ryKey}${rxKey}Radius`]: isTopOrBottomChild
              ? topBottomLineRadius
              : undefined,
          }}
        ></div>
        {this.renderMask({
          isLeftNode,
          isTopChild,
          isBottomChild,
          width,
          height:
            halfHeight +
            Math.min(halfHeight, topBottomLineRadius) +
            treeTopSpan,
          offsetY: treeTopSpan,
        })}
      </Fragment>
    );
  }

  /**
   * 渲染上下边界横线 蒙层 避免切换时 视觉上线条有溢出感觉
   */
  renderMask({
    isLeftNode,
    isTopChild,
    isBottomChild,
    width,
    height,
    offsetY,
  }: {
    isLeftNode: boolean;
    isTopChild: boolean;
    isBottomChild: boolean;
    width: number;
    height: number;
    offsetY: number;
  }) {
    if (!isTopChild && !isBottomChild) {
      return null;
    }
    const yKey = isTopChild ? "top" : "bottom";
    const xKey = isLeftNode ? "right" : "left";
    return (
      <div
        className={c("top-bottom-line-mask")}
        style={{
          width,
          height,
          [xKey]: -width,
          [yKey]: -offsetY,
          backgroundColor: this.props.layoutBgColor,
        }}
      ></div>
    );
  }

  render() {
    const { className, renderToolbar, toolbarProps } = this.props;
    // console.log('---main render---');
    return (
      <div ref={this.containerRef} className={cx(c("container"), className)}>
        {this.renderTreeGroup()}
        <MultiTreeToolbar<T>
          renderToolbar={renderToolbar}
          treeRef={this}
          {...toolbarProps}
        />
      </div>
    );
  }
}
/**
 * 默认属性配置
 */
MultiTree.defaultProps = getDefaultProps();
