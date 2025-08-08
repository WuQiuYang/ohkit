import { describe, expect, it } from '@jest/globals';
import { assignRef } from '../index';

describe('utils', () => {
  it('should export utilities', () => {
    expect(assignRef).toBeDefined();
  });
});