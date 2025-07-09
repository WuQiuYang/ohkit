import { describe, expect, it } from '@jest/globals';
import { platform } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(platform).toBeDefined();
  });
});