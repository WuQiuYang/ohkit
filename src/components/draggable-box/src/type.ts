import type {ValidPlacement} from './constants';

export interface IPositionChange {
  left: number;
  top: number;
  right: number;
  bottom: number;
  diffX: number;
  diffY: number;
}

export interface DraggableBoxProps {
  className?: string;
  children?: React.ReactNode;
  /**
   * z-index 层级
   * @default 9999
   */
  zIndex?: number;
  /**
   * 初始位置 横向偏移量
   * @default 20
   */
  offsetX?: number;
  /**
   * 初始位置 纵向偏移量
   * @default 20
   */
  offsetY?: number;
  /**
   * 是否禁用拖拽
   * @default false
   */
  disabled?: boolean;
  /**
   * 拖拽位置，可选值：'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
   * @default 'bottom-right'
   */
  placement?: typeof ValidPlacement[number]; // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /**
   * 锁定拖拽方向
   * 'none' - 自由拖拽 (默认)
   * 'x' - 只允许水平方向拖拽
   * 'y' - 只允许垂直方向拖拽
   * @default 'none'
   */
  lockAxis?: 'none' | 'x' | 'y';
  /**
   * X轴相对边界 [min, max] - 基于placement的相对距离范围
   * 比如：placement='top-left'时，boundsX=[左边最小距离, 左边最大距离]
   */
  boundsX?: [number?, number?];
  /**
   * Y轴相对边界 [min, max] - 基于placement的相对距离范围
   * 比如：placement='top-left'时，boundsY=[顶边最小距离, 顶边最大距离]
   */
  boundsY?: [number?, number?];
  /**
   * 是否在拖拽过程中展示拖拽区域可视化
   * @default false
   */
  showDragArea?: boolean;
  /**
   * 拖拽过程中，超出多少px时才显示拖拽区域可视化
   * @default 5
   */
  showDragAreaOverMoveDistanse?: number;
  /**
   * 定位模式
   * 'fixed' - 使用 fixed 定位（默认），动态查找影响 fixed 定位的父元素
   * 'absolute' - 使用 absolute 定位，基于最近的定位父元素
   * @default 'fixed'
   */
  positionMode?: 'fixed' | 'absolute';
  /**
   * 拖拽开始回调函数
   */
  onDragStart?: (positionChange: IPositionChange) => void;
  /**
   * 拖拽中回调函数
   */
  onDrag?: (positionChange: IPositionChange) => void;
  /**
   * 拖拽结束回调函数
   */
  onDragEnd?: (positionChange: IPositionChange) => void;
}

export interface DraggableBoxState {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}