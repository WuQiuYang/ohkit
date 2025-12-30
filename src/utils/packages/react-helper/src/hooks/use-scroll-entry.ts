import React, { useRef, useCallback, useState, useEffect } from 'react';
import {findScrollContainer, fallbackScrollerContainer} from '@ohkit/dom-helper';
import {useRuntime} from './runtime';

// 用于查找指定dom的滚动容器
export function useScrollEntry(ref: React.RefObject<HTMLElement>, {
  realScroll = true, // 真实的可滚动容器
  autoFind = false, // 是否开启自动查询非window的scroller
  intervalTime = 1000 // 单位ms, autoFind为true时自动检查间隔时长。
} = {}) {
  const [runtime] = useRuntime<{
    delayTimer: NodeJS.Timeout | null;
    findSeq: number;
  }>({
    delayTimer: null,
    findSeq: 0
  });
  const [, setUpdateSeq] = useState(1);
  const scrollEntryRef = useRef<{
    scroller: Window | HTMLElement | null;
    scrollContainer: HTMLElement | null;
    updateScroller: () => void;
  }>({
      scroller: null, // 可注册scroll事件（eg：window）
      scrollContainer: null,
      updateScroller: () => { // 修改findSeq，下一次更新需要重新查询scroller
          const {scrollContainer} = scrollEntryRef.current;
          // 限制查找maxFindTime次(避免异常情况造成死循环)
          if (runtime.findSeq < 1000 && scrollContainer === fallbackScrollerContainer) {
              runtime.findSeq += 1;
          }
      }
  });

  const forceUpdate = useCallback(() => {
    setUpdateSeq(prev => prev + 1);
  }, []);

  useEffect(() => {
      if (ref.current) {
          const run = () => {
              const scrollContainer = findScrollContainer(ref.current, {
                  realScroll
              });
              // console.log(scrollContainer, 'found scrollContainer');
              const scrollerIsWindow = scrollContainer === fallbackScrollerContainer;
              if (scrollContainer !== scrollEntryRef.current.scrollContainer) {
                  const isNeedUpdate = !!scrollEntryRef.current.scrollContainer;
                  scrollEntryRef.current.scrollContainer = scrollContainer;
                  scrollEntryRef.current.scroller = scrollerIsWindow ? window : scrollContainer;
                  isNeedUpdate && forceUpdate();
              }
              if (autoFind) {
                  if (scrollerIsWindow) {
                      runtime.delayTimer = setTimeout(() => {
                          run();
                      }, intervalTime);
                  } else if (runtime.delayTimer) {
                      clearTimeout(runtime.delayTimer);
                  }
              }
          };
          // 默认执行一次
          run();
      }

      return () => {
            if (runtime.delayTimer) {
                clearTimeout(runtime.delayTimer);
            }
          runtime.delayTimer = null;
      };
  }, [ref, runtime.findSeq, realScroll, autoFind, intervalTime, forceUpdate]);

  return scrollEntryRef.current;
}

export default useScrollEntry;