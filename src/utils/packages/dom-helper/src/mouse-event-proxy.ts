/**
 * @file mouse-event-proxy
 * @description 鼠标事件代理：由 mouseDown mouseMove mouseUp 等事件合成 onClick, 用于区分用户的鼠标点击行为和拖拽行为
 */

export type IProxyMouseEvent = Pick<
    React.DOMAttributes<HTMLElement>,
    'onMouseDown' | 'onMouseUp' | 'onMouseMove' | 'onClick'
>;

const MOUSE_DOWN_UP_GAP_MS = 300;

export interface IProxyMouseEventOption {
    /**
     * 鼠标按下抬起时间间隔阈值（毫秒），默认300ms
     * @default 300
     */
    mouseDownUpTimeThreshold?: number;
    /**
     * 鼠标按住后移动距离阈值（像素），超过此值视为拖拽，默认2px
     * @default 2
     */
    mouseMovePXThreshold?: number;
}

/**
 * 鼠标事件代理函数，用于区分用户的点击行为和拖拽行为
 * 
 * 通过监听 mouseDown、mouseMove、mouseUp 事件来合成 onClick 事件，
 * 并根据时间间隔和移动距离阈值来判断是否是真正的点击意图
 * 
 * @param {IProxyMouseEvent} handlers - 鼠标事件处理函数集合
 * @param {Function} handlers.onMouseDown - 鼠标按下事件回调
 * @param {Function} handlers.onMouseMove - 鼠标移动事件回调  
 * @param {Function} handlers.onMouseUp - 鼠标抬起事件回调
 * @param {Function} handlers.onClick - 点击事件回调（由事件代理控制触发）
 * @param {IProxyMouseEventOption} options - 配置选项
 * @param {number} options.mouseDownUpTimeThreshold - 鼠标按下抬起时间间隔阈值（毫秒），默认300ms
 * @param {number} options.mouseMovePXThreshold - 鼠标按住后移动距离阈值（像素），超过此值视为拖拽，默认2px
 * @returns {IProxyMouseEvent} 代理后的鼠标事件处理函数集合
 */
export const mouseEventProxy = (
    {onMouseDown, onMouseMove, onMouseUp, onClick}: IProxyMouseEvent,
    {
        mouseDownUpTimeThreshold = MOUSE_DOWN_UP_GAP_MS,
        mouseMovePXThreshold = 2,
    }: IProxyMouseEventOption = {}
): IProxyMouseEvent => {
    const mouseDownPoint = {
        isDown: false, // 鼠标是否按下
        isDragging: false, // 鼠标是否在拖拽中
        isRealClick: false, // 鼠标是否是真正意图的点击事件（非拖拽）
        timestamp: 0, // 鼠标按下时间戳
        coordinate: { // 鼠标按下坐标
            x: 0,
            y: 0,
        }
    };
    return {
        onMouseDown: (e) => {
            mouseDownPoint.isDown = true;
            mouseDownPoint.isRealClick = false;
            mouseDownPoint.isDragging = false;
            mouseDownPoint.timestamp = Date.now();
            mouseDownPoint.coordinate.x = e.pageX;
            mouseDownPoint.coordinate.y = e.pageY;
            return onMouseDown?.(e);
        },
        onMouseMove: (e) => {
            if (mouseDownPoint.isDown && !mouseDownPoint.isDragging) {
                const {pageX, pageY} = e;
                const {x, y} = mouseDownPoint.coordinate;
                const dx = Math.abs(pageX - x);
                const dy = Math.abs(pageY - y);
                if (dx > mouseMovePXThreshold || dy > mouseMovePXThreshold) {
                    mouseDownPoint.isDragging = true;
                }
            }
            return onMouseMove?.(e);
        },
        onMouseUp: (e) => {
            if (mouseDownPoint.isDown) {
                const timeSpan = Date.now() - mouseDownPoint.timestamp;
                // down up 间隔小于阈值，且没有拖拽意图，则认为是真正点击事件
                if (timeSpan < mouseDownUpTimeThreshold && !mouseDownPoint.isDragging) {
                    mouseDownPoint.isRealClick = true;
                }
                // 重置
                mouseDownPoint.isDown = false;
                mouseDownPoint.isDragging = false;
            }
            return onMouseUp?.(e);
        },
        onClick: (e) => {
            // 由 mouseDown mouseMove mouseUp 合成控制 点击事件 是否触发
            if (mouseDownPoint.isRealClick) {
                mouseDownPoint.isRealClick = false;
                console.log('[mouse-event-proxy]: real click');
                return onClick?.(e);
            }
        }
    };
};
