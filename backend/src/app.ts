import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes';

export function createApp(corsOrigin: string) {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());
  app.use('/api', apiRouter);

  return app;
}
