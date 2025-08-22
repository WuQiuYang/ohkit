/**
 * @file blinkDom
 */

interface BlinkOptions {
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
}

interface BlinkDomOptions extends BlinkOptions {
    onExit?: () => void;
    debug?: boolean;
    duration?: number;
}

/**
 * 注册闪烁效果到指定的HTML元素上
 *
 * @param dom 要添加闪烁效果的HTML元素
 * @param options 包含闪烁选项的对象
 * @param options.className 要添加到元素上的类名，如果提供了这个参数，将忽略style参数
 * @param options.style CSS样式对象，如果未提供className参数，则使用此参数设置元素的样式
 * @returns 返回一个函数，调用此函数可以移除闪烁效果
 */
function registerBlink(dom: HTMLElement, {className, style = {}}: BlinkOptions = {}) {
    const names = Object.keys(style) as Array<keyof Partial<CSSStyleDeclaration>>;
    const cacheStyles: Partial<CSSStyleDeclaration> = {};
    names.forEach((name) => {
        Object.assign(cacheStyles, {[name]: dom.style[name]});
    });

    if (className) {
        dom.classList.add(className);
    } else {
        Object.assign(dom.style, style);
    }
    return () => {
        if (className) {
            dom.classList.remove(className);
        } else {
            Object.assign(dom.style, cacheStyles);
        }
    };
}

/**
 * 使 DOM 元素闪烁
 *
 * @param dom 要闪烁的 DOM 元素
 * @param options 闪烁配置选项
 * @returns 取消闪烁的函数，如果未开启 debug 模式，则不返回函数
 */
export function blinkDom(
    dom: HTMLElement & {_exitBlink?: () => void},
    {
        onExit,
        className,
        debug,
        duration = 2000,
        style = {backgroundColor: '#FBFBD7'}, // #FFFCEF
    }: BlinkDomOptions = {}
): void | (() => void) {
    if (!dom) {
        return;
    }

    if (typeof dom._exitBlink === 'function') {
        dom._exitBlink();
    }

    const exit = registerBlink(dom, {className, style});
    let timer: NodeJS.Timeout | null = null;
    const bye = () => {
        if (!debug) {
            exit();
        }
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        delete dom._exitBlink;
        onExit && onExit();
    };
    timer = setTimeout(bye, duration);
    dom._exitBlink = bye;

    return bye;
}
