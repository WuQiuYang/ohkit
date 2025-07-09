import { describe, expect, it } from '@jest/globals';
import { prefixClassname } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(prefixClassname).toBeDefined();
  });
});