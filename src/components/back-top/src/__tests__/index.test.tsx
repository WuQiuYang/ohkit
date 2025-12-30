import React from 'react';
import { render } from '@testing-library/react';
import { BackTop } from '../index';

describe('BackTop', () => {
  it('renders correctly', () => {
    const { container } = render(<BackTop />);
    expect(container.firstChild).toMatchSnapshot();
  });
});