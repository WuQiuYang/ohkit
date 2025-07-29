import type { Meta, StoryObj } from '@storybook/react';

import { MDPlayground } from './index';

const meta = {
  component: MDPlayground,
} satisfies Meta<typeof MDPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // theme: 'materialDark',
    children:
    '## Markdown渲染\n``` typescript' +
`
  import React from 'react';
  // import { Button } from 'antd';
  import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  const demo = () => {
    const CodeComponent = () => {
      return (
        <SyntaxHighlighter language="jsx" style={coldarkDark}>
          {'xxx'}
        </SyntaxHighlighter>
      );
    };
    return <CodeComponent />;
  };
` +
    '```',

  }
};