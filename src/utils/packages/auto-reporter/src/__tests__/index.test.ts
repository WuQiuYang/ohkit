import { describe, expect, it } from '@jest/globals';
import { AutoReporter } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(AutoReporter).toBeDefined();
  });
});