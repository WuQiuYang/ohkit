import React from 'react';
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import {addEventListener, addClass} from '@ohkit/dom-helper';
// import {throttle} from 'lodash-es';

import './style.scss';

export const c = p("ohkit-draggable-box__");

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
}

interface DraggableBoxState {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

const ValidPlacement = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export class DraggableBox extends React.Component<DraggableBoxProps, DraggableBoxState> {
    static defaultProps: Partial<DraggableBoxProps> = {
        zIndex: 9999,
        offsetX: 20,
        offsetY: 20,
        placement: 'bottom-right',
        disabled: false,
        lockAxis: 'none',
    };

    constructor(props: DraggableBoxProps) {
        super(props);
        
        const { placement = 'bottom-right', offsetY = 20, offsetX = 20 } = props;
        const [placementY, placementX] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
        
        // 简化状态初始化
        this.state = {};
        
        if (placementY === 'top') {
            this.state.top = offsetY;
        } else {
            this.state.bottom = offsetY;
        }
        
        if (placementX === 'left') {
            this.state.left = offsetX;
        } else {
            this.state.right = offsetX;
        }
    }

    getOtherYKey(yKey: 'top' | 'bottom') {
        return yKey === 'top' ? 'bottom' : 'top';
    }

    getOtherXKey(xKey: 'left' | 'right') {
        return xKey === 'left' ? 'right' : 'left';
    }

    // TODO:
    updatePosition(yKey: 'top' | 'bottom', xKey: 'left' | 'right') {
        const oYKey = this.getOtherYKey(yKey);
        const oXKey = this.getOtherXKey(xKey);
        this.setState({
            [oYKey]: this.dragPositionRang.height - (this.state[yKey] || 0),
            [oXKey]: this.dragPositionRang.width - (this.state[xKey] || 0),
        });
    }

    get windowSize() {
        // 排除浏览器滚动条宽度
        const {clientHeight, clientWidth} = document.documentElement || document.body;
        return {
            height: clientHeight,
            width: clientWidth
        };
    }

    get dragBoxSize() {
        let width = 0;
        let height = 0;
        if (this.draggerRef) {
            width = this.draggerRef.offsetWidth;
            height = this.draggerRef.offsetHeight;
        }
        return {
            height,
            width
        };
    }

    get dragPositionBoundaries() {
        const { boundsX, boundsY, placement = 'bottom-right' } = this.props;
        const dragSize = this.dragBoxSize;
        const windowSize = this.windowSize;
        const [placementY, placementX] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
        
        // 初始化边界
        let minX = 0;
        let maxX = windowSize.width - dragSize.width;
        let minY = 0;
        let maxY = windowSize.height - dragSize.height;

        // 处理X轴边界
        if (boundsX) {
            const [minBound, maxBound] = boundsX;
            
            if (placementX === 'left') {
                // 左边位置：boundsX=[左边最小距离, 左边最大距离]
                if (minBound !== undefined) minX = Math.max(minX, minBound);
                if (maxBound !== undefined) maxX = Math.min(maxX, maxBound);
            } else {
                // 右边位置：boundsX=[右边最小距离, 右边最大距离]
                // 直接使用边界值作为right的限制
                if (minBound !== undefined) minX = Math.max(minX, windowSize.width - maxBound - dragSize.width);
                if (maxBound !== undefined) maxX = Math.min(maxX, windowSize.width - minBound - dragSize.width);
                
                // 确保最小边界不大于最大边界
                if (minX > maxX) {
                    [minX, maxX] = [maxX, minX];
                }
            }
        }

        // 处理Y轴边界
        if (boundsY) {
            const [minBound, maxBound] = boundsY;
            
            if (placementY === 'top') {
                // 顶部位置：boundsY=[顶边最小距离, 顶边最大距离]
                if (minBound !== undefined) minY = Math.max(minY, minBound);
                if (maxBound !== undefined) maxY = Math.min(maxY, maxBound);
            } else {
                // 底部位置：boundsY=[底边最小距离, 底边最大距离]
                // 直接使用边界值作为bottom的限制
                if (minBound !== undefined) minY = Math.max(minY, windowSize.height - maxBound - dragSize.height);
                if (maxBound !== undefined) maxY = Math.min(maxY, windowSize.height - minBound - dragSize.height);
                
                // 确保最小边界不大于最大边界
                if (minY > maxY) {
                    [minY, maxY] = [maxY, minY];
                }
            }
        }

        return { minX, maxX, minY, maxY };
    }
    
    // 保持向后兼容
    get dragPositionRang() {
        const { maxX, maxY } = this.dragPositionBoundaries;
        return { width: maxX, height: maxY };
    }

    get curPositionKey() {
        let {placement} = this.props;
        if (!placement || !ValidPlacement.includes(placement)) {
            placement = 'bottom-right';
        }
        return placement.split('-') as ['top' | 'bottom', 'left' | 'right']; // [y, x]
    }

    get position() {
        const [y, x] = this.curPositionKey;
        const positionStyles: Record<string, string> = {};
        
        // 确保位置值存在且是有效的数字
        if (this.state[y] !== undefined) {
            positionStyles[y] = `${this.state[y]}px`;
        }
        if (this.state[x] !== undefined) {
            positionStyles[x] = `${this.state[x]}px`;
        }
        
        return positionStyles;
    }

    draggerRef: HTMLDivElement | null = null;

    isDragging = false;

    axisX?: number;
    axisY?: number;
    dX = 0;
    dY = 0;
    startTop = 0;
    startLeft = 0;

    __moveDisposer?: () => void;
    __clickDisposer?: () => void;
    __bodyClassDisposer?: () => void;
    __upDisposer?: () => void;
    __resizeDisposer?: () => void;

    reportStartPosition() {
        // this.startTop = this.draggerRef?.offsetTop;
        // this.startLeft = this.draggerRef?.offsetLeft;
        if (this.draggerRef) {
            const {top, left} = this.draggerRef?.getBoundingClientRect();
            this.startTop = top;
            this.startLeft = left;
        }
        // console.log(this.startTop, this.startLeft, 'startTop startLeft');
    }

    enableDrag = () => {
        this.reportStartPosition();
        this.__moveDisposer?.();
        this.__moveDisposer = addEventListener(document, 'mousemove', (evt: MouseEvent) => {
            // INFO: 移动过程中禁止click事件
            if (!this.__clickDisposer) {
                const moveDistanse = Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
                // INFO: 移动超过5px？？ 确保用户有真实的移动意愿，而不是手抖～～
                if (moveDistanse > 5) {
                    this.__clickDisposer = addEventListener(
                        document,
                        'click',
                        (evt) => {
                            evt.stopPropagation();
                        },
                        true
                    );
                    this.__bodyClassDisposer = addClass(document.body, c('moving')) || undefined;
                }
            }
            this.dragging(evt);
        }, true);

        this.__upDisposer?.();
        this.__upDisposer = addEventListener(
            document,
            'mouseup',
            (evt) => {
                this.endDrag();
                evt.stopPropagation();
                evt.preventDefault();
            },
            true
        );
    };

    startDrag = (evt: React.MouseEvent<HTMLDivElement>) => {
        // 判断鼠标非右击才继续执行
        if (evt.nativeEvent.button === 2) {
            return;
        }
        this.axisX = evt.nativeEvent.pageX;
        this.axisY = evt.nativeEvent.pageY;
        if (!this.props.disabled) {
          this.enableDrag();
        }
    };

    dragging = (evt: MouseEvent) => {
        this.isDragging = true;
        const { lockAxis } = this.props;
        const { minX, maxX, minY, maxY } = this.dragPositionBoundaries;
        
        // 计算原始偏移量
        this.dX = evt.pageX - (this.axisX || 0);
        this.dY = evt.pageY - (this.axisY || 0);
        
        // 应用方向锁定并计算变换值
        let translateX = this.dX;
        let translateY = this.dY;
        
        if (lockAxis === 'x') {
            translateY = 0; // 锁定Y方向
        } else if (lockAxis === 'y') {
            translateX = 0; // 锁定X方向
        }
        
        // 应用边界条件到允许移动的方向
        const potentialLeft = this.startLeft + translateX;
        const potentialTop = this.startTop + translateY;
        
        // X轴边界条件（在允许X轴移动时应用）
        if (lockAxis !== 'y') {
            if (potentialLeft < minX) {
                translateX = minX - this.startLeft;
            } else if (potentialLeft > maxX) {
                translateX = maxX - this.startLeft;
            }
        }
        
        // Y轴边界条件（在允许Y轴移动时应用）
        if (lockAxis !== 'x') {
            if (potentialTop < minY) {
                translateY = minY - this.startTop;
            } else if (potentialTop > maxY) {
                translateY = maxY - this.startTop;
            }
        }
        
        if (this.draggerRef) {
            this.draggerRef.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        evt.stopPropagation();
    };

    endDrag = () => {
        if (this.isDragging) {
            this.calcPosition();
            if (this.draggerRef) {
                this.draggerRef.style.transform = 'translate(0, 0)';
            }
        }

        this.__moveDisposer?.();
        this.__moveDisposer = undefined;
        if (this.__clickDisposer) {
          requestAnimationFrame(() => {
            if (this.__clickDisposer) {
              this.__clickDisposer();
              this.__clickDisposer = undefined;
            }
          });
        }
        this.__upDisposer?.();
        this.__upDisposer = undefined;
        this.__bodyClassDisposer?.();
        this.__bodyClassDisposer = undefined;

        this.isDragging = false;
    };
    calcPosition = () => {
        const { lockAxis } = this.props;
        const { minX, maxX, minY, maxY } = this.dragPositionBoundaries;
        
        // 计算新的位置
        let newTop = this.startTop;
        let newLeft = this.startLeft;
        
        if (lockAxis !== 'y') {
            newLeft += this.dX;
        }
        if (lockAxis !== 'x') {
            newTop += this.dY;
        }
        
        // 应用边界限制
        const realTop = Math.min(Math.max(minY, newTop), maxY);
        const realLeft = Math.min(Math.max(minX, newLeft), maxX);
        const realBottom = this.windowSize.height - realTop - this.dragBoxSize.height;
        const realRight = this.windowSize.width - realLeft - this.dragBoxSize.width;
        if (realTop !== this.state.top || realLeft !== this.state.left || this.state.bottom !== realBottom || this.state.right !== realRight) {
            console.log(minY, maxY, this.startTop, this.dY, newTop, realTop, 'calcPosition y');
            console.log(minX, maxX, this.startLeft, this.dX, newLeft, realLeft, 'calcPosition x');
            this.setState({
                top: realTop,
                left: realLeft,
                bottom: realBottom,
                right: realRight
            });
        }
        this.startTop = realTop;
        this.startLeft = realLeft;
        this.dX = this.dY = 0;
    };
    
    // throttleCalcPosition = throttle(this.calcPosition, 80, {
    //     trailing: false
    // });

    componentDidMount() {
        // 检查初始位置是否在边界范围内，如果不在则修正
        this.reportStartPosition();
        this.calcPosition();
        
        this.__resizeDisposer = addEventListener(window, 'resize', () => {
            this.calcPosition();
        });
    }

    componentWillUnmount() {
        this.__resizeDisposer?.();
        this.__bodyClassDisposer?.();
        this.__moveDisposer?.();
        this.__clickDisposer?.();
        this.__upDisposer?.();
    }

    render() {
        const {className, zIndex, children} = this.props;
        const {startDrag, endDrag} = this;
        const stl = {
            zIndex,
            ...this.position
        };
        return (
            <div
                className={cx(c('container'), className)}
                style={stl}
                ref={(r) => {
                    this.draggerRef = r;
                }}
                onMouseDown={startDrag}
                onMouseUp={endDrag}
            >
                {children}
            </div>
        );
    }
}

export default DraggableBox;