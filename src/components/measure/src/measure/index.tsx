import {withContentRect, InjectMeasureProps, WithContentRectProps} from '../with-content-rect';
import React, {ComponentClass} from 'react';

export interface MeasureProps extends WithContentRectProps {
    children?: ({
        measure,
        measureRef,
        contentRect
    }: InjectMeasureProps) => React.JSX.Element;
}

/**
 * Measure 组件是一个高阶组件，用于测量并获取子元素的内容区域尺寸信息。
 * 它通过 withContentRect 高阶组件封装，将测量相关的属性和方法注入到子组件中。
 * 
 * @param props - 组件属性，包含 measure、measureRef、contentRect 等测量相关属性和 children 渲染函数
 * @returns 返回 children 函数的执行结果，如果 children 不存在则返回 null
 */
export const Measure = withContentRect()(
  (props: MeasureProps & InjectMeasureProps) => {
    const { measure, measureRef, contentRect, children } = props;
    return children?.({ measure, measureRef, contentRect }) || null;
  }
) as ComponentClass<MeasureProps>;

Object.assign(Measure, {
  displayName: 'Measure'
});
