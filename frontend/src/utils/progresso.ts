import { OnboardingEtapa, OnboardingProcess } from '../services/api';

export type StatusEtapa = 'nao_iniciado' | 'em_andamento' | 'concluido';

export const STATUS_LABEL: Record<StatusEtapa, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export function contarItensEtapa(etapa: OnboardingEtapa) {
  const total = etapa.itens.length;
  const concluidos = etapa.itens.filter((item) => item.concluida).length;
  return { concluidos, total };
}

export function statusEtapa(etapa: OnboardingEtapa): StatusEtapa {
  const { concluidos, total } = contarItensEtapa(etapa);
  if (total === 0 || concluidos === 0) return 'nao_iniciado';
  if (concluidos === total) return 'concluido';
  return 'em_andamento';
}

export function contarItensProcesso(processo: OnboardingProcess) {
  return processo.etapas.reduce(
    (acc, etapa) => {
      const { concluidos, total } = contarItensEtapa(etapa);
      return { concluidos: acc.concluidos + concluidos, total: acc.total + total };
    },
    { concluidos: 0, total: 0 }
  );
}

export function contarEtapasConcluidas(processo: OnboardingProcess) {
  const concluidas = processo.etapas.filter((etapa) => statusEtapa(etapa) === 'concluido').length;
  return { concluidas, total: processo.etapas.length };
}

export function statusProcesso(processo: OnboardingProcess): StatusEtapa {
  const { concluidos, total } = contarItensProcesso(processo);
  if (total === 0 || concluidos === 0) return 'nao_iniciado';
  if (concluidos === total) return 'concluido';
  return 'em_andamento';
}

export function diasDeOnboarding(dataAdmissao: string) {
  const inicio = new Date(dataAdmissao);
  const hoje = new Date();
  const diffMs = hoje.setHours(0, 0, 0, 0) - inicio.setHours(0, 0, 0, 0);
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(dias, 0);
}
