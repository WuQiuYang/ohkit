/**
 * @file 数据自动上报模型
 * @description 适用于自动保存、操作频次打点等场景（综合考虑时长与频率）
 */

import {PromisePipe} from '@ohkit/async';

type Reporter = () => Promise<unknown> | void;

export interface AutoReporterConstructorProps {
    /**
     * 关闭页面时需要提示用户吗？
     * @default false
     */
    beforeUploadConfirm?: boolean;
    /**
     * change事件触发次数，达到该次数后触发上报
     * @default 20
     */
    maxTimes?: number;
    /**
     * change事件后，等待多少毫秒（ms）后触发上报
     * @default 30000 (30 * 1000)
     */
    duration?: number;
    /**
     * 是否需要监听beforeunload事件 页面销毁前触发上报
     * @default true
     */
    triggerFlushBeforeUnload?: boolean;
    /**
     * onReport 若为 Promise，是否需要串行上报
     * @default false
     */
    reportPipe?: boolean;
    /**
     * 触发自动上报回调
     */
    onReport: Reporter;
}

/**
 * @class 数据自动上报模型
 * @description 适用于自动保存、操作频次打点等场景（综合考虑时长与频率）
 * @example
 * const autoReporter = new AutoReporter({
 *     onReport: async () => {
 *         console.log('触发了上报');
 *     },
 * });
 * // 数据变更时，触发change
 * autoReporter.change();
 * // ${duration} 时间后自动触发上报
 * // or change ${maxTimes} 次后自动触发上报
 * // ...
 * // or 手动立即触发上报（有变更）
 * autoReporter.flush();
 * // ...
 * // 取消上报
 * autoReporter.cancel();
 */
export class AutoReporter {
    private readonly beforeUploadConfirm = false;
    private readonly maxTimes = 20;
    private readonly duration = 30 * 1000;
    private readonly triggerFlushBeforeUnload = true;
    private readonly reportPipe = false;
    private hasBeforeUnloadListener = false;
    protected onReport?: Reporter;
    protected times = 0;
    protected timer: NodeJS.Timeout | null = null;

    /**
     * 请求串行管道
     */
    requestPipe = new PromisePipe();
    constructor(props: AutoReporterConstructorProps) {
        this.updateConfig(props);
    }
    private start() {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                // console.log('[AutoReporter] 第一次change后，最长等待时间到，触发上报。change times:', this.times);
                void this.reportAndReset();
            }, this.duration);
            this.triggerFlushBeforeUnload && this.addBeforeUnloadListener();
        }
    }

    private reportAndReset() {
        const ret = this.reportPipe
            ? this.requestPipe.add(() => {
                return this.onReport?.();
            })
            : this.onReport?.();
        this.reset();
        return ret;
    }

    /**
     * 获取当前是否有待处理的事务
     *
     * @returns 如果有待处理的事务返回 true，否则返回 false
     */
    get pending() {
        return this.times > 0;
    }

    /**
     * 更新配置
     */
    updateConfig(props: Partial<AutoReporterConstructorProps>) {
        const {
            maxTimes,
            duration,
            triggerFlushBeforeUnload,
            reportPipe,
            beforeUploadConfirm,
            onReport,
        } = props || {};
        const validConfig = {
            maxTimes,
            duration,
            triggerFlushBeforeUnload,
            reportPipe,
            beforeUploadConfirm,
            onReport,
        };
        for (const key in validConfig) {
            const val = validConfig[key as keyof AutoReporterConstructorProps];
            if (typeof val !== 'undefined') {
                Object.assign(this, {[key]: val});
            }
        }
    }

    /**
     * 手动注册上报回调
     */
    register(reporter: Reporter) {
        this.onReport = reporter;
    }

    /**
     * 手动重置，取消进行中的上报
     */
    reset() {
        if (this.times) {
            this.times = 0;
            this.removeBeforeUnloadListener();
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * 取消自动上报 === reset
     */
    cancel() {
        this.reset();
    }

    /**
     * change 记录器
     */
    change() {
        this.times++;
        this.start();
        if (this.times >= this.maxTimes) {
            // console.log('[AutoReporter] change 次数达到最大值，触发上报。change times:', this.times);
            void this.reportAndReset();
        }
    }

    /**
     * 立即执行进行中的上报
     */
    flush() {
        if (this.times) {
            return this.reportAndReset();
        }
        // 如果没有进行中的上报，则直接返回 true, 表示没有进行中的上报
        return true;
    }

    /**
     *  beforeunload 处理页面关闭或切换html
     */
    private addBeforeUnloadListener() {
        if (typeof window === 'undefined' || this.hasBeforeUnloadListener) {
            return;
        }
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        this.hasBeforeUnloadListener = true;
    }

    private removeBeforeUnloadListener() {
        if (typeof window === 'undefined') {
            return;
        }
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.hasBeforeUnloadListener = false;
    }

    private readonly handleBeforeUnload = (ev: BeforeUnloadEvent) => {
        if (this.times && this.beforeUploadConfirm) {
            ev.preventDefault();
            // 有进行中的任务，关闭页面时需要提示用户
            (ev || window.event).returnValue = true; // Gecko + IE
        }
        void this.flush();
    };
}
