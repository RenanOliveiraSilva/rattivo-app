import { apiRequest } from './client';
import {
  ConfirmStepRequest,
  PageView,
  RevisionRequest,
  SessionView,
  StartSessionRequest,
} from './types';

/**
 * Lista as sessões de preparo do usuário autenticado.
 */
export async function listCookingSessions(
  token: string,
  page = 0,
  size = 20
): Promise<PageView<SessionView>> {
  return apiRequest<PageView<SessionView>>(`/cooking-sessions?page=${page}&size=${size}`, {
    method: 'GET',
    token,
  });
}

/**
 * Inicia uma nova sessão de preparo para a receita indicada.
 */
export async function startCookingSession(
  token: string,
  recipeId: string
): Promise<SessionView> {
  const body: StartSessionRequest = { recipeId };
  return apiRequest<SessionView>('/cooking-sessions', {
    method: 'POST',
    token,
    body,
  });
}

/**
 * Consulta o estado atualizado da sessão de preparo, etapa e última orientação.
 */
export async function getCookingSession(
  token: string,
  sessionId: string
): Promise<SessionView> {
  return apiRequest<SessionView>(`/cooking-sessions/${sessionId}`, {
    method: 'GET',
    token,
  });
}

/**
 * Pausa uma sessão ativa.
 */
export async function pauseCookingSession(
  token: string,
  sessionId: string,
  contextRevision: number
): Promise<SessionView> {
  const body: RevisionRequest = { contextRevision };
  return apiRequest<SessionView>(`/cooking-sessions/${sessionId}/pause`, {
    method: 'POST',
    token,
    body,
  });
}

/**
 * Retoma uma sessão pausada.
 */
export async function resumeCookingSession(
  token: string,
  sessionId: string,
  contextRevision: number
): Promise<SessionView> {
  const body: RevisionRequest = { contextRevision };
  return apiRequest<SessionView>(`/cooking-sessions/${sessionId}/resume`, {
    method: 'POST',
    token,
    body,
  });
}

/**
 * Cancela uma sessão de preparo.
 */
export async function cancelCookingSession(
  token: string,
  sessionId: string,
  contextRevision: number
): Promise<SessionView> {
  const body: RevisionRequest = { contextRevision };
  return apiRequest<SessionView>(`/cooking-sessions/${sessionId}/cancel`, {
    method: 'POST',
    token,
    body,
  });
}

/**
 * Confirma a conclusão humana da etapa atual.
 * A última confirmação conclui a sessão no backend.
 */
export async function confirmCurrentStep(
  token: string,
  sessionId: string,
  stepId: string,
  contextRevision: number
): Promise<SessionView> {
  const body: ConfirmStepRequest = {
    stepId,
    contextRevision,
    confirmed: true,
  };
  return apiRequest<SessionView>(`/cooking-sessions/${sessionId}/confirm-step`, {
    method: 'POST',
    token,
    body,
  });
}

