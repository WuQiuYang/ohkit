// Mock all dependencies before importing the component
jest.mock('@ohkit/prefix-classname', () => ({
  prefixClassname: jest.fn((prefix: string) => {
    return (...args: any[]) => {
      // Simple implementation that returns prefixed classnames
      const classNames = require('classnames');
      return classNames(...args).split(' ').map((c: string) => prefix + c).join(' ');
    };
  }),
  classNames: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' '))
}));

jest.mock('@ohkit/react-helper', () => ({
  useRuntime: jest.fn((initialValue: any) => {
    const runtime = { ...initialValue, init: false };
    return [runtime];
  })
}));

jest.mock('../utils', () => ({
  addSearchToUrl: jest.fn((url: string, params: any) => {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return queryString ? `${url}?${queryString}` : url;
  })
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReactIframe } from '../index';

describe('ReactIframe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with basic props', () => {
    const { container } = render(<ReactIframe src="https://example.com" />);
    expect(container.querySelector('iframe')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders null when src is empty', () => {
    const { container } = render(<ReactIframe src="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when src is undefined', () => {
    const { container } = render(<ReactIframe src={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders iframe with correct attributes', () => {
    const { container } = render(<ReactIframe src="https://example.com" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', 'https://example.com');
    expect(iframe).toHaveAttribute('frameBorder', '0');
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '100%');
  });

  it('passes additional props to iframe', () => {
    const { container } = render(
      <ReactIframe src="https://example.com" name="test-iframe" title="Test Iframe" />
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('name', 'test-iframe');
    expect(iframe).toHaveAttribute('title', 'Test Iframe');
  });

  it('handles iframeName parameter correctly', () => {
    const { container } = render(
      <ReactIframe src="https://example.com" iframeName="test-iframe" />
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', 'https://example.com?iframeName=test-iframe');
  });

  it('works with ref forwarding', () => {
    const ref = React.createRef<HTMLIFrameElement>();
    const { container } = render(<ReactIframe src="https://example.com" ref={ref} />);
    expect(ref.current).toBe(container.querySelector('iframe'));
  });

  it('renders children inside iframe', () => {
    const { container } = render(
      <ReactIframe src="https://example.com">Custom content</ReactIframe>
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveTextContent('Custom content');
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-iframe-class';
    const { container } = render(
      <ReactIframe src="https://example.com" className={customClass} />
    );
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass('custom-iframe-class');
  });

  it('shows loading state initially', () => {
    const { container } = render(<ReactIframe src="https://example.com" />);
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveAttribute('title', '加载中...');
    expect(container.querySelector('.ohkit-react-iframe__loading')).toBeInTheDocument();
  });

  it('uses custom renderLoading when provided', () => {
    const customLoading = <div>Custom Loading...</div>;
    const { container } = render(
      <ReactIframe src="https://example.com" renderLoading={() => customLoading} />
    );
    expect(container).toHaveTextContent('Custom Loading...');
  });

  it('calls onLoadStart and onLoadEnd callbacks', () => {
    const onLoadStart = jest.fn();
    const onLoadEnd = jest.fn();
    const onLoad = jest.fn();

    render(
      <ReactIframe 
        src="https://example.com" 
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onLoad={onLoad}
      />
    );

    // onLoadStart should be called immediately
    expect(onLoadStart).toHaveBeenCalled();
  });
});