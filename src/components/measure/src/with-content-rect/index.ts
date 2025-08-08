import React, {Component, createElement} from 'react';
import {
    pick,
    throttle,
    isEqualWith
} from 'lodash-es';
import ResizeObserver from 'resize-observer-polyfill';
import {getContentRect, IGetContentRectOptions, IContentRect} from '../utils';

/**
 * 为指定的 DOM 元素添加一个事件监听器，并返回一个用于移除该监听器的函数。TODO: 可抽为 utils 工具函数
 *
 * @param target 需要添加事件监听器的 DOM 元素。
 * @param type 要监听的事件类型，例如 'click'、'mouseover' 等。
 * @param listener 当事件发生时需要调用的函数或对象。
 * @param options 可选。一个布尔值，指定是否在捕获阶段调用事件处理函数（true）或者是否在冒泡阶段调用（false）。
 * 或者是一个 AddEventListenerOptions 对象，用于指定事件监听器的选项。
 * @returns 一个函数，调用该函数可以移除添加的事件监听器。
 */
function addEvent(
    target: HTMLElement | Document | null | undefined,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
) {
    if (!target) {
        return () => {};
    }
    target.addEventListener(type, listener, options);
    return () => {
        target.removeEventListener(type, listener, options);
    };
}

/**
 * 查找包含给定元素的滚动容器。TODO: 可抽为 utils 工具函数
 *
 * @param element 需要查找滚动容器的元素。
 * @param options 可选参数，指定是否包括元素自身作为滚动容器。
 * @returns 返回包含给定元素的滚动容器，如果找不到则返回 document。
 */
function findScrollContainer(element: HTMLElement, {includeSelf = false} = {}) {
    if (!element) {
        return undefined;
    }

    let parent: HTMLElement | null = includeSelf ? element : element.parentElement;
    while (parent) {
        const {overflow} = window.getComputedStyle(parent);
        if (overflow.split(' ').every(o => o === 'auto' || o === 'scroll')) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return document;
};

export interface WithContentRectProps extends IGetContentRectOptions {
    innerRef?: {current: HTMLElement | null} | ((instance: HTMLElement | null) => void);
    /**
     * 当观测的内容尺寸发生变化时，会触发此回调函数。
     */
    onResize?: (contentRect: IContentRect) => void;
    /**
     * throttleMs ms 内只触发一次 resize 事件，防止高频触发 resize 事件导致性能问题
     * @default 200
     */
    throttleMs?: number;
}

export interface InjectMeasureProps {
    measureRef: React.RefCallback<HTMLElement>;
    measure: (entries?: ResizeObserverEntry[]) => void;
    contentRect: ValuePartial<IContentRect>;
}

interface IWrappedComponentProps extends WithContentRectProps, InjectMeasureProps {
}

type ValuePartial<T> = {
    [P in keyof T]: Partial<T[P]>;
};

type TyWrappedComponent = React.FunctionComponent<IWrappedComponentProps> | React.ComponentClass<IWrappedComponentProps>;

/**
 * 封装一个高阶组件，用于获取并更新组件内容区域的尺寸信息。
 *
 * @param types 可选的 IGetContentRectOptions 参数，用于自定义获取内容尺寸的行为。
 * @returns 返回一个新的高阶组件，该组件会注入内容区域的尺寸信息。
 */
export function withContentRect(types?: IGetContentRectOptions) {
    return (WrappedComponent: TyWrappedComponent) => class WithContentRect extends Component<WithContentRectProps, {contentRect: ValuePartial<IContentRect>}> {

        static defaultProps: Partial<WithContentRectProps> = {
            throttleMs: 200
        };

        state = {
            contentRect: {
                entry: {},
                client: {},
                offset: {},
                scroll: {},
                bounds: {},
                position: {},
                margin: {}
            }
        };

        _animationFrameID: number | null = null;
        _removeScrollEvent: (() => void) | null = null;

        _resizeObserver: ResizeObserver | null = null;

        _node: HTMLElement | null = null;

        componentDidMount() {
            this._resizeObserver = new ResizeObserver(this.measure);
            if (this._node !== null) {
                this._resizeObserver.observe(this._node);

                if (typeof this.props.onResize === 'function') {
                    this.props.onResize(getContentRect(this._node, types || this.props));
                }
            }
        }

        componentWillUnmount() {
            if (this._resizeObserver !== null) {
                this._resizeObserver.disconnect();
                this._resizeObserver = null;
            }

            this._removeScrollEvent && this._removeScrollEvent();
            this._animationFrameID && window.cancelAnimationFrame(this._animationFrameID);
        }

        measure = throttle((entries?: ResizeObserverEntry[]) => {
            if (!this._node) {
                return;
            }

            const contentRect = getContentRect(this._node, types || this.props);

            if (entries) {
                contentRect.entry = entries[0].contentRect;
                // DOMRectReadOnly.toJSON 在 safari 不能调用
                contentRect.entry = pick(contentRect.entry, [
                    'top',
                    'bottom',
                    'left',
                    'right',
                    'width',
                    'height',
                    'x',
                    'y'
                ]) as ResizeObserverEntry['contentRect'];
            }

            this._animationFrameID = window.requestAnimationFrame(() => {
                if (this._resizeObserver !== null) {
                    if (!isEqualWith(this.state.contentRect, contentRect)) {
                        this.setState({
                            contentRect
                        });
                        if (typeof this.props.onResize === 'function') {
                            this.props.onResize(contentRect);
                        }
                    }
                }

            });
        }, this.props.throttleMs);

        handlePosition() {

            if (this._node && (this.props.position || this.props.scroll)) {
                const scrollContainer = findScrollContainer(this._node, {includeSelf: this.props.scroll});
                // console.log('scrollContainer: ', scrollContainer);
                this.bindScrollEvent(scrollContainer);
            }
        }

        bindScrollEvent(scrollContainer?: HTMLElement | Document) {
            if (this._removeScrollEvent) {
                this._removeScrollEvent();
            }

            this._removeScrollEvent = addEvent(
                scrollContainer,
                'scroll',
                () => {
                    this.measure();
                },
                {}
            );
        }

        _handleRef = (node: HTMLElement | null) => {
            if (this._resizeObserver !== null && this._node !== null) {
                this._resizeObserver.unobserve(this._node);
            }

            this._node = node;

            this.handlePosition();

            if (this._resizeObserver !== null && this._node !== null) {
                this._resizeObserver.observe(this._node);
            }

            const {innerRef} = this.props;
            if (innerRef) {
                if (typeof innerRef === 'function') {
                    innerRef(this._node);
                }
                else {
                    innerRef.current = this._node;
                }
            }

        };

        render() {
            const {
                innerRef,
                onResize,
                ...props
            } = this.props;
            return createElement(WrappedComponent, {
                ...props,
                measureRef: this._handleRef,
                measure: this.measure,
                contentRect: this.state.contentRect
            });
        }
    };
}

