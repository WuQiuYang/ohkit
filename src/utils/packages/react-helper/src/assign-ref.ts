/**
 * @file react ref 工具函数
 */

export function assignRef<T>(registerRef: React.RefCallback<T> | React.RefObject<T>, ref: T | null) {
    if (typeof registerRef === 'function') {
        registerRef(ref);
    } else if (registerRef && registerRef.hasOwnProperty('current')) {
        // registerRef.current = ref;
        Object.assign(registerRef, { current: ref });
    }
}
