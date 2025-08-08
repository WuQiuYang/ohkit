import { describe, expect, it } from '@jest/globals';
import { jsonHelper } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(jsonHelper).toBeDefined();
  });
});