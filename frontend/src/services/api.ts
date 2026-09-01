const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export interface OnboardingItem {
  _id: string;
  titulo: string;
  concluida: boolean;
}

export interface OnboardingEtapa {
  _id: string;
  titulo: string;
  periodo: string;
  itens: OnboardingItem[];
}

export interface OnboardingProcess {
  _id: string;
  colaboradorNome: string;
  colaboradorEmail: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  etapas: OnboardingEtapa[];
}

export type OnboardingItemInput = Pick<OnboardingItem, 'titulo' | 'concluida'>;
export type OnboardingEtapaInput = Pick<OnboardingEtapa, 'titulo' | 'periodo'> & {
  itens: OnboardingItemInput[];
};
export type OnboardingProcessInput = Pick<
  OnboardingProcess,
  'colaboradorNome' | 'colaboradorEmail' | 'cargo' | 'departamento' | 'dataAdmissao'
> & {
  etapas: OnboardingEtapaInput[];
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error('Falha na comunicação com a API');
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export function fetchOnboardingProcesses(): Promise<OnboardingProcess[]> {
  return fetch(`${API_BASE_URL}/onboarding-processes`).then((r) =>
    handleResponse<OnboardingProcess[]>(r)
  );
}

export function fetchOnboardingProcess(id: string): Promise<OnboardingProcess> {
  return fetch(`${API_BASE_URL}/onboarding-processes/${id}`).then((r) =>
    handleResponse<OnboardingProcess>(r)
  );
}

export function createOnboardingProcess(
  data: OnboardingProcessInput
): Promise<OnboardingProcess> {
  return fetch(`${API_BASE_URL}/onboarding-processes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => handleResponse<OnboardingProcess>(r));
}

export function updateOnboardingProcess(
  id: string,
  data: OnboardingProcessInput
): Promise<OnboardingProcess> {
  return fetch(`${API_BASE_URL}/onboarding-processes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((r) => handleResponse<OnboardingProcess>(r));
}

export function deleteOnboardingProcess(id: string): Promise<void> {
  return fetch(`${API_BASE_URL}/onboarding-processes/${id}`, {
    method: 'DELETE',
  }).then((r) => handleResponse<void>(r));
}

export function toggleOnboardingItem(
  processId: string,
  etapaId: string,
  itemId: string,
  concluida: boolean
): Promise<OnboardingProcess> {
  return fetch(
    `${API_BASE_URL}/onboarding-processes/${processId}/etapas/${etapaId}/itens/${itemId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concluida }),
    }
  ).then((r) => handleResponse<OnboardingProcess>(r));
}
