import {safeParse} from '@ohkit/json-helper';

export const RESPONSE_STATUS_LIST = [
    'success',
    'fail',
] as const;

export interface ResponseJSON<Data = Record<string, unknown>, Status extends string | number = (typeof RESPONSE_STATUS_LIST)[number]> {
    status?: Status;
    data: Data;
    message?: string;
    error?: Error;
}

export interface IEventData<T = unknown> extends Pick<ResponseJSON<T>, 'status' | 'message'> {
    data?: T;
}

export interface SSEEvent<Data = unknown, T = IEventData<Data>> {
    id?: string;
    event: 'message' | 'heartbeat' | 'error' | 'end';
    data?: string;
    dataJson?: T | null;
}

/**
 * 格式化SSE流数据
 * @params stream 流数据
 * eg:
    id:1
    event:message
    data:{"a":"x1","b":"xx2"}

    id:2
    event:message
    data:{"a":"x2","b":"xx2"}
 */
export function formatSSEStream<Data = unknown, T = IEventData<Data>>(stream: string) {
    const events = stream.split('\n\n');
    // console.log('events:', events);
    return events.map((event) => {
        if (event.trim()) {
            // console.log('----start----\n', event, '\n----end----\n');
            const kvStrList = event.split('\n');
            const formatEventMap = kvStrList.reduce((acc, kvStr) => {
                let key = '';
                let value = '';

                // 特殊处理 data:{"a": xxx}
                if (kvStr.startsWith('data:')) {
                    key = 'data';
                    value = kvStr.slice(5);
                } else {
                    const kvTuple = kvStr.split(':');
                    key = kvTuple[0];
                    value = kvTuple[1];
                }
                acc[key] = value;
                if (key === 'data') {
                    acc.dataJson = safeParse<T>(value);
                }
                return acc;
            }, {} as Record<string, any>);
            // console.log('Received event item:', formatEventMap);
            // 处理接收到的数据
            return formatEventMap as SSEEvent<Data, T>;
        }
        return null;
    }).filter(c => !!c);
}

/**
 * 创建一个用于分割 SSE（Server-Sent Events）流的函数。
 *
 * @returns 返回一个函数，该函数用于将 xhr 响应文本分割成独立的 SSE 事件。
 */
export function createSSEStreamSpliter() {
    let sseResponseStartSplitIndex = 0;
    let sseResponseEndSplitIndex = 0;
    return function splitSSEStream(xhrResponseText: string) {
        // 有可能出现接收到半条消息就触发 onprogress，所以每次截断至最后一个 '\n\n' 即可
        const nnIndex = xhrResponseText.lastIndexOf('\n\n');
        if (nnIndex < 0) {
            return '';
        }
        sseResponseEndSplitIndex = nnIndex + 2; // 截断至最后一个 \n\n
        if (sseResponseEndSplitIndex <= sseResponseStartSplitIndex) {
            return '';
        }
        const newData = xhrResponseText.substring(sseResponseStartSplitIndex, sseResponseEndSplitIndex);
        sseResponseStartSplitIndex = sseResponseEndSplitIndex;
        return newData;
    };
}

export const sse = {
    createSSEStreamSpliter,
    formatSSEStream,
};
