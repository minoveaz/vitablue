import type { VideoFormat, VideoProject } from '../domain/videoProject';
import type { RenderJob } from './renderJobs';

export interface RenderHttpClientOptions {
  baseUrl?: string;
  fetcher?: typeof fetch;
}

export const createRenderHttpClient = (options: RenderHttpClientOptions = {}) => {
  const baseUrl = options.baseUrl ?? '/render-jobs';
  const fetcher = options.fetcher ?? fetch;

  const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetcher(url, {
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
    });
    const body = await response.json() as T | { error?: string };
    if (!response.ok) throw new Error(typeof body === 'object' && body && 'error' in body ? body.error : 'Render request failed.');
    return body as T;
  };

  return {
    create(project: VideoProject, format?: VideoFormat) {
      return request<RenderJob>(baseUrl, { method: 'POST', body: JSON.stringify({ project, format }) });
    },
    get(id: string) {
      return request<RenderJob>(`${baseUrl}/${encodeURIComponent(id)}`);
    },
    cancel(id: string) {
      return request<RenderJob>(`${baseUrl}/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
    },
  };
};