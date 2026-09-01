import { Router } from 'express';
import {
  listOnboardingProcesses,
  getOnboardingProcess,
  createOnboardingProcess,
  updateOnboardingProcess,
  deleteOnboardingProcess,
  toggleOnboardingItem,
} from '../controllers/onboardingProcess.controller';

export const onboardingProcessRouter = Router();

onboardingProcessRouter.get('/', listOnboardingProcesses);
onboardingProcessRouter.get('/:id', getOnboardingProcess);
onboardingProcessRouter.post('/', createOnboardingProcess);
onboardingProcessRouter.put('/:id', updateOnboardingProcess);
onboardingProcessRouter.delete('/:id', deleteOnboardingProcess);
onboardingProcessRouter.patch('/:id/etapas/:etapaId/itens/:itemId', toggleOnboardingItem);
