import { SocialPlatformId } from '@/utils/socialProfiles';
import { supabase } from './supabaseClient';

export interface ConnectionState {
  connected: boolean;
  externalAccountId?: string;
  username?: string;
  connectedAt?: string;
  expiresAt?: string;
}

export type SocialConnections = Record<SocialPlatformId, ConnectionState>;
export type Connections = SocialConnections;

const storageKey = 'vitablue.social-connections';

const defaultConnections: SocialConnections = {
  facebook: { connected: false },
  instagram: { connected: false },
  tiktok: { connected: false },
  youtube: { connected: false },
  linkedin: { connected: false },
  x: { connected: false },
};

export const syncConnectionsWithSupabase = async (): Promise<SocialConnections> => {
  const { data, error } = await supabase
    .from('oauth_connections')
    .select('provider, external_account_id, display_name, expires_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase OAuth connections fetch failed, using local fallback:', error.message);
    return getConnections();
  }

  const next: SocialConnections = {
    ...defaultConnections,
  };
  for (const connection of data ?? []) {
    const provider = connection.provider as SocialPlatformId;
    if (!(provider in next)) continue;
    next[provider] = {
      connected: true,
      externalAccountId: connection.external_account_id,
      username: connection.display_name ?? undefined,
      connectedAt: connection.created_at ?? undefined,
      expiresAt: connection.expires_at ?? undefined,
    };
    if (provider === 'facebook') next.instagram = { ...next[provider] };
  }
  saveConnections(next);
  return next;
};

/**
 * Loads connection status from LocalStorage.
 */
export const getConnections = (): SocialConnections => {
  if (typeof window === 'undefined') return defaultConnections;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultConnections;
    const connections = { ...defaultConnections, ...JSON.parse(stored) } as SocialConnections;

    if (connections.facebook.connected || connections.instagram.connected) {
      connections.facebook = { ...connections.facebook, connected: true };
      connections.instagram = { ...connections.instagram, connected: true };
    }

    return connections;
  } catch {
    return defaultConnections;
  }
};

/**
 * Saves connection status to LocalStorage.
 */
export const saveConnections = (connections: SocialConnections): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(connections));
  } catch (err) {
    console.error('Error saving social connections locally:', err);
  }
};

/**
 * Clears connection for a social network.
 */
export const disconnectPlatform = async (platform: SocialPlatformId): Promise<SocialConnections> => {
  const current = getConnections();
  const provider = platform === 'instagram' ? 'facebook' : platform;
  const externalAccountId = current[platform].externalAccountId;
  if (externalAccountId) {
    const { error } = await supabase.functions.invoke('oauth-disconnect', {
      body: { provider, externalAccountId },
    });
    if (error) {
      console.error('Could not disconnect OAuth connection:', error.message);
      throw new Error(error.message);
    }
  }
  const next = {
    ...current,
    [platform]: { connected: false }
  };
  if (platform === 'facebook' || platform === 'instagram') {
    next.facebook = { connected: false };
    next.instagram = { connected: false };
  }
  saveConnections(next);
  return next;
};

/**
 * Triggers OAuth 2.0 flow redirection for the selected network.
 * Uses local dev keys if provided, redirects back to dev workspace.
 */
export const startPlatformOAuth = async (platform: SocialPlatformId): Promise<void> => {
  if (typeof window === 'undefined') return;

  const state = crypto.randomUUID();
  window.sessionStorage.setItem('vitablue.oauth.provider', platform);
  const stateDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(state));
  const stateHash = Array.from(new Uint8Array(stateDigest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const { error: stateError } = await supabase.rpc('register_oauth_state', {
    p_provider: platform,
    p_state_hash: stateHash,
  });
  if (stateError) {
    console.error('Could not register OAuth state:', stateError.message);
    return;
  }
  
  const redirectUri = encodeURIComponent(`${window.location.origin}/backoffice/marketing-studio/conexiones`);
  let authUrl = '';

  switch (platform) {
    case 'linkedin': {
      // LinkedIn OAuth V2
      const liClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'dummy_linkedin_id';
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${liClientId}&redirect_uri=${redirectUri}&scope=w_member_social%20r_liteprofile&state=${encodeURIComponent(state)}`;
      break;
    }

    case 'facebook':
    case 'instagram': {
      // Meta OAuth
      const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'dummy_facebook_id';
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=pages_manage_posts%2Cpages_read_engagement%2Cinstagram_basic%2Cinstagram_content_publish&state=${encodeURIComponent(state)}`;
      break;
    }

    case 'youtube': {
      // Google OAuth V2
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_google_id';
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&state=${encodeURIComponent(state)}&access_type=offline&prompt=consent`;
      break;
    }

    case 'x': {
      // X (Twitter) OAuth 2.0
      const xClientId = import.meta.env.VITE_X_API_KEY || 'dummy_x_id';
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${xClientId}&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${encodeURIComponent(state)}&code_challenge=challenge&code_challenge_method=plain`;
      break;
    }

    case 'tiktok': {
      // TikTok OAuth
      const tiktokClientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY || 'dummy_tiktok_key';
      authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${tiktokClientKey}&scope=user.info.basic,video.publish,video.list&response_type=code&redirect_uri=${redirectUri}&state=${encodeURIComponent(state)}`;
      break;
    }
  }

  // Open the auth popup or redirect
  if (authUrl) {
    window.location.href = authUrl;
  }
};

/**
 * Process the callback authorization code received from the URL redirect.
 * In a real implementation, this performs the server-side code-to-token swap using Vite local proxy.
 */
export const handleOAuthCallback = async (
  platform: SocialPlatformId,
  code: string,
  state?: string,
): Promise<{ success: boolean; username?: string; error?: string }> => {
  try {
    if ((platform === 'facebook' || platform === 'instagram') && state) {
      const redirectUri = `${window.location.origin}/backoffice/marketing-studio/conexiones`;
      const { data, error } = await supabase.functions.invoke('oauth-callback', {
        body: { provider: platform, code, redirectUri, state },
      });
      if (error || data?.error) return { success: false, error: error?.message ?? data.error };

      const current = getConnections();
      saveConnections({
        ...current,
        [platform]: {
          connected: true,
          externalAccountId: data.accountId,
          username: data.displayName ?? data.accountId,
          connectedAt: new Date().toLocaleDateString(),
          expiresAt: data.expiresAt ?? undefined,
        },
      });
      return { success: true, username: data.displayName ?? data.accountId };
    }

    console.log(`Swapping OAuth code on local proxy for platform: ${platform}, code: ${code}`);

    // Standard simulation of exchanging code for token in local dev environment
    // Under normal circumstances, you'd fetch('/api/linkedin/accessToken', { method: 'POST', ... })
    // We will save a mock active connection locally since it's a simulated local workspace.
    
    let mockUsername = '@vitablueseguros';
    if (platform === 'facebook') mockUsername = 'Página VitaBlue';
    if (platform === 'linkedin') mockUsername = 'VitaBlue Seguros (Company)';

    const current = getConnections();
    const next = {
      ...current,
      [platform]: {
        connected: true,
        username: mockUsername,
        connectedAt: new Date().toLocaleDateString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString() // 60 days
      }
    };

    if (platform === 'facebook') {
      next.instagram = {
        connected: true,
        username: '@vitablue_seguros',
        connectedAt: new Date().toLocaleDateString(),
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
    }

    saveConnections(next);

    return { success: true, username: mockUsername };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'No se pudo conectar la cuenta.' };
  }
};
