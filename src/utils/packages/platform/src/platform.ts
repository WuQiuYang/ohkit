

/**
 * 判断是否是浏览器环境
 */
export const inBrowser = typeof document !== 'undefined';

type Fn = () => any;

export function safeRunInSSR<T extends Fn, K extends Fn>(fn: T, failback?: K): ReturnType<T> | ReturnType<K> {
    if (inBrowser) {
        return fn();
    } else {
        return failback?.();
    }
}

export const safeGlobalObject = safeRunInSSR(() => globalThis || window || self || global, () => globalThis || global);

export const isChrome = safeRunInSSR(
    () => (/(chrome)/i).test(window.navigator.userAgent),
    () => false,
)
export const isSafari = safeRunInSSR(
    () => (/(safari)/i).test(window.navigator.userAgent) && !isChrome,
    () => false,
)
export const isFirefox = safeRunInSSR(
    () => (/(firefox)/i).test(window.navigator.userAgent),
    () => false,
)

export const platform = {
    global: safeGlobalObject,
    isChrome,
    isSafari,
    isFirefox,
    inBrowser,
};
