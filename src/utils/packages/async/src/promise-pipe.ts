/**
 * @file promise-pipe/index.ts
 * @description Promise 管道（串行）
 */

type PromiseTask<T = any> = () => Promise<T> | void;
type PromiseCallback = (opt: {
    task: PromiseTask | undefined;
    isEnd: boolean;
    res?: any;
}) => void;

/**
 * @class PromisePipe
 * @description Promise 串行管道
 * @example
 * ```ts
 * const pipe = new PromisePipe();
 * // 立即执行
 * pipe.add(promiseTask1);
 * pipe.add(promiseTask2);
 *
 * // or 添加任务但不立即执行
 * pipe.add(promiseTask1, {
 *     fireImmediately: false,
 * });
 * pipe.add(promiseTask2, {
 *     fireImmediately: false,
 * });
 * // 开始执行
 * pipe.start();
 * ```
 */
export class PromisePipe {
    private readonly waitList: PromiseTask[] = [];
    private promising: Promise<any> | void = undefined;
    private readonly promiseCallbackMap = new WeakMap<PromiseTask, PromiseCallback>();

    /**
     * 执行等待列表中的任务
     */
    private readonly run = () => {
        if (this.promising) {
            return;
        }
        const task = this.waitList.shift();
        if (task) {
            this.promising = task();
            const isEnd = this.waitList.length === 0;
            const callback = this.promiseCallbackMap.get(task);
            const next = () => {
                this.promising = undefined;
                this.run();
            };
            if (this.promising?.finally) {
                void this.promising
                    .then((res) => {
                        callback?.({
                            task,
                            isEnd,
                            res,
                        });
                    })
                    .finally(next);
            } else {
                callback?.({
                    task,
                    isEnd,
                    res: this.promising,
                });
                next();
            }
        } else {
            Object.values(this.promiseCallbackMap).forEach((callback: PromiseCallback) => {
                callback({
                    task,
                    isEnd: true,
                });
            });
        }
    };

    /**
     * @description 添加一个请求任务
     * 注意：fun 需要 return 一个 Promise 才能实现异步串行。
     */
    add = <T, WaitAll extends boolean = false>(
        fun: PromiseTask<T>,
        opt?: {
            /**
             * 是否需要等待所有任务执行完成后再 resolve
             * @default false
             */
            returnWaitAll?: WaitAll;
            /**
             * 是否立即执行 任务
             * @default true
             */
            fireImmediately?: boolean;
        }
    ): Promise<WaitAll extends true ? unknown : T> => {
        this.waitList.push(fun);
        const {fireImmediately = true, returnWaitAll = false} = opt || {};
        return new Promise((resolve) => {
            this.promiseCallbackMap.set(fun, ({isEnd, task, res}) => {
                if (returnWaitAll) {
                    if (isEnd) {
                        this.promiseCallbackMap.delete(fun);
                        resolve(res as WaitAll extends true ? unknown : T);
                    }
                } else if (fun === task) {
                    this.promiseCallbackMap.delete(fun);
                    resolve(res as T);
                }
            });
            fireImmediately && this.run();
        });
    };

    /**
     * 开始执行函数
     *
     * 调用 this.run() 方法来启动执行流程。
     */
    start = () => {
        this.run();
    }
}
