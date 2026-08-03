import { SocialPlatformId } from '@/utils/socialProfiles';

export interface ConnectionState {
  connected: boolean;
  username?: string;
  connectedAt?: string;
  expiresAt?: string;
}

export type SocialConnections = Record<SocialPlatformId, ConnectionState>;

const storageKey = 'vitablue.social-connections';

const defaultConnections: SocialConnections = {
  facebook: { connected: false },
  instagram: { connected: false },
  tiktok: { connected: false },
  youtube: { connected: false },
  linkedin: { connected: false },
  x: { connected: false },
};

/**
 * Loads connection status from LocalStorage.
 */
export const getConnections = (): SocialConnections => {
  if (typeof window === 'undefined') return defaultConnections;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultConnections;
    return { ...defaultConnections, ...JSON.parse(stored) };
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
export const disconnectPlatform = (platform: SocialPlatformId): SocialConnections => {
  const current = getConnections();
  const next = {
    ...current,
    [platform]: { connected: false }
  };
  saveConnections(next);
  return next;
};

/**
 * Triggers OAuth 2.0 flow redirection for the selected network.
 * Uses local dev keys if provided, redirects back to dev workspace.
 */
export const startPlatformOAuth = (platform: SocialPlatformId): void => {
  if (typeof window === 'undefined') return;
  
  const redirectUri = encodeURIComponent('http://localhost:5173/marketing-studio/conexiones');
  let authUrl = '';

  switch (platform) {
    case 'linkedin':
      // LinkedIn OAuth V2
      const liClientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'dummy_linkedin_id';
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${liClientId}&redirect_uri=${redirectUri}&scope=w_member_social%20r_liteprofile&state=linkedin_vitablue`;
      break;

    case 'facebook':
    case 'instagram':
      // Meta OAuth
      const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'dummy_facebook_id';
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=pages_manage_posts%2Cpages_read_engagement%2Cinstagram_basic%2Cinstagram_content_publish&state=meta_vitablue`;
      break;

    case 'youtube':
      // Google OAuth V2
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_google_id';
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&state=google_vitablue&access_type=offline&prompt=consent`;
      break;

    case 'x':
      // X (Twitter) OAuth 2.0
      const xClientId = import.meta.env.VITE_X_API_KEY || 'dummy_x_id';
      authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${xClientId}&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=x_vitablue&code_challenge=challenge&code_challenge_method=plain`;
      break;

    case 'tiktok':
      // TikTok OAuth
      authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=dummy_tiktok_key&scope=user.info.basic,video.publish,video.list&response_type=code&redirect_uri=${redirectUri}&state=tiktok_vitablue`;
      break;
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
  code: string
): Promise<{ success: boolean; username?: string; error?: string }> => {
  try {
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
    saveConnections(next);

    return { success: true, username: mockUsername };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
