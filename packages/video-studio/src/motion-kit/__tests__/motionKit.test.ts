import { describe, it, expect } from 'vitest';
import { MOTION_KIT_REGISTRY } from '../motionRegistry';
import { defaultMotionBrandTokens } from '../types';

describe('MotionKit Registry & Tokens', () => {
  it('registers all 4 core agnostic motion components', () => {
    expect(MOTION_KIT_REGISTRY).toHaveLength(4);
    const ids = MOTION_KIT_REGISTRY.map((c) => c.id);
    expect(ids).toContain('MotionAdvisorCard');
    expect(ids).toContain('MotionTrustBadge');
    expect(ids).toContain('MotionProviderGrid');
    expect(ids).toContain('MotionComparisonCard');
  });

  it('provides default props for each registered component', () => {
    MOTION_KIT_REGISTRY.forEach((component) => {
      expect(component.name).toBeTruthy();
      expect(component.description).toBeTruthy();
      expect(component.category).toBeTruthy();
      expect(component.defaultProps).toBeDefined();
      expect(Object.keys(component.defaultProps).length).toBeGreaterThan(0);
    });
  });

  it('contains valid default brand tokens for white-label use', () => {
    expect(defaultMotionBrandTokens.primaryColor).toBe('#005F73');
    expect(defaultMotionBrandTokens.accentColor).toBe('#EE9B00');
    expect(defaultMotionBrandTokens.mintColor).toBe('#94D2BD');
    expect(defaultMotionBrandTokens.surfaceBg).toBe('#001219');
  });
});
