import type { User } from '@supabase/supabase-js';

export const getPlatformUserName = (user: User | null): string => {
  const metadata = user?.user_metadata;
  const metadataName = [metadata?.full_name, metadata?.name, metadata?.display_name]
    .find((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return metadataName?.trim() ?? user?.email ?? 'Usuario autenticado';
};

export const getPlatformUserInitials = (label: string): string => {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'VB';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};
