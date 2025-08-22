import type { Meta, StoryObj } from '@storybook/react';
import { MultiTree } from './index';
import { MockDataList } from './__tests__/mock-data';

const meta: Meta<typeof MultiTree> = {
  // title: 'Components/MultiTree',
  component: MultiTree,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiTree<typeof MockDataList[number] & {_height_?: number}>>;

const heightRange = [40, 60, 100, 150, 200];
export const Default: Story = {
  args: {
    treeList: MockDataList,
  },
  render(args) {
    return <div style={{height: 600}}><MultiTree {...args} /></div>;
  }
};

const MockDataListClone = JSON.parse(JSON.stringify(MockDataList));
export const RandomNodeHight: Story = {
  args: {
    treeList: MockDataListClone,
    renderCard(node) {
      if (!node._height_) {
        node._height_ = heightRange[Math.floor(Math.random() * 10 / 2)];
      }
      return (
        <div
          style={{
            height: node._height_,
            backgroundColor: "pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {node.label}
        </div>
      );
    }
  },
  render(args) {
    return <div style={{height: 600}}><MultiTree {...args} /></div>;
  }
};