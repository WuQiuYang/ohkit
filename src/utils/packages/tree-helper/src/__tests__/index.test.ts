import { describe, expect, it } from '@jest/globals';
import { dfsTree } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(dfsTree).toBeDefined();
  });
});