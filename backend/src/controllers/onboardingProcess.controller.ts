import { Request, Response } from 'express';
import { OnboardingProcess } from '../models/onboardingProcess.model';

export async function listOnboardingProcesses(_req: Request, res: Response) {
  const processes = await OnboardingProcess.find().sort({ createdAt: -1 });
  res.json(processes);
}

export async function getOnboardingProcess(req: Request, res: Response) {
  const process = await OnboardingProcess.findById(req.params.id);
  if (!process) {
    return res.status(404).json({ message: 'Processo de onboarding não encontrado' });
  }
  res.json(process);
}

export async function createOnboardingProcess(req: Request, res: Response) {
  const process = await OnboardingProcess.create(req.body);
  res.status(201).json(process);
}

export async function updateOnboardingProcess(req: Request, res: Response) {
  const process = await OnboardingProcess.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!process) {
    return res.status(404).json({ message: 'Processo de onboarding não encontrado' });
  }
  res.json(process);
}

export async function deleteOnboardingProcess(req: Request, res: Response) {
  const process = await OnboardingProcess.findByIdAndDelete(req.params.id);
  if (!process) {
    return res.status(404).json({ message: 'Processo de onboarding não encontrado' });
  }
  res.status(204).send();
}

export async function toggleOnboardingItem(req: Request, res: Response) {
  const { id, etapaId, itemId } = req.params;
  const { concluida } = req.body as { concluida: boolean };

  const process = await OnboardingProcess.findById(id);
  if (!process) {
    return res.status(404).json({ message: 'Processo de onboarding não encontrado' });
  }

  const etapa = process.etapas.id(etapaId);
  if (!etapa) {
    return res.status(404).json({ message: 'Etapa não encontrada' });
  }

  const item = etapa.itens.id(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item não encontrado' });
  }

  item.concluida = concluida;
  await process.save();
  res.json(process);
}
