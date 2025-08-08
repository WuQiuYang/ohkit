import {Debug} from '@ohkit/debug';

const debug = new Debug({prefix: '[ohkit][utils][json-helper]'});

/**
 * 安全解析JSON字符串
 *
 * @template T 泛型类型，默认为unknown
 * @param data 要解析的字符串
 * @returns 解析后的结果，如果解析失败则返回null或undefined
 */
export const safeParse = <T = unknown>(
    data: string
): T | null => {
    try {
        return JSON.parse(data) as T;
    } catch (err: unknown) {
        const {warn} = debug.addPrefix('[safeParse]');
        warn('parse error', err);
        if (
            err instanceof Error
            && err.message.includes('Unexpected token \n in JSON at position')
        ) {
            // 处理换行符
            const safeStr = data.replace(/\n/g, '\\n');
            warn('replace to valid json: ', safeStr);
            return safeParse<T>(safeStr);
        }
        return null;
    }
};

/**
 * 安全地将数据转换为 JSON 字符串
 *
 * @param data 待转换的数据
 * @returns 如果转换成功，返回 JSON 字符串；否则返回空字符串
 * @throws 不会抛出异常
 */
export const safeStringify = (data: unknown): string => {
    try {
        return JSON.stringify(data);
    } catch (err) {
        debug.addPrefix('[safeStringify]').error('stringify error', err);
        return '';
    }
};

/**
 * 深拷贝
 *
 * @export
 * @template T
 * @param {T} data 需要深拷贝的对象
 * @return {T} 深拷贝后的对象
 */
export function safeCloneDeep<T>(data: T): T {
    return safeParse<T>(safeStringify(data)) as T;
}

export const jsonHelper = {
    safeParse,
    safeStringify,
    safeCloneDeep,
};
