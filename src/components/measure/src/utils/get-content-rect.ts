import {pick} from 'lodash-es';

export type Direction = 'bottom' | 'left' | 'right' | 'top';

export interface IGetContentRectOptions {
    client?: boolean;
    offset?: boolean | Direction[];
    scroll?: boolean;
    bounds?: boolean;
    margin?: boolean;
    position?: boolean | Direction[];
}

export interface IDirection {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export interface IRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface IContentRect {
    client?: IRect;
    offset?: Partial<IRect>;
    scroll?: IRect;
    bounds?: IRect & IDirection;
    position?: IDirection;
    margin?: IDirection;
    entry?: ResizeObserverEntry['contentRect'];
}

export function getContentRect(node: HTMLElement, props: IGetContentRectOptions = {}) {
    const calculations: IContentRect = {};
    if (props.client) {
        calculations.client = {
            top: node.clientTop,
            left: node.clientLeft,
            width: node.clientWidth,
            height: node.clientHeight
        };
    }

    if (props.offset) {
        calculations.offset = {
            top: node.offsetTop,
            left: node.offsetLeft,
            width: node.offsetWidth,
            height: node.offsetHeight
        };

        if (Array.isArray(props.offset)) {
            calculations.offset = pick(
                calculations.offset,
                props.offset
            );
        }
    }

    if (props.scroll) {
        calculations.scroll = {
            top: node.scrollTop,
            left: node.scrollLeft,
            width: node.scrollWidth,
            height: node.scrollHeight
        };
    }

    if (props.bounds) {
        const rect = node.getBoundingClientRect();
        calculations.bounds = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }

    if (props.position) {
        const rect = node.getBoundingClientRect();
        calculations.position = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left
        }
        if (Array.isArray(props.position)) {
            calculations.position = pick(
                calculations.position,
                props.position
            );
        }
    }

    if (props.margin) {
        const styles = getComputedStyle(node);
        calculations.margin = {
            top: styles ? parseInt(styles.marginTop, 10) : 0,
            right: styles ? parseInt(styles.marginRight, 10) : 0,
            bottom: styles ? parseInt(styles.marginBottom, 10) : 0,
            left: styles ? parseInt(styles.marginLeft, 10) : 0
        };
    }

    return calculations;
}

