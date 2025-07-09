import { describe, expect, it } from '@jest/globals';
import { auto-reporter } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(auto-reporter).toBeDefined();
  });
});