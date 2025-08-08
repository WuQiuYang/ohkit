import { describe, expect, it } from '@jest/globals';
import { PromisePipe } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(PromisePipe).toBeDefined();
  });
});