import { apiRequest } from './client';
import type { CookingSession, PageResult } from './types';

const sessionPath = (sessionId: string) =>
  '/cooking-sessions/' + encodeURIComponent(sessionId);

export const startCookingSession = (token: string, recipeId: string) =>
  apiRequest<CookingSession>('/cooking-sessions', {
    method: 'POST',
    token,
    body: { recipeId },
  });

export const listCookingSessions = (token: string) =>
  apiRequest<PageResult<CookingSession>>('/cooking-sessions?size=10', { token });

export const getCookingSession = (token: string, sessionId: string) =>
  apiRequest<CookingSession>(sessionPath(sessionId), { token });

export const pauseCookingSession = (token: string, session: CookingSession) =>
  apiRequest<CookingSession>(sessionPath(session.sessionId) + '/pause', {
    method: 'POST',
    token,
    body: { contextRevision: session.contextRevision },
  });

export const resumeCookingSession = (token: string, session: CookingSession) =>
  apiRequest<CookingSession>(sessionPath(session.sessionId) + '/resume', {
    method: 'POST',
    token,
    body: { contextRevision: session.contextRevision },
  });

export const cancelCookingSession = (token: string, session: CookingSession) =>
  apiRequest<CookingSession>(sessionPath(session.sessionId) + '/cancel', {
    method: 'POST',
    token,
    body: { contextRevision: session.contextRevision },
  });

export function confirmCurrentStep(token: string, session: CookingSession) {
  if (!session.currentStep) throw new Error('A sessão não possui uma etapa atual.');
  return apiRequest<CookingSession>(sessionPath(session.sessionId) + '/confirm-step', {
    method: 'POST',
    token,
    body: {
      stepId: session.currentStep.id,
      contextRevision: session.contextRevision,
      confirmed: true,
    },
  });
}

