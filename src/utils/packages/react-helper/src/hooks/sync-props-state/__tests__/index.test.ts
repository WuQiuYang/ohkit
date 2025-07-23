import {renderHook, act} from '@testing-library/react';
import {isEqual} from 'lodash-es';
// import {act} from 'react';
import {useSyncPropsState} from '../index';

describe('useSyncPropsState', () => {
    it('should sync single prop', () => {
        const {result, rerender} = renderHook(
            (props) => useSyncPropsState(props, 'foo'),
            {
                initialProps: {foo: 'bar'},
            }
        );

        expect(result.current[0]).toBe('bar');

        act(() => {
            rerender({foo: 'baz'});
        });

        expect(result.current[0]).toBe('baz');
    });

    it('should sync function prop', () => {
        const fun1 = () => 'fun11';
        const fun2 = () => 'fun22';
        const obj = {fun1};

        const {result, rerender} = renderHook(
            (props) => useSyncPropsState(props, 'fun'),
            {
                initialProps: {
                    foo: {a: 1},
                    fun: fun1,
                    obj,
                },
            }
        );

        expect(result.current[0]).toBe(fun1);

        act(() => {
            rerender({
                foo: {a: 2},
                fun: fun2,
                obj,
            });
        });

        expect(result.current[0]).toBe(fun2);
    });

    it('should sync object prop', () => {
        const obj1 = {a: 1};
        const obj2 = {a: 2};
        const obj3 = {a: 2};

        const {result, rerender} = renderHook(
            (props) => useSyncPropsState(props, 'obj', {
                compare: (pre, cur) => {
                    return isEqual(pre, cur);
                }
            }),
            {
                initialProps: {obj: obj1},
            }
        );

        expect(result.current[0]).toBe(obj1);

        act(() => {
            rerender({obj: obj2});
        });

        expect(result.current[0]).toBe(obj2);

        act(() => {
            rerender({obj: obj3});
        });

        // obj3 浅等于 obj2，所以不会更新。
        expect(result.current[0]).toBe(obj2);
    });

    it('should sync array prop', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 22, 3];
        const arr3 = [1, 22, 3];

        const {result, rerender} = renderHook(
            (props) => useSyncPropsState(props, 'arr', {
                compare: (pre, cur) => {
                    return isEqual(pre, cur);
                }
            }),
            {
                initialProps: {arr: arr1},
            }
        );

        expect(result.current[0]).toBe(arr1);

        act(() => {
            rerender({arr: arr2});
        });

        expect(result.current[0]).toBe(arr2);

        act(() => {
            rerender({arr: arr3});
        });

        // arr3 浅等于 arr2，所以不会更新
        expect(result.current[0]).toBe(arr2);
    });

    it('should sync multiple props independently', () => {
        const {result: result1, rerender: rerender1} = renderHook(
            (props) => useSyncPropsState(props, 'foo'),
            {
                initialProps: {foo: 'bar', bar: 'baz'},
            }
        );

        const {result: result2} = renderHook(
            (props) => useSyncPropsState(props, 'bar'),
            {
                initialProps: {foo: 'bar', bar: 'baz'},
            }
        );

        expect(result1.current[0]).toBe('bar');
        expect(result2.current[0]).toBe('baz');

        act(() => {
            rerender1({foo: 'qux', bar: 'quux'});
        });

        expect(result1.current[0]).toBe('qux');
        expect(result2.current[0]).toBe('baz');
    });

    it('should not sync when unrelated props change', () => {
        const {result: result1, rerender: rerender1} = renderHook(
            (props) => useSyncPropsState(props, 'foo'),
            {
                initialProps: {foo: 'bar', bar: 'baz', qux: 'qux'},
            }
        );

        const {result: result2} = renderHook(
            (props) => useSyncPropsState(props, 'bar'),
            {
                initialProps: {foo: 'bar', bar: 'baz', qux: 'qux'},
            }
        );

        expect(result1.current[0]).toBe('bar');
        expect(result2.current[0]).toBe('baz');

        act(() => {
            rerender1({foo: 'bar', bar: 'quux', qux: 'qux1'});
        });

        expect(result1.current[0]).toBe('bar');
        expect(result2.current[0]).toBe('baz');
    });

    it('should handle empty props', () => {
        const {result} = renderHook(
            (props: { foo?: any }) => useSyncPropsState(props, 'foo'),
            {
                initialProps: {},
            }
        );

        expect(result.current[0]).toBeUndefined();
    });
});
