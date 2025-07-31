import {useState, useCallback} from 'react';
import {useRuntime} from '../runtime';
import {useCompatibleEffect} from '../compatible-effect';

export interface ISyncPropsStateOptions<T, K extends keyof T, Val extends T[K] = T[K]> {
    defaultValue?: Val;
    onChange?: (val: Val extends undefined ? T[K] : Required<T>[K]) => void;
    // layoutEffect?: boolean;
    /**
     * 自定义比较函数
     * @param pre 前一个值
     * @param cur 当前值
     */
    compare?: (pre: T[K], cur: T[K]) => boolean;
}

/**
 * 使用组件的 props 属性同步组件状态
 *
 * @description T[K] 不能是个函数类型，在 React 中，useState 通常用于管理非函数类型的状态（如数字、字符串、对象等）
 * 如果你需要管理一个函数类型的状态，直接使用 useState 可能会导致一些问题，因为 React 会将函数视为惰性初始化的函数，而不是状态值本身。
 *
 * @param key 要同步的 props 的键名
 * @param props 组件的 props 对象
 * @param options 可选配置参数
 * @returns 返回内部状态和更新状态的函数
 */
export function useSyncPropsState<T extends object, K extends keyof T, Val extends T[K] = T[K]>(
    props: T,
    key: K,
    options?: ISyncPropsStateOptions<T, K, Val>
): [Val extends undefined ? T[K] : Required<T>[K], (val: T[K] extends undefined ? T[K] : Required<T>[K], emitChange?: boolean) => void] {
    const propVal = props[key];
    const isFuncState = typeof propVal === 'function';
    // const isObjectState = typeof propVal === 'object';
    const {
        onChange,
        // layoutEffect = false,
        defaultValue = propVal,
        compare = (pre: T[K], cur: T[K]) => pre === cur,
    } = options || {};

    // 考虑可能有 function 类型的 state 惰性初始化
    const [inner, setInner] = useState(() => typeof propVal !== 'undefined' ? propVal : defaultValue);

    const [runtime] = useRuntime({
        onChange,
        compare,
        inner,
        isFuncState,
    }, ['compare', 'onChange', 'inner', 'isFuncState']);
    const setFinalInner = useCallback((val: typeof propVal, emitChange = true) => {
        if (!runtime.compare?.(runtime.inner, val)) {
            // console.log('[useSyncPropsState] real change  pre => cur: ', runtime.inner, val);
            // function 类型的state 需要惰性更新
            setInner(runtime.isFuncState ? () => val : val);
            // init 时，不应触发change
            emitChange && runtime.onChange?.(val);
        }
    }, [runtime]);

    // const effect = layoutEffect ? useLayoutEffect : useEffect;
    useCompatibleEffect(() => {
        // console.log('[useSyncPropsState] propVal useEffect change: ', propVal);
        let newVal = propVal;
        if (
            typeof propVal === 'undefined'
            && typeof defaultValue !== 'undefined'
        ) {
            newVal = defaultValue;
        }
        setFinalInner(newVal, false);
    }, [defaultValue, propVal]);

    return [inner, setFinalInner];
}
