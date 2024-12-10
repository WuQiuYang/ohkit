import {useRef} from 'react';
import {pick} from 'lodash-es';

/**
 * P 可以是 T 和 U 中的属性，P是U中属性时类型必须匹配 U[P]
 */
type PartialOfMixin<T, U> = {
    [P in keyof U | keyof T]?: P extends keyof U ? U[P] : unknown;
};

export type AssignRuntime<U> = <T extends PartialOfMixin<T, U>>(props: T) => void;

/**
 * 用于function组件挂载一些字段缓存（类似class组件的this上挂载）
 * @param {T} init extends Record<PropertyKey, unknown>
 * @param {Array<keyof T>} [syncKeys] 每次render时需要同步的字段
 * @return {*}  [T, <U extends PartialOfMixin<T, U>>(props: U) => void]
 */
export function useRuntime<T extends object>(
    init: T,
    syncKeys?: Array<keyof T>
): [T, AssignRuntime<T>] {
    const runtimeRef = useRef(init);
    const assignRuntime = (props = {}) => {
        if (props && typeof props === 'object') {
            Object.assign(runtimeRef.current, props);
        }
    };
    if (syncKeys) {
        assignRuntime(pick(init, syncKeys));
    }
    return [runtimeRef.current, assignRuntime];
}

