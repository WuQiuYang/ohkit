import type { Meta, StoryObj } from "@storybook/react";
import { Button, Tooltip as ToolTip } from "antd";
import { ZoomInOutlined, ZoomOutOutlined, AimOutlined } from "@ant-design/icons";
import { MultiTree } from "./index";
import {
  MockDataList,
  getMockDataList,
  getNodeHeight,
  fetchChildren,
} from "./__mock__";

const meta: Meta<typeof MultiTree> = {
  // title: 'Components/MultiTree',
  component: MultiTree,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<
  typeof MultiTree<(typeof MockDataList)[number] & { _height_?: number }>
>;

// 基础示例
export const Default: Story = {
  args: {
    treeList: MockDataList,
  },
  render(args) {
    return (
      <div style={{ height: 600 }}>
        <MultiTree {...args} />
      </div>
    );
  },
};

// 随机高度节点
const MockDataList1 = getMockDataList();
export const RandomNodeHeight: Story = {
  name: "节点高度随机",
  args: {
    treeList: MockDataList1,
    renderCard(node) {
      if (!node._height_) {
        node._height_ = getNodeHeight();
      }
      return (
        <div
          style={{
            height: node._height_,
            backgroundColor: "pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        >
          {node.label} (高度: {node._height_}px)
        </div>
      );
    },
  },
  render(args) {
    return (
      <div style={{ height: 600 }}>
        <MultiTree {...args} />
      </div>
    );
  },
};

// 自定义工具栏示例
const MockDataList4 = getMockDataList();
export const CustomToolbar: Story = {
  name: "自定义工具栏",
  args: {
    treeList: MockDataList4,
    toolbarProps: {
      zoomStep: 0.1,
      maxZoom: 1.5,
    },
    renderToolbar: ({
      zoom,
      minZoom,
      maxZoom,
      zoomIn,
      zoomOut,
      goBackCenter,
    }) => (
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.9)",
          padding: "8px 12px",
          borderRadius: 20,
          display: "flex",
          gap: 8,
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <ToolTip title={"缩小"}>
          <Button
            color="default"
            variant="text"
            icon={<ZoomOutOutlined />}
            size={"small"}
            disabled={zoom <= minZoom} // TODO: tooltip disabled 后不消失
            onClick={zoomOut}
          />
        </ToolTip>
        <span style={{ minWidth: 40, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        <ToolTip title={"放大"}>
          <Button
            color="default"
            variant="text"
            icon={<ZoomInOutlined />}
            size={"small"}
            disabled={zoom >= maxZoom}
            onClick={zoomIn}
          />
        </ToolTip>
        <ToolTip title={"回到中点"}>
          <Button
            color="default"
            variant="text"
            icon={<AimOutlined />}
            size={"small"}
            onClick={goBackCenter}
          />
        </ToolTip>
      </div>
    ),
  },
  render(args) {
    return (
      <div
        style={{
          height: 600,
          position: "relative",
          border: "1px solid #eee",
        }}
      >
        <MultiTree {...args} />
      </div>
    );
  },
};

// 深色模式示例
const MockDataList5 = getMockDataList();
export const DarkMode: Story = {
  name: "自定义适配深色",
  args: {
    treeList: MockDataList5,
    layoutBgColor: "#1a1a1a",
    lineColor: "#d0d0d0",
    toggleBtnSize: 20,
    renderCard: (node) => (
      <div
        style={{
          padding: 12,
          background: "#2a2a2a",
          color: "#eee",
          border: "1px solid #444",
          borderRadius: 6,
        }}
      >
        {node.label}
      </div>
    ),
  },
  render(args) {
    return (
      <div
        style={{
          height: 600,
          background: "#121212",
          padding: 20,
        }}
      >
        <MultiTree {...args} />
      </div>
    );
  },
};

// 懒加载示例
const MockDataList3 = getMockDataList();
export const LazyLoading: Story = {
  name: "子节点懒加载 | 虚线",
  args: {
    treeList: MockDataList3,
    fetchChildTree: fetchChildren,
    renderCard(node) {
      if (!node._height_) {
        node._height_ = getNodeHeight();
      }
      if (node.isVirtual) {
        return (
          <div
            style={{
              padding: 10,
              border: "1px dashed #888",
              background: "#f9f9f9",
              color: "#666",
              borderRadius: 2,
              height: node._height_
            }}
          >
            {node.label} (虚线节点)
          </div>
        );
      }
      return (
        <div
          style={{
            padding: 10,
            background: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: 2,
            height: node._height_
          }}
        >
          {node.label}
        </div>
      );
    },
  },
  render(args) {
    return (
      <div style={{ height: 600 }}>
        <MultiTree {...args} />
      </div>
    );
  },
};
