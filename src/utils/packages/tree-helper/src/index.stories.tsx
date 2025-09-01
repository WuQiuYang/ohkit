import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
// import { sync as syncVisitTree } from "@moyuyc/visit-tree";
import {MDPlayground} from '../../../../components/md-playground';

import { dfsTree } from './';

interface DfsTreeProps {
    // todo add
    breakNodeId?: number;
    skipNodeId?: number;
    data?: IMockTree | IMockTree[];
    createCtx?: boolean;
}
interface IMockTree {
    id: number;
    name: string;
    children?: IMockTree[];
}
const mockDataList: IMockTree[] = [
  {
    id: 1,
    name: 'node-1',
    children: [
      { id: 2, name: 'node-1-1'},
      { id: 3, name: 'node-1-2', children: [{id: 20, name: 'node-1-1-1'}]  },
    ],
  },
  {
    id: 4,
    name: 'node-2',
    children: [],
  },
];
function cloneData(params: object) {
  return JSON.parse(JSON.stringify(params));
}
const DfsTreeDemo = (props: DfsTreeProps) => {
  const {breakNodeId, skipNodeId, data = mockDataList, createCtx = true} = props;
  const [dfsLog, setDfsLog] = useState('');
  // const [dfsLog1, setDfsLog1] = useState('');
  useEffect(() => {
    let log = '';
    dfsTree(data, (node, ctx) => {
      console.log(node, ctx);
      if (!ctx) {
        log += `=> node: ${node.name}\n`;
        if (breakNodeId === node.id) {
          return true;
        }
        return;
      }
      log += `=> node: ${node.name}, ctx-depth: ${ctx.depth}, ctx-index: ${ctx.index}, ctx-paths: ${ctx.paths.join('-')}\n`;
      if (breakNodeId === node.id) {
        ctx.break();
      }
      else if (skipNodeId === node.id) {
        ctx.skip();
      }
    }, {
      needCtx: createCtx,
    });
    setDfsLog(log);

    // let log1 = '';
    // const dataList = Array.isArray(data) ? data : [data];
    // dataList.forEach(data => {
    //   syncVisitTree(data, (node, ctx) => {
    //     console.log(node, ctx);
    //     log1 += `node: ${node.name}, ctx-depth: ${ctx.depth}, ctx-index: ${ctx.index}, ctx-paths: ${ctx.paths.join('-')}\n`;
    //     if (breakNodeId === node.id) {
    //       ctx.break();
    //     } 
    //     else if (skipNodeId === node.id) {
    //       ctx.skip();
    //     }
    //   });
    // });
    // setDfsLog1(log1);
  }, [breakNodeId, skipNodeId, data, createCtx]);
  return <div>
    data:
    <MDPlayground>
      {'```ts\n' +
      JSON.stringify(data, null, 2)
      + '\n```'}
    </MDPlayground>
    dfsTree exec log:
    <pre>
      {dfsLog}
    </pre>
    {/* syncVisitTreeDemo:
    <pre>
      {dfsLog1}
    </pre> */}
  </div>;
}

const meta = {
  component: DfsTreeDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof DfsTreeDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // add props
    data: cloneData(mockDataList),
  },
};
export const SingleRoot: Story = {
  args: {
    // add props
    data: cloneData(mockDataList[0]),
  },
};
export const Break: Story = {
  args: {
    // add props
    breakNodeId: 3,
    data: cloneData(mockDataList),
  },
};
export const Skip: Story = {
  args: {
    // add props
    skipNodeId: 3,
    data: cloneData(mockDataList),
  },
};
