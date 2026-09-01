import { Router } from 'express';
import { onboardingProcessRouter } from './onboardingProcess.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }));
apiRouter.use('/onboarding-processes', onboardingProcessRouter);
