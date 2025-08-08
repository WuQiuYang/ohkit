import { describe, expect, it } from '@jest/globals';
import { prefixClassname } from '../index';

describe('prefixClassname', () => {
  it('should add prefix to direct string arguments', () => {
    const prefix = prefixClassname('prefix-');
    expect(prefix('btn')).toBe('prefix-btn');
    expect(prefix('btn', 'active')).toBe('prefix-btn prefix-active');
  });

  it('should not add prefix to classNames processed arguments', () => {
    const prefix = prefixClassname('prefix-');
    expect(prefix({ btn: true, active: false })).toBe('prefix-btn');
    expect(prefix(['btn', { active: true }])).toBe('prefix-btn prefix-active');
  });

  it('should handle empty values', () => {
    const prefix = prefixClassname('prefix-');
    expect(prefix('', undefined, null, false)).toBe('prefix-');
  });

  it('should support multi-level prefix for direct strings', () => {
    const componentPrefix = prefixClassname('comp-');
    const themePrefix = prefixClassname('theme-');
    expect(themePrefix(componentPrefix('button'))).toBe('theme-comp-button');
  });
});