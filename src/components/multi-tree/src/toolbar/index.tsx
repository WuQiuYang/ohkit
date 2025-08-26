import React, {Component} from 'react';
import {isFunction} from 'lodash-es';
import {
  classNames as cx,
} from "@ohkit/prefix-classname";
import {ITreeData,} from "../typing";
import {type MultiTree, c} from "../";
import './style.scss';

export interface MultiTreeToolbarProps<T extends ITreeData = ITreeData> {
  className?: string;
  /**
   * 最大缩放倍数 默认1.25
   */
  maxZoom?: number;
  /**
   * 最小缩放倍数 默认0.25
   */
  minZoom?: number;
  /**
   * 每次放大或缩小的步长 默认0.25
   */
  zoomStep?: number;
  /**
   * 指向 MultiTree 组件的引用
   */
  treeRef: MultiTree<T>;
  /**
   * 自定义渲染工具栏方法
   */
  renderToolbar?: (opt: {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    zoomStep: number;
    zoomIn: MultiTreeToolbar<T>["zoomIn"];
    zoomOut: MultiTreeToolbar<T>["zoomOut"];
    goBackCenter: MultiTreeToolbar<T>["goBackCenter"];
  }) => React.ReactNode;
  /**
   * 工具栏最外层容器点击事件
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const defaultMultipleTreeToolbarProps = {
  maxZoom: 1.25,
  minZoom: 0.25,
  zoomStep: 0.25 // TODO: 优化为整数 代替 小数运算
};
type DefaultMultiTreeToolbarProps = typeof defaultMultipleTreeToolbarProps;

type TyMultiTreeToolbarProps<T extends ITreeData = ITreeData> = DefaultMultiTreeToolbarProps & MultiTreeToolbarProps<T>;

export class MultiTreeToolbar<T extends ITreeData = ITreeData> extends Component<MultiTreeToolbarProps<T>> {
    static defaultProps = defaultMultipleTreeToolbarProps;

    zoom = 1;
    // use in default render
    state = {
        zoom: this.zoom
    };

    zoomOut = () => {
        const {minZoom, zoomStep, treeRef} = this.props as Readonly<TyMultiTreeToolbarProps<T>>;
        let {zoom} = this;
        if (zoom > minZoom) {
            const newZoom = Math.round(zoom * 100 - zoomStep * 100) / 100; // 处理case: 1.4 - 0.1 !== 1.3
            zoom = Math.max(newZoom, minZoom);
            treeRef.zoomSize(zoom);
            this.zoom = zoom;
        }
        return zoom;
    };

    zoomIn = () => {
        const {maxZoom, zoomStep, treeRef} = this.props as Readonly<TyMultiTreeToolbarProps<T>>;
        let {zoom} = this;
        if (zoom < maxZoom) {
            const newZoom = Math.round(zoom * 100 + zoomStep * 100) / 100; // 处理case: 1.1 + 0.1 !== 1.2
            zoom = Math.min(newZoom, maxZoom);
            treeRef.zoomSize(zoom);
            this.zoom = zoom;
        }
        return zoom;
    };

    handleZoomOut = () => {
        const {zoom: preZoom} = this.state;
        const zoom = this.zoomOut();
        if (zoom !== preZoom) {
            this.setState({zoom});
        }
        return zoom;
    };

    handleZoomIn = () => {
        const {zoom: preZoom} = this.state;
        const zoom = this.zoomIn();
        if (zoom !== preZoom) {
            this.setState({zoom});
        }
        return zoom;
    };

    goBackCenter = () => {
        const {treeRef} = this.props;
        treeRef.setCenterPosition({init: true});
    };

    render() {
        const {renderToolbar, minZoom, maxZoom, zoomStep} = this.props as Readonly<TyMultiTreeToolbarProps<T>>;
        if (isFunction(renderToolbar)) {
            const {handleZoomIn, handleZoomOut, goBackCenter} = this;
            return renderToolbar({
                zoom: this.state.zoom,
                minZoom,
                maxZoom,
                zoomStep,
                zoomIn: handleZoomIn,
                zoomOut: handleZoomOut,
                goBackCenter
            });
        }

        // else default render
        const {className, onClick} = this.props;
        const {zoom} = this.state;
        return (
            <div className={cx(c('toolbar-container'), className)} onClick={onClick}>
                <div className={c('toolbar-control')}>
                    <button 
                    className={c('zoom-control')}
                    onClick={this.handleZoomOut}
                    >
                    缩小
                    </button>
                    <div className={c('zoom-size')}>{Math.round(zoom * 100)}%</div>
                    <button 
                    className={c('zoom-control')}
                    onClick={this.handleZoomIn}
                    >
                    放大
                    </button>
                    <div className={c('sep')}></div>
                    <button 
                    className={c('zoom-control')}
                    onClick={this.goBackCenter}
                    >
                    回到中点
                    </button>
                </div>
            </div>
        );
    }
}
