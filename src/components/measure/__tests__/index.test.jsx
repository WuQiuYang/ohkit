const React = require('react');
const { render } = require('@testing-library/react');
const { Measure } = require('../src/measure');
const { describe, it, expect } = require('@jest/globals');

describe('Measure component', () => {
  it('should render children with measure props', () => {
    const mockChildren = jest.fn(() => null);
    render(<Measure>{mockChildren}</Measure>);
    
    expect(mockChildren).toHaveBeenCalledWith(
      expect.objectContaining({
        measure: expect.any(Function),
        measureRef: expect.any(Function),
        contentRect: expect.any(Object)
      })
    );
  });

  it('should return null when no children provided', () => {
    const { container } = render(<Measure />);
    expect(container.firstChild).toBeNull();
  });
});
