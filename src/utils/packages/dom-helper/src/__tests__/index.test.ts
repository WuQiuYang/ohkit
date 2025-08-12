import { describe, expect, it } from '@jest/globals';
import { mixRgbaToRgbWithXbg } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(mixRgbaToRgbWithXbg).toBeDefined();
  });
});