import { describe, expect, it } from '@jest/globals';
import { Debug } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(Debug).toBeDefined();
  });
});