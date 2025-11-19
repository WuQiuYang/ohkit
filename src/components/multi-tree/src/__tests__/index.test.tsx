import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MultiTree } from '../';
import { MockDataList } from '../__mock__';

// Mock dom-helper module
jest.mock('@ohkit/dom-helper', () => ({
  addClass: jest.fn((dom, className) => {
    dom.classList.add(className);
    return () => dom.classList.remove(className);
  }),
  addEventListener: jest.fn((element, type, listener) => {
    element.addEventListener(type, listener);
    return () => element.removeEventListener(type, listener);
  }),
  scrollIntoViewIfNeeded: jest.fn()
}));

describe('MultiTree', () => {
  const testData = MockDataList;

  it('renders without crashing', () => {
    const { container } = render(<MultiTree treeList={testData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders root nodes correctly', () => {
    render(<MultiTree treeList={testData} />);
    testData.forEach(node => {
      expect(screen.getByText(node.label, { exact: false })).toBeInTheDocument();
    });
  });

  it('accepts and applies custom className', () => {
    const customClass = 'custom-tree';
    render(<MultiTree treeList={testData} className={customClass} />);
    expect(document.querySelector('.custom-tree')).toBeInTheDocument();
  });

  it('renders custom node via renderCard prop', () => {
    const customRender = (node: any) => (
      <div data-testid={`custom-node-${node.id}`}>{node.label}</div>
    );
    render(<MultiTree treeList={testData} renderCard={customRender} />);
    testData.forEach(node => {
      expect(screen.getByTestId(`custom-node-${node.id}`)).toBeInTheDocument();
    });
  });

  it('expands and collapses nodes', async () => {
    const { container } = render(<MultiTree treeList={testData} />);
    
    // Find left expand button
    const leftExpandButton = container.querySelector('.ohkit-multi-tree__toggle-btn');
    if (!leftExpandButton) throw new Error('Expand button not found');
    
    // Initial state should show child count
    expect(leftExpandButton.textContent).toContain('3');
    
    // Click to expand
    fireEvent.click(leftExpandButton);
    
    // Verify expanded state - button should show fold icon
    await waitFor(() => {
      expect(leftExpandButton.querySelector('.icon-fold')).toBeInTheDocument();
    });
    
    // Click again to collapse
    fireEvent.click(leftExpandButton);
    
    // Verify collapsed state - button should show child count again
    await waitFor(() => {
      expect(leftExpandButton.textContent).toContain('3');
    });
  });
});