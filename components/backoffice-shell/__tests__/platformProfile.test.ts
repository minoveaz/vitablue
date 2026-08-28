import { describe, expect, it } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { getPlatformUserInitials, getPlatformUserName } from '../platformProfile';

describe('Platform profile identity', () => {
  it('prefers a display name from user metadata and derives initials', () => {
    const user = {
      email: 'ana@vitablue.es',
      user_metadata: { full_name: 'Ana García' },
    } as unknown as User;

    expect(getPlatformUserName(user)).toBe('Ana García');
    expect(getPlatformUserInitials('Ana García')).toBe('AG');
  });

  it('falls back to the email and stable initials when metadata has no name', () => {
    const user = {
      email: 'editor@vitablue.es',
      user_metadata: {},
    } as unknown as User;

    expect(getPlatformUserName(user)).toBe('editor@vitablue.es');
    expect(getPlatformUserInitials('editor@vitablue.es')).toBe('ED');
    expect(getPlatformUserInitials('')).toBe('VB');
  });
});
