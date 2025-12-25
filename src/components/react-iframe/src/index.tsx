import React, {PropsWithChildren, useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback, memo} from 'react';
import {
  prefixClassname as p,
  classNames as cx,
} from "@ohkit/prefix-classname";
import {
  useRuntime,
} from "@ohkit/react-helper";
import {addSearchToUrl} from './utils';

import './style.scss';

export const c = p("ohkit-react-iframe__");

export interface IReactIframe extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    src: string;
    iframeName?: string;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
    renderLoading?: () => React.ReactNode;
}

export type ReactIframeProps = PropsWithChildren<IReactIframe>;

export const ReactIframe = memo(forwardRef<HTMLIFrameElement | null, ReactIframeProps>(
    ({src, iframeName, className, onLoad, children, onLoadStart, onLoadEnd, renderLoading, ...props}, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(true);
    const [runtime] = useRuntime({
        iframeSrc: addSearchToUrl(src, {
            iframeName,
        }),
        currentLoadedSrc: addSearchToUrl(src, {
            iframeName,
        }),
        onLoadStart,
        onLoadEnd,
        // preSrc: src,
        init: false
    }, ['onLoadStart', 'onLoadEnd']);

    useImperativeHandle<HTMLIFrameElement | null, HTMLIFrameElement | null>(ref, () => iframeRef.current);

    const handleLoad = useCallback((evt: React.SyntheticEvent<HTMLIFrameElement>) => {
        // console.log('iframe loaded');
        setLoading(false);
        runtime.onLoadEnd?.();
        onLoad?.(evt);
        try {
            if (!iframeRef.current) return;
            const {contentWindow: iWindow} = iframeRef.current;
            iWindow?.addEventListener('hashchange', (ev: HashChangeEvent) => {
                console.log('iWindow hashchange old => new : ', ev.oldURL, ev.newURL);
            });
        } catch (err) {
            console.warn(err);
        }
    }, [onLoad, runtime]);

    useEffect(() => {
        if (runtime.init) {
            if (iframeRef.current?.contentWindow && src) {
                const {contentWindow: iWindow} = iframeRef.current;
                let href = runtime.currentLoadedSrc;
                try {
                    // 同源才可获取
                    href = iWindow.location.href;
                } catch (err) {
                    console.log(err);
                }
                runtime.currentLoadedSrc = addSearchToUrl(src, {iframeName});
                try {
                    const {origin, pathname, search} = new URL(href, location.href);
                    const {
                        origin: tOrigin,
                        pathname: tPath,
                        search: tSearch
                    } = new URL(runtime.currentLoadedSrc, location.href);
                    // 非仅hash变化时，需要重新加载资源，添加loading效果
                    if (origin !== tOrigin || pathname !== tPath || search !== tSearch) {
                        setLoading(true);
                        runtime.onLoadStart?.();
                    }
                } catch (err) {
                    console.error(err);
                    console.error(new Error(`[ReactIFrame] --- currentLoadedSrc, href: ${runtime.currentLoadedSrc}, ${href}`));
                }

                // runtime.preSrc = src;
                // console.log('src change', href, runtime.currentLoadedSrc);
                iWindow.location.replace(runtime.currentLoadedSrc);
            }
        } else {
            runtime.init = true;
            runtime.onLoadStart?.();
        }
    }, [src, iframeName, runtime]);
    // console.log('iframe render');
    return src ? (
        <div className={cx(c('container'), className)} title={loading ? '加载中...' : ''}>
            {loading
                ? renderLoading
                    ? renderLoading()
                    : <span className={c('loading')}>加载中...</span>
                : null}
            <iframe
                src={runtime.iframeSrc}
                frameBorder={0}
                width={'100%'}
                height={'100%'}
                ref={iframeRef}
                {...props}
                onLoad={handleLoad}
            >
                {children || '你的浏览器不支持iframe'}
            </iframe>
        </div>
    ) : null;
}));

export default ReactIframe;