import { describe, expect, it } from '@jest/globals';
import { sse } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(sse).toBeDefined();
  });
});