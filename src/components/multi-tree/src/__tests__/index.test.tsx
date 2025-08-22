import React from 'react';
import { render } from '@testing-library/react';
import { MultiTree } from '../index';

describe('MultiTree', () => {
  it('renders without crashing', () => {
    const testData = [{
        id: 1,
        label: 'Test Node'
    }];
    render(<MultiTree treeList={testData} />);
    // Just test that it renders without throwing
    expect(true).toBeTruthy();
  });
});