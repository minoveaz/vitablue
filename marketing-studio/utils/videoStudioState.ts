import type { CreativeStudioEditorState } from '../../components/backoffice-shell/contracts/creativeStudioShell';
import type { RenderJobStatus } from '../../packages/video-studio/src/engine/renderJobs';

export const getVideoStudioEditorState = (
  isOffline: boolean,
  renderError: string | null,
  renderStatus?: RenderJobStatus,
): CreativeStudioEditorState => {
  if (isOffline) return 'offline';
  if (renderError || renderStatus === 'failed' || renderStatus === 'cancelled') return 'error';
  if (renderStatus === 'pending') return 'saving';
  if (renderStatus === 'rendering') return 'rendering';
  return 'saved';
};

export const getVideoStudioStatusMessage = (
  renderError: string | null,
  renderJobError?: string,
  renderStatus?: RenderJobStatus,
): string | undefined =>
  renderError
  ?? renderJobError
  ?? (renderStatus === 'cancelled' ? 'El render fue cancelado.' : undefined);
