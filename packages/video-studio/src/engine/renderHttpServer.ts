import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import type { VideoFormat, VideoProject } from '../domain/videoProject';
import { LocalRenderJobApi } from './localRenderJobApi';

const readJson = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
};

const sendJson = (response: ServerResponse, status: number, body: unknown): void => {
  response.statusCode = status;
  response.setHeader('content-type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
};

const isProject = (value: unknown): value is VideoProject => (
  typeof value === 'object' && value !== null && 'id' in value && 'scenes' in value
);

export interface RenderHttpServerOptions {
  api: LocalRenderJobApi;
  host?: string;
  port?: number;
}

export interface RenderHttpServer {
  server: Server;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export const createRenderHttpServer = (options: RenderHttpServerOptions): RenderHttpServer => {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const match = url.pathname.match(/^\/render-jobs(?:\/([^/]+))?(\/cancel|\/artifact)?$/);
      if (!match) return sendJson(response, 404, { error: 'Not found.' });

      const jobId = match[1];
      if (request.method === 'GET' && jobId && match[2] === '/artifact') {
        const job = options.api.get(jobId);
        if (!job) return sendJson(response, 404, { error: 'Render job not found.' });
        if (job.status !== 'completed' || !job.outputPath) {
          return sendJson(response, 409, { error: 'Render artifact is not ready.' });
        }
        response.statusCode = 200;
        response.setHeader('content-type', 'video/mp4');
        response.setHeader('content-disposition', `attachment; filename="${job.outputFileName}"`);
        return createReadStream(options.api.resolveArtifact(jobId)).pipe(response);
      }
      if (request.method === 'POST' && !jobId) {
        const body = await readJson(request) as { project?: unknown; format?: VideoFormat };
        if (!isProject(body.project)) return sendJson(response, 400, { error: 'A valid project is required.' });
        const job = options.api.create(body.project, body.format);
        void options.api.run(job.id).catch(() => undefined);
        return sendJson(response, 202, job);
      }
      if (request.method === 'GET' && jobId) {
        const job = options.api.get(jobId);
        return job ? sendJson(response, 200, job) : sendJson(response, 404, { error: 'Render job not found.' });
      }
      if (request.method === 'POST' && jobId && match[2] === '/cancel') {
        return sendJson(response, 200, options.api.cancel(jobId));
      }
      return sendJson(response, 405, { error: 'Method not allowed.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Render request failed.';
      return sendJson(response, 400, { error: message });
    }
  });

  return {
    server,
    start: () => new Promise((resolve) => server.listen(options.port ?? 8787, options.host ?? '127.0.0.1', resolve)),
    stop: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
};