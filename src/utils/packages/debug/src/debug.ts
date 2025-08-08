/**
 * @file 随着接入了越来越多的其他第三方库、应用后，统一管理和区分日志对于调试提效来说尤为重要
 */

type PrintParams = Parameters<typeof console.log>;
type LogType = keyof Pick<Console, 'log' | 'warn' | 'error'>;
export interface DebugOptions {
    prefix?: string;
}

export class Debug {
    constructor(option: DebugOptions = {}) {
        this._option = option;
    }
    private _option: DebugOptions = {};
    private get _prefix() {
        return this._option.prefix || '';
    };
    /**
     * 打印日志信息
     *
     * @param type 日志类型，默认为 'log'
     * @param arg 打印的参数，可以是任意类型和数量的参数
     */
    print = (type: LogType = 'log', ...arg: PrintParams) => {
        console[type]?.(`*** ${this._prefix} *** : `, ...arg);
    }

    log = (...arg: PrintParams) => {
        this.print('log', ...arg);
    }

    warn = (...arg: PrintParams) => {
        this.print('warn', ...arg);
    }

    error = (...arg: PrintParams) => {
        this.print('error', ...arg);
    }

    /**
     * 为当前实例添加前缀
     *
     * @param prefix 要添加的前缀字符串
     * @returns 当前实例
     */
    addPrefix = (prefix: string) => {
        return new Debug({...this._option, prefix: this._prefix + '->' + prefix});
    }
}
