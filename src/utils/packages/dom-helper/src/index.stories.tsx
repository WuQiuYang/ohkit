import type { Meta, StoryObj } from "@storybook/react";
// import {useState, useEffect} from 'react';

import { hexToRgba, rgbaToHex } from ".";

interface DomHelperProps {
  // todo add
  hex?: string;
  rgba?: string;
}
const DomHelperDemo = (props: DomHelperProps) => {
  const { hex, rgba } = props;
  return (
    <div>
      Demo:
      <hr />
      <div>hexToRgba: {hex ? `${hex} => ${hexToRgba(hex)}` : null}</div>
      <hr />
      <div>rgbaToHex: {rgba ? `${rgba} => ${rgbaToHex(rgba)}` : null}</div>
    </div>
  );
};

const meta = {
  component: DomHelperDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof DomHelperDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // add props
    hex: '#1cfcd380',
    rgba: 'rgba(28, 252, 211, 0.5)',
  },
};
