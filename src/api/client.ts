import { fetch as expoFetch } from 'expo/fetch';
import { ApiResponse } from './types';

const REQUEST_TIMEOUT_MS = 10000;

export class ApiClientError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = 'CLIENT_ERROR', status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

export function getBaseApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!envUrl || envUrl.trim() === '') {
    throw new ApiClientError(
      'A variável de ambiente EXPO_PUBLIC_API_URL não está configurada. Configure a origem do backend no arquivo .env.',
      'CONFIG_MISSING'
    );
  }

  // Remove barras finais duplicadas e anexa /api/v1
  const sanitized = envUrl.trim().replace(/\/+$/, '');
  return `${sanitized}/api/v1`;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown | FormData;
  token?: string | null;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  // Para FormData, não definir Content-Type manualmente para que o boundary seja adicionado automaticamente
  if (!isFormData && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  let requestBody: any = undefined;
  if (isFormData) {
    requestBody = options.body;
  } else if (options.body !== undefined) {
    requestBody = JSON.stringify(options.body);
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Usa expoFetch para FormData (suporte a File no Android) e fetch nativo para JSON
  const fetchFn = isFormData ? (expoFetch as unknown as typeof fetch) : fetch;

  let response: Response;
  try {
    response = await fetchFn(url, {
      method: options.method || 'GET',
      headers,
      body: requestBody,
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new ApiClientError(
          'O servidor demorou muito para responder. Tempo limite de conexão excedido.',
          'TIMEOUT',
          504
        );
      }
    }
    throw new ApiClientError(
      'Não foi possível conectar ao servidor. Verifique se o backend está ligado e acessível na rede local.',
      'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Tratamento da resposta
  let json: ApiResponse<T> | null = null;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    if (!response.ok) {
      if (response.status === 413) {
        throw new ApiClientError(
          'O tamanho dos arquivos enviados excedeu o limite aceito pelo servidor.',
          'PAYLOAD_TOO_LARGE',
          413
        );
      }
      throw new ApiClientError(
        `O servidor retornou um erro inesperado (${response.status} ${response.statusText}).`,
        'SERVER_ERROR',
        response.status
      );
    }
    throw new ApiClientError('Resposta inválida do servidor.', 'INVALID_RESPONSE', response.status);
  }

  if (json.error) {
    throw new ApiClientError(json.error.message, json.error.code, response.status);
  }

  if (!response.ok) {
    throw new ApiClientError(
      `Falha na requisição com código ${response.status}.`,
      'HTTP_ERROR',
      response.status
    );
  }

  if (json.data === null || json.data === undefined) {
    return {} as T;
  }

  return json.data;
}
