import type { ApiEnvelope } from './types';

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const apiBaseUrl = configuredUrl?.replace(/\/+$/, '') ?? '';

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  token?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiClientError(
      0,
      'CONFIGURATION',
      'Configure EXPO_PUBLIC_API_URL no arquivo .env e reinicie o Expo.',
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(apiBaseUrl + '/api/v1' + path, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.token ? { Authorization: 'Bearer ' + options.token } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });
    let envelope: ApiEnvelope<T>;
    try {
      envelope = (await response.json()) as ApiEnvelope<T>;
    } catch {
      throw new ApiClientError(
        response.status,
        'INVALID_RESPONSE',
        'O backend retornou uma resposta que o aplicativo não reconhece.',
      );
    }
    if (!response.ok || envelope.error) {
      throw new ApiClientError(
        response.status,
        envelope.error?.code ?? 'HTTP_ERROR',
        envelope.error?.message ?? 'Não foi possível concluir a solicitação.',
      );
    }
    if (envelope.data === null) {
      throw new ApiClientError(response.status, 'EMPTY_RESPONSE', 'O backend não retornou os dados esperados.');
    }
    return envelope.data;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiClientError(0, 'TIMEOUT', 'O backend demorou para responder.');
    }
    throw new ApiClientError(
      0,
      'NETWORK',
      'Não foi possível alcançar o backend. Confira a URL, a rede e o health check.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

