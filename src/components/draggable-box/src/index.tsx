import React from 'react';
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import {addEventListener, addClass} from '@ohkit/dom-helper';
import {findFixedPositionParent, findAbsolutePositionParent, getScaleRatio, clamp, supportsTouchEvents} from './utils';
import {ValidPlacement} from './constants';
import {DraggableBoxProps, DraggableBoxState} from './type';

import './style.scss';

export * from './utils';
export * from './type';
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
        showDragAreaOverMoveDistanse: 5,
        positionMode: 'fixed',
    };

    constructor(props: DraggableBoxProps) {
        super(props);
        const { offsetX, offsetY } = this.props;
        this.state = this.formatState({offsetX, offsetY});
    }

    private formatState({offsetX = DraggableBox.defaultProps.offsetX, offsetY = DraggableBox.defaultProps.offsetY} = {}) {
        const { placement = 'bottom-right' } = this.props;
        const [placementY, placementX] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
        const newState = {
            top: placementY === 'top' ? offsetY : undefined,
            bottom: placementY === 'bottom' ? offsetY : undefined,
            left: placementX === 'left' ? offsetX : undefined,
            right: placementX === 'right' ? offsetX : undefined,
        }
        return newState;
    }

    private prePositionMode: DraggableBoxProps['positionMode'];
    private preDraggerRef: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    /**
     * 获取定位容器
     * 根据 positionMode 返回对应的定位父元素
     */
    private getContainer(useCache = true) {
        const { positionMode = 'fixed' } = this.props;
        if (!this.container || !useCache || this.prePositionMode !== positionMode || this.preDraggerRef !== this.draggerRef) {
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
        const container = this.getContainer(false);
        if (!container) {
            return {
                width: document.documentElement.clientWidth, // window.innerWidth, 避免滚动条影响计算
                height: document.documentElement.clientHeight, // window.innerHeight, 避免滚动条影响计算
                left: 0,
                top: 0,
                scrollLeft: 0,
                scrollTop: 0,
                scrollerScrollLeft: 0,
                scrollerScrollTop: 0,
                borderLeftWidth: 0,
                borderTopWidth: 0
            };
        }
        const containerRect = container.getBoundingClientRect();
        
        // 获取容器的border宽度(仅 top, left 对坐标计算有影响)
        const containerStyle = window.getComputedStyle(container);
        const borderLeftWidth = parseFloat(containerStyle.borderLeftWidth) || 0;
        const borderTopWidth = parseFloat(containerStyle.borderTopWidth) || 0;
        const borderRightWidth = parseFloat(containerStyle.borderRightWidth) || 0;
        const borderBottomWidth = parseFloat(containerStyle.borderBottomWidth) || 0;
        const yScrollerWidth = container.offsetWidth - container.clientWidth - borderLeftWidth - borderRightWidth;
        const xScrollerHeight = container.offsetHeight - container.clientHeight - borderTopWidth - borderBottomWidth;
        // console.log('yScrollerWidth, xScrollerHeight', yScrollerWidth, xScrollerHeight);

        return {
            width: containerRect.width / this.cachedScaleX - borderLeftWidth - borderRightWidth - yScrollerWidth,
            height: containerRect.height / this.cachedScaleY - borderTopWidth - borderBottomWidth - xScrollerHeight,
            left: containerRect.left / this.cachedScaleX,
            top: containerRect.top / this.cachedScaleY,
            scrollLeft: container.scrollLeft,
            scrollTop: container.scrollTop,
            borderLeftWidth: borderLeftWidth,
            borderTopWidth: borderTopWidth,
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
        const {width: containerWidth, height: containerHeight} = this.getContainerRect();
        const [placementY, placementX] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];
        
        const defaultBounds = {
            minX: 0,
            maxX: Math.max(containerWidth - dragSize.width, 0),
            minY: 0,
            maxY: Math.max(containerHeight- dragSize.height, 0),
        };
        // 初始化边界
        let {minX, maxX, minY, maxY} = defaultBounds

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
                    minX = Math.max(minX, containerWidth - maxBound - dragSize.width);
                    maxX = Math.min(maxX, containerWidth - minBound - dragSize.width);
                } else if (minBound !== undefined) {
                    // 只有minBound：设置最大边界，最小边界保持默认
                    maxX = Math.min(maxX, containerWidth - minBound - dragSize.width);
                } else if (maxBound !== undefined) {
                    // 只有maxBound：设置最小边界，最大边界保持默认
                    minX = Math.max(minX, containerWidth - maxBound - dragSize.width);
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
                    minY = Math.max(minY, containerHeight - maxBound - dragSize.height);
                    maxY = Math.min(maxY, containerHeight - minBound - dragSize.height);
                } else if (minBound !== undefined) {
                    // 只有minBound：设置最大边界，最小边界保持默认
                    maxY = Math.min(maxY, containerHeight - minBound - dragSize.height);
                } else if (maxBound !== undefined) {
                    // 只有maxBound：设置最小边界，最大边界保持默认
                    minY = Math.max(minY, containerHeight - maxBound - dragSize.height);
                }
            }
        }
        // 确保各个边界值在默认范围内
        minX = clamp(minX, defaultBounds.minX, defaultBounds.maxX);
        maxX = clamp(maxX, minX, defaultBounds.maxX);
        minY = clamp(minY, defaultBounds.minY, defaultBounds.maxY);
        maxY = clamp(maxY, minY, defaultBounds.maxY);

        return { minX, maxX, minY, maxY };
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
    startBottom = 0;
    startRight = 0;
    translateX = 0;
    translateY = 0;

    // 缓存缩放比例，避免在 dragging 中频繁计算
    cachedScaleX = 1;
    cachedScaleY = 1;

    private __moveDisposer?: () => void;
    private __clickDisposer?: () => void;
    private __bodyClassDisposer?: () => void;
    private __upDisposer?: () => void;
    private __resizeDisposer?: () => void;
    private __preventScrollDisposer?: () => void;

    dragAreaRef: HTMLDivElement | null = null;

    private reportStartPosition() {
        if (this.draggerRef) {
            // 获取缩放比例
            const { scaleX, scaleY } = getScaleRatio(this.getContainer());
            this.cachedScaleX = scaleX;
            this.cachedScaleY = scaleY;
            const { top, left } = this.draggerRef.getBoundingClientRect();
            const containerRect = this.getContainerRect();
            // console.log(containerRect, 'containerRect');
            
            // 计算相对于容器的位置，并除以缩放比例得到未缩放的坐标
            this.startTop = top / scaleY - containerRect.top + containerRect.scrollTop - containerRect.borderTopWidth;
            this.startLeft = left / scaleY - containerRect.left + containerRect.scrollLeft - containerRect.borderLeftWidth;
            this.startBottom = containerRect.height - this.startTop - this.dragBoxSize.height;
            this.startRight = containerRect.width - this.startLeft - this.dragBoxSize.width;
        }
    }

    enableDrag = (isTouch = false) => {
        this.reportStartPosition();
        this.__moveDisposer?.();
        this.__moveDisposer = addEventListener(isTouch && this.draggerRef ? this.draggerRef : document, isTouch ? 'touchmove' : 'mousemove', (evt) => {
            evt.stopPropagation();
            if (isTouch) {
                evt.preventDefault();
            }
            // INFO: 移动过程中禁止click事件
            if (!this.__clickDisposer) {
                const moveDistanse = Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
                // INFO: 移动超过px？？ 确保用户有真实的移动意愿，而不是手抖～～
                if (moveDistanse > (this.props.showDragAreaOverMoveDistanse || 5)) {
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
            // 调用拖拽开始回调
            if (!this.isDragging && this.props.onDragStart) {
                const positionChange = {
                    top: this.startTop,
                    left: this.startLeft,
                    bottom: this.startBottom,
                    right: this.startRight,
                    diffX: 0,
                    diffY: 0
                };
                this.props.onDragStart(positionChange);
            }
            this.dragging(evt as TouchEvent | MouseEvent);
        }, {
            passive: !isTouch
        });

        this.__upDisposer?.();
        this.__upDisposer = addEventListener(
            document,
            'mouseup',
            () => {
                this.endDrag();
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

    dragging = (evt: MouseEvent | TouchEvent) => {
        this.isDragging = true;
        const { lockAxis } = this.props;
        const { minX, maxX, minY, maxY } = this.dragPositionBoundaries;
        
        // 使用缓存的缩放比例，避免频繁计算
        const scaleX = this.cachedScaleX;
        const scaleY = this.cachedScaleY;
        
        // 获取坐标
        let pageX: number, pageY: number;
        if (evt instanceof TouchEvent) {
            const touch = evt.touches[0];
            if (!touch) return;
            pageX = touch.pageX;
            pageY = touch.pageY;
        } else {
            pageX = evt.pageX;
            pageY = evt.pageY;
        }
        
        // 计算原始偏移量（需要除以缩放比例）
        this.dX = (pageX - (this.axisX || 0)) / scaleX;
        this.dY = (pageY - (this.axisY || 0)) / scaleY;
        
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
        if (this.translateX === translateX && this.translateY === translateY) {
            return;
        }

        // 调用拖拽中回调
        if (this.props.onDrag) {
            const positionChange = {
                top: this.startTop + translateY,
                left: this.startLeft + translateX,
                bottom: this.startBottom - translateY,
                right: this.startRight - translateX,
                diffX: translateX,
                diffY: translateY
            };
            this.props.onDrag(positionChange);
        }
        
        if (this.draggerRef) {
            this.draggerRef.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        this.translateX = translateX;
        this.translateY = translateY;
    };

    startTouchDrag = (evt: React.TouchEvent<HTMLDivElement>) => {
        const touch = evt.touches[0];
        if (!touch) return;
        this.axisX = touch.pageX;
        this.axisY = touch.pageY;
        if (!this.props.disabled) {
            this.enableDrag(true);
        }
    };

    endDrag = () => {
        if (this.isDragging) {
            const positionChange = this.calcPosition();
            // 调用拖拽结束回调
            this.props.onDragEnd?.(positionChange);
            if (this.draggerRef) {
                this.draggerRef.style.transform = '';
            }
            
            // 隐藏拖拽区域
            if (this.props.showDragArea) {
                this.hideDragArea();
            }
        }

        if (this.__moveDisposer) {
            this.__moveDisposer();
            this.__moveDisposer = undefined;
        }
        if (this.__clickDisposer) {
          requestAnimationFrame(() => {
            if (this.__clickDisposer) {
              this.__clickDisposer();
              this.__clickDisposer = undefined;
            }
          });
        }
        if (this.__upDisposer) {
            this.__upDisposer();
            this.__upDisposer = undefined;
        }
        if (this.__bodyClassDisposer) {
            this.__bodyClassDisposer();
            this.__bodyClassDisposer = undefined;
        }

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
        const {height, width} = this.getContainerRect();
        
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
        const realTop = clamp(newTop, minY, maxY);
        const realLeft = clamp(newLeft, minX, maxX);
        const realBottom = height - realTop - this.dragBoxSize.height;
        const realRight = width - realLeft - this.dragBoxSize.width;
        if (realTop !== this.state.top || realLeft !== this.state.left || this.state.bottom !== realBottom || this.state.right !== realRight) {
            this.setState({
                top: realTop,
                left: realLeft,
                bottom: realBottom,
                right: realRight
            });
        }
        const positionChange = {
            top: realTop,
            left: realLeft,
            bottom: realBottom,
            right: realRight,
            diffX: realLeft - this.startLeft,
            diffY: realTop - this.startTop
        };
        this.startTop = realTop;
        this.startLeft = realLeft;
        this.startBottom = realBottom;
        this.startRight = realRight;
        this.dX = this.dY = 0;
        return positionChange;
    };

    // 更新状态并计算位置 (外部可以调用)
    updateState = ({offsetX, offsetY}: Pick<DraggableBoxProps, 'offsetX' | 'offsetY'> = {}) => {
        this.setState(this.formatState({offsetX, offsetY}), () => {
            this.reportStartPosition();
            this.calcPosition();
        });
    }

    componentDidMount() {
        // 检查初始位置是否在边界范围内，如果不在则修正
        this.reportStartPosition();
        this.calcPosition();
        
        this.__resizeDisposer = addEventListener(window, 'resize', () => {
            this.calcPosition();
        });

        // 触屏设备时，阻止拖拽时滚动页面
        if (supportsTouchEvents() && this.draggerRef) {
            this.__preventScrollDisposer = addEventListener(this.draggerRef, 'touchmove', (evt) => {
                evt.preventDefault();
            });
        }
    }

    componentWillUnmount() {
        this.__resizeDisposer?.();
        this.__bodyClassDisposer?.();
        this.__moveDisposer?.();
        this.__clickDisposer?.();
        this.__upDisposer?.();
        this.__preventScrollDisposer?.();
    }

    render() {
        const { className, zIndex, children, showDragArea, positionMode = 'fixed' } = this.props;
        const { startDrag, startTouchDrag, endDrag } = this;
        const stl = {
            zIndex,
            ...this.position,
            position: positionMode
        };
        return (
            <React.Fragment>
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
                    onMouseDownCapture={startDrag}
                    onMouseUpCapture={endDrag}
                    onTouchStartCapture={startTouchDrag}
                    onTouchEndCapture={endDrag}
                >
                    {children}
                </div>
            </React.Fragment>
        );
    }
}
