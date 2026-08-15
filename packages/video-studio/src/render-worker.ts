import { createLocalRenderExecutor } from './engine/localRenderExecutor';
import { LocalRenderJobApi } from './engine/localRenderJobApi';
import { createRenderHttpServer } from './engine/renderHttpServer';

const start = async () => {
  const api = new LocalRenderJobApi({ executor: createLocalRenderExecutor() });
  const httpApi = createRenderHttpServer({ api, port: Number(process.env.RENDER_WORKER_PORT ?? 8787) });

  await httpApi.start();
  console.log(`Video render worker listening on http://127.0.0.1:${process.env.RENDER_WORKER_PORT ?? 8787}`);

  const shutdown = async () => {
    await httpApi.stop();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
};

void start();