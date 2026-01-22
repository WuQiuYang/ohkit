import React from 'react';
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import {addEventListener, addClass} from '@ohkit/dom-helper';
import {findFixedPositionParent, findAbsolutePositionParent, getScaleRatio} from './utils';
import {ValidPlacement} from './constants';
import {DraggableBoxProps, DraggableBoxState} from './type';

import './style.scss';

export const c = p("ohkit-draggable-box__");
export class DraggableBox extends React.Component<DraggableBoxProps, DraggableBoxState> {
    static defaultProps: Partial<DraggableBoxProps> = {
        zIndex: 9999,
        offsetX: 20,
        offsetY: 20,
        placement: 'bottom-right',
        disabled: false,
        lockAxis: 'none',
        showDragArea: false,
        positionMode: 'fixed',
    };

    constructor(props: DraggableBoxProps) {
        super(props);
        
        const { placement = 'bottom-right', offsetY = 20, offsetX = 20 } = props;
        const [placementY, placementX] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
        
        // 简化状态初始化
        this.state = {
            top: placementY === 'top' ? offsetY : undefined,
            bottom: placementY === 'bottom' ? offsetY : undefined,
            left: placementX === 'left' ? offsetX : undefined,
            right: placementX === 'right' ? offsetX : undefined,
        };
    }

    getOtherYKey(yKey: 'top' | 'bottom') {
        return yKey === 'top' ? 'bottom' : 'top';
    }

    getOtherXKey(xKey: 'left' | 'right') {
        return xKey === 'left' ? 'right' : 'left';
    }

    updatePosition(yKey: 'top' | 'bottom', xKey: 'left' | 'right') {
        const oYKey = this.getOtherYKey(yKey);
        const oXKey = this.getOtherXKey(xKey);
        this.setState({
            [oYKey]: this.dragPositionRang.height - (this.state[yKey] || 0),
            [oXKey]: this.dragPositionRang.width - (this.state[xKey] || 0),
        });
    }

    private prePositionMode: DraggableBoxProps['positionMode'];
    private preDraggerRef: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    /**
     * 获取定位容器
     * 根据 positionMode 返回对应的定位父元素
     */
    private getContainer(useCache = true): HTMLElement {
        const { positionMode = 'fixed' } = this.props;
        if (!useCache || this.prePositionMode !== positionMode || this.preDraggerRef !== this.draggerRef) {
            this.prePositionMode = positionMode;
            this.preDraggerRef = this.draggerRef;
            this.container = positionMode === 'fixed' 
                ? findFixedPositionParent(this.draggerRef) 
                : findAbsolutePositionParent(this.draggerRef);
        }
        return this.container;
    }

    /**
     * 获取容器的尺寸和位置信息
     */
    private getContainerRect() {
        const { positionMode = 'fixed' } = this.props;
        const isFixed = positionMode === 'fixed';
        const container = this.getContainer(false);
        const containerRect = container.getBoundingClientRect();
        const rootScrollingElement = window.document.scrollingElement || window.document.body;
        const isRoot = container === window.document.body || container === window.document.documentElement;
        return {
            width: containerRect.width,
            height: containerRect.height,
            left: isFixed && isRoot ? Math.max(containerRect.left, 0) : containerRect.left + rootScrollingElement.scrollLeft,
            top: isFixed && isRoot ? Math.max(containerRect.top, 0) : containerRect.top + rootScrollingElement.scrollTop,
            scrollLeft: isFixed && isRoot ? 0 : container.scrollLeft, // container.scrollLeft,
            scrollTop: isFixed && isRoot ? 0 : container.scrollTop, // container.scrollTop
            scrollerScrollLeft: isFixed && isRoot ? 0 : rootScrollingElement.scrollLeft,
            scrollerScrollTop: isFixed && isRoot ? 0 : rootScrollingElement.scrollTop
        };
    }

    get windowSize() {
        const container = this.getContainer();
        const { clientWidth, clientHeight } = container;
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
                if (minBound !== undefined && maxBound !== undefined) {
                    minX = Math.max(minX, windowSize.width - maxBound - dragSize.width);
                    maxX = Math.min(maxX, windowSize.width - minBound - dragSize.width);
                } else if (minBound !== undefined) {
                    // 只有minBound：设置最大边界，最小边界保持默认
                    maxX = Math.min(maxX, windowSize.width - minBound - dragSize.width);
                } else if (maxBound !== undefined) {
                    // 只有maxBound：设置最小边界，最大边界保持默认
                    minX = Math.max(minX, windowSize.width - maxBound - dragSize.width);
                }
                
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
                if (minBound !== undefined && maxBound !== undefined) {
                    minY = Math.max(minY, windowSize.height - maxBound - dragSize.height);
                    maxY = Math.min(maxY, windowSize.height - minBound - dragSize.height);
                } else if (minBound !== undefined) {
                    // 只有minBound：设置最大边界，最小边界保持默认
                    maxY = Math.min(maxY, windowSize.height - minBound - dragSize.height);
                } else if (maxBound !== undefined) {
                    // 只有maxBound：设置最小边界，最大边界保持默认
                    minY = Math.max(minY, windowSize.height - maxBound - dragSize.height);
                }
                
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

    // 缓存缩放比例，避免在 dragging 中频繁计算
    cachedScaleX = 1;
    cachedScaleY = 1;

    __moveDisposer?: () => void;
    __clickDisposer?: () => void;
    __bodyClassDisposer?: () => void;
    __upDisposer?: () => void;
    __resizeDisposer?: () => void;

    dragAreaRef: HTMLDivElement | null = null;

    reportStartPosition() {
        if (this.draggerRef) {
            const { top, left } = this.draggerRef.getBoundingClientRect();
            const containerRect = this.getContainerRect();
            // console.log(containerRect, 'containerRect');
            
            // 获取缩放比例
            const { scaleX, scaleY } = getScaleRatio(this.draggerRef);
            this.cachedScaleX = scaleX;
            this.cachedScaleY = scaleY;
            
            // 计算相对于容器的位置，并除以缩放比例得到未缩放的坐标
            this.startTop = (top - containerRect.top + containerRect.scrollerScrollTop) / scaleY + containerRect.scrollTop;
            this.startLeft = (left - containerRect.left + containerRect.scrollerScrollLeft) / scaleX + containerRect.scrollLeft;
        }
    }

    enableDrag = () => {
        this.reportStartPosition();
        this.__moveDisposer?.();
        this.__moveDisposer = addEventListener(document, 'mousemove', (evt) => {
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
                    this.__bodyClassDisposer = addClass([document.body, this.draggerRef], c('moving')) || undefined;
                    
                    // 显示拖拽区域
                    if (this.props.showDragArea && this.dragAreaRef) {
                        this.showDragArea();
                    }
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
        
        // 使用缓存的缩放比例，避免频繁计算
        const scaleX = this.cachedScaleX;
        const scaleY = this.cachedScaleY;
        
        // 计算原始偏移量（需要除以缩放比例）
        this.dX = (evt.pageX - (this.axisX || 0)) / scaleX;
        this.dY = (evt.pageY - (this.axisY || 0)) / scaleY;
        
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
                this.draggerRef.style.transform = '';
            }
            
            // 隐藏拖拽区域
            if (this.props.showDragArea) {
                this.hideDragArea();
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

    showDragArea = () => {
        if (!this.props.showDragArea || !this.dragAreaRef) return;
        
        const { lockAxis } = this.props;
        const { minX, maxX, minY, maxY } = this.dragPositionBoundaries;
        const dragSize = this.dragBoxSize;
        
        // 重置样式
            this.dragAreaRef.style.border = '1px dashed var(--ohkit-color-primary, #1890ff)';
            this.dragAreaRef.style.backgroundColor = 'rgba(173, 216, 230, 0.2)'; // 淡透蓝色
        
        if (lockAxis === 'x') {
            // 锁定Y方向，显示为水平虚线区域
            this.dragAreaRef.style.width = `${maxX - minX + dragSize.width}px`;
            this.dragAreaRef.style.height = '2px'; // 更细的虚线高度
            this.dragAreaRef.style.left = `${minX}px`;
            this.dragAreaRef.style.top = `${this.startTop + dragSize.height / 2}px`;
        } else if (lockAxis === 'y') {
            // 锁定X方向，显示为垂直虚线区域
            this.dragAreaRef.style.width = '2px'; // 更细的虚线宽度
            this.dragAreaRef.style.height = `${maxY - minY + dragSize.height}px`;
            this.dragAreaRef.style.left = `${this.startLeft + dragSize.width / 2}px`;
            this.dragAreaRef.style.top = `${minY}px`;
        } else {
            // 自由拖拽，显示完整区域
            this.dragAreaRef.style.width = `${maxX - minX + dragSize.width}px`;
            this.dragAreaRef.style.height = `${maxY - minY + dragSize.height}px`;
            this.dragAreaRef.style.left = `${minX}px`;
            this.dragAreaRef.style.top = `${minY}px`;
        }
        
        this.dragAreaRef.style.display = 'block';
    };

    hideDragArea = () => {
        if (this.dragAreaRef) {
            this.dragAreaRef.style.display = 'none';
        }
    };
    calcPosition = () => {
        const { lockAxis } = this.props;
        const { minX, maxX, minY, maxY } = this.dragPositionBoundaries;
        const containerSize = this.windowSize;
        
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
        const realBottom = containerSize.height - realTop - this.dragBoxSize.height;
        const realRight = containerSize.width - realLeft - this.dragBoxSize.width;
        if (realTop !== this.state.top || realLeft !== this.state.left || this.state.bottom !== realBottom || this.state.right !== realRight) {
            // console.log(minY, maxY, this.startTop, this.dY, newTop, realTop, 'calcPosition y');
            // console.log(minX, maxX, this.startLeft, this.dX, newLeft, realLeft, 'calcPosition x');
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
        const { className, zIndex, children, showDragArea, positionMode = 'fixed' } = this.props;
        const { startDrag, endDrag } = this;
        const stl = {
            zIndex,
            ...this.position,
            position: positionMode
        };
        return (
            <>
                {showDragArea && (
                    <div
                        className={c('drag-area')}
                        ref={(r) => {
                            this.dragAreaRef = r;
                        }}
                        style={{
                            display: 'none',
                            position: positionMode,
                            backgroundColor: 'rgba(173, 216, 230, 0.2)', // 淡透蓝色
                            border: '1px dashed var(--ohkit-color-primary, #1890ff)',
                            pointerEvents: 'none',
                            zIndex: (zIndex || 9999) - 1,
                            boxSizing: 'border-box',
                            borderRadius: this.props.lockAxis !== 'none' ? '2px' : '0',
                        }}
                    />
                )}
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
            </>
        );
    }
}

export default DraggableBox;