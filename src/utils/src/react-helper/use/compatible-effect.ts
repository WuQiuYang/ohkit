import {useEffect, useLayoutEffect} from 'react';
import {inBrowser} from '../../platform';

/**
 * 使用兼容的副作用钩子函数
 *
 * @param effect 要执行的副作用函数 浏览器端使用 useLayoutEffect，ssr 使用 useEffect
 * @param deps 副作用函数的依赖列表，当依赖变化时，会重新执行副作用函数
 * @returns 无返回值
 */
export const useCompatibleEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    if (inBrowser) {
        useLayoutEffect(effect, deps);
    } else {
        useEffect(effect, deps);
    }
};
