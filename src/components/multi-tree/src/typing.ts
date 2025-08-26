import {MultiTreeToolbarProps} from "./toolbar";

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

export type Direction = "left" | "right" | "center";

export interface Position {
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
  /**
   * 线色
   * @default #4c84ff
   */
  lineColor?: React.CSSProperties['color'];
  /**
   * 线宽
   * @default 2
   */
  lineSize?: number;
  /**
   * 顶部和底部线条圆角
   * @default 12
   */
  topBottomLineRadius?: number;
  /**
   * 展开/折叠按钮大小
   * @default 26
   */
  toggleBtnSize?: number;
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
  renderToolbar?: MultiTreeToolbarProps['renderToolbar'];
  /** 工具栏属性 */
  toolbarProps?: Omit<MultiTreeToolbarProps<T>, 'treeRef'>;
}

export interface NodeWithTop<T> {
  maxTop?: number;
  node?: T;
}