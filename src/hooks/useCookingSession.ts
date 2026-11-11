import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  cancelCookingSession,
  confirmCurrentStep,
  getCookingSession,
  listCookingSessions,
  pauseCookingSession,
  resumeCookingSession,
} from '@/api/cooking';
import { SessionView } from '@/api/types';
import { ApiClientError } from '@/api/client';

const POLLING_INTERVAL_MS = 3000;

export interface UseCookingSessionOptions {
  sessionId?: string;
  isFocused?: boolean;
}

export function useCookingSession({
  sessionId: initialSessionId,
  isFocused = true,
}: UseCookingSessionOptions = {}) {
  const { token, logout } = useAuth();

  const [session, setSession] = useState<SessionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  // Guarda o sessionId ativo
  const activeSessionIdRef = useRef<string | undefined>(initialSessionId);
  const isPollingRef = useRef(false);
  const sessionRef = useRef<SessionView | null>(null);

  // Atualiza refs dentro de effect
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (initialSessionId) {
      activeSessionIdRef.current = initialSessionId;
    }
  }, [initialSessionId]);

  // 1. Busca inicial ou recuperação de sessão ativa/pausada
  const fetchSession = useCallback(async () => {
    if (!token) return;

    try {
      setError(null);
      let targetId = activeSessionIdRef.current;

      // Se nenhum sessionId foi passado, procura a sessão mais recente ACTIVE ou PAUSED
      if (!targetId) {
        const page = await listCookingSessions(token, 0, 10);
        const openSession = page.items.find(
          (s) => s.status === 'ACTIVE' || s.status === 'PAUSED'
        );

        if (openSession) {
          targetId = openSession.sessionId;
          activeSessionIdRef.current = targetId;
        } else {
          setSession(null);
          setIsLoading(false);
          return;
        }
      }

      const fetched = await getCookingSession(token, targetId);
      setSession(fetched);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 401) {
          await logout();
          return;
        }
        setError(err.message);
      } else {
        setError('Não foi possível carregar a sessão de preparo.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  // Carrega na montagem ou quando o sessionId mudar
  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!token) return;
      try {
        setError(null);
        let targetId = activeSessionIdRef.current;

        if (!targetId) {
          const page = await listCookingSessions(token, 0, 10);
          const openSession = page.items.find(
            (s) => s.status === 'ACTIVE' || s.status === 'PAUSED'
          );

          if (openSession) {
            targetId = openSession.sessionId;
            activeSessionIdRef.current = targetId;
          } else {
            if (isMounted) {
              setSession(null);
              setIsLoading(false);
            }
            return;
          }
        }

        const fetched = await getCookingSession(token, targetId);
        if (isMounted) {
          setSession(fetched);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof ApiClientError && err.status === 401) {
            await logout();
            return;
          }
          setError('Não foi possível carregar a sessão de preparo.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [token, logout, initialSessionId]);

  // 2. Polling silencioso a cada 3s quando focado e não terminal
  const sessionStatus = session?.status;
  useEffect(() => {
    if (!isFocused || !token || !sessionStatus) return;

    const isTerminal = sessionStatus === 'COMPLETED' || sessionStatus === 'CANCELLED';
    if (isTerminal) return;

    const timer = setInterval(async () => {
      const targetId = activeSessionIdRef.current;
      if (!targetId || isPollingRef.current || isPerformingAction) return;

      try {
        isPollingRef.current = true;
        setIsSyncing(true);

        const updated = await getCookingSession(token, targetId);
        setSession((prev) => {
          if (!prev) return updated;
          if (
            prev.contextRevision !== updated.contextRevision ||
            prev.status !== updated.status ||
            prev.completedSteps !== updated.completedSteps ||
            prev.latestObservation?.observationId !== updated.latestObservation?.observationId
          ) {
            return updated;
          }
          return prev;
        });
      } catch (err: unknown) {
        if (err instanceof ApiClientError && err.status === 401) {
          await logout();
        }
      } finally {
        isPollingRef.current = false;
        setIsSyncing(false);
      }
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isFocused, token, sessionStatus, isPerformingAction, logout]);

  // 3. Helper de tratamento de erros com suporte a 409 (conflito de revisão)
  const handleActionError = useCallback(
    async (err: unknown, defaultMsg: string): Promise<void> => {
      if (err instanceof ApiClientError) {
        if (err.status === 401) {
          await logout();
          return;
        }
        if (err.status === 409) {
          setActionError(
            'O estado da etapa foi atualizado por outro evento. Sincronizando dados mais recentes...'
          );
          if (token && activeSessionIdRef.current) {
            try {
              const fresh = await getCookingSession(token, activeSessionIdRef.current);
              setSession(fresh);
            } catch {
              // ignora erro secundário
            }
          }
          return;
        }
        setActionError(err.message);
      } else {
        setActionError(defaultMsg);
      }
    },
    [token, logout]
  );

  // 4. Pausar sessão
  const pauseSession = useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current;
    if (!token || !current || isPerformingAction) return false;

    try {
      setIsPerformingAction(true);
      setActionError(null);
      const updated = await pauseCookingSession(
        token,
        current.sessionId,
        current.contextRevision
      );
      setSession(updated);
      return true;
    } catch (err) {
      await handleActionError(err, 'Não foi possível pausar o preparo.');
      return false;
    } finally {
      setIsPerformingAction(false);
    }
  }, [token, isPerformingAction, handleActionError]);

  // 5. Retomar sessão
  const resumeSession = useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current;
    if (!token || !current || isPerformingAction) return false;

    try {
      setIsPerformingAction(true);
      setActionError(null);
      const updated = await resumeCookingSession(
        token,
        current.sessionId,
        current.contextRevision
      );
      setSession(updated);
      return true;
    } catch (err) {
      await handleActionError(err, 'Não foi possível retomar o preparo.');
      return false;
    } finally {
      setIsPerformingAction(false);
    }
  }, [token, isPerformingAction, handleActionError]);

  // 6. Cancelar sessão
  const cancelSession = useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current;
    if (!token || !current || isPerformingAction) return false;

    try {
      setIsPerformingAction(true);
      setActionError(null);
      const updated = await cancelCookingSession(
        token,
        current.sessionId,
        current.contextRevision
      );
      setSession(updated);
      return true;
    } catch (err) {
      await handleActionError(err, 'Não foi possível cancelar o preparo.');
      return false;
    } finally {
      setIsPerformingAction(false);
    }
  }, [token, isPerformingAction, handleActionError]);

  // 7. Confirmar etapa atual (avanço explícito)
  const confirmStep = useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current;
    if (!token || !current || !current.currentStep || isPerformingAction) return false;

    try {
      setIsPerformingAction(true);
      setActionError(null);
      const updated = await confirmCurrentStep(
        token,
        current.sessionId,
        current.currentStep.id,
        current.contextRevision
      );
      setSession(updated);
      return true;
    } catch (err) {
      await handleActionError(err, 'Não foi possível confirmar a etapa.');
      return false;
    } finally {
      setIsPerformingAction(false);
    }
  }, [token, isPerformingAction, handleActionError]);

  return {
    session,
    isLoading,
    isSyncing,
    error,
    actionError,
    isPerformingAction,
    pauseSession,
    resumeSession,
    cancelSession,
    confirmStep,
    refresh: fetchSession,
    clearActionError: () => setActionError(null),
    setSession,
  };
}
