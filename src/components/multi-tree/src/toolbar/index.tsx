import React, {Component} from 'react';
import {isFunction} from 'lodash-es';
import {Button, Tooltip as ToolTip} from 'antd';
import {
  classNames as cx,
} from "@ohkit/prefix-classname";
import {ITreeData, type MultiTree, c} from "../";
import './style.scss';

export interface MultiTreeToolbarProps<T extends ITreeData = ITreeData> {
  className?: string;
  maxZoom?: number;
  minZoom?: number;
  zoomStep?: number;
  treeRef: MultiTree<T>;
  renderToolbar?: (opt: {
  zoom: number;
  zoomIn: MultiTreeToolbar<T>["zoomIn"];
  zoomOut: MultiTreeToolbar<T>["zoomOut"];
  goBackCenter: MultiTreeToolbar<T>["goBackCenter"];
  }) => React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const defaultMultipleTreeToolbarProps = {
  maxZoom: 1.25,
  minZoom: 0.25,
  zoomStep: 0.25
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
            zoom = Math.max(zoom - zoomStep, minZoom);
            treeRef.zoomSize(zoom);
            this.zoom = zoom;
        }
        return zoom;
    };

    zoomIn = () => {
        const {maxZoom, zoomStep, treeRef} = this.props as Readonly<TyMultiTreeToolbarProps<T>>;
        let {zoom} = this;
        if (zoom < maxZoom) {
            zoom = Math.min(zoom + zoomStep, maxZoom);
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
    };

    handleZoomIn = () => {
        const {zoom: preZoom} = this.state;
        const zoom = this.zoomIn();
        if (zoom !== preZoom) {
            this.setState({zoom});
        }
    };

    goBackCenter = () => {
        const {treeRef} = this.props;
        treeRef.setCenterPosition({init: true});
    };

    render() {
        const {renderToolbar, minZoom, maxZoom} = this.props as Readonly<TyMultiTreeToolbarProps<T>>;
        if (isFunction(renderToolbar)) {
            const {zoom, zoomIn, zoomOut, goBackCenter} = this;
            return renderToolbar({
                zoom,
                zoomIn,
                zoomOut,
                goBackCenter
            });
        }

        // else default render
        const {className, onClick} = this.props;
        const {zoom} = this.state;
        return (
            <div className={cx(c('toolbar-container'), className)} onClick={onClick}>
                <div className={c('toolbar-control')}>
                    <ToolTip title={'缩小'}>
                        <Button
                            color="default"
                            variant="text"
                            icon={'-'}
                            size={'small'}
                            disabled={zoom <= minZoom} // TODO: tooltip disabled 后不消失
                            onClick={this.handleZoomOut}
                        />
                    </ToolTip>
                    <div className={c('zoom-size')}>{zoom * 100}%</div>
                    <ToolTip title={'放大'}>
                        <Button
                            color="default"
                            variant="text"
                            icon={'+'}
                            size={'small'}
                            disabled={zoom >= maxZoom}
                            onClick={this.handleZoomIn}
                        />
                    </ToolTip>
                    <div className={c('sep')}></div>
                    <ToolTip title={'回到原点'}>
                        <Button
                          color="default"
                          variant="text"
                          icon={'o'}
                          size={'small'}
                          onClick={this.goBackCenter}
                        />
                    </ToolTip>
                </div>
            </div>
        );
    }
}
