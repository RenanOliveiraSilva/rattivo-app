import { File } from 'expo-file-system';
import { apiRequest, ApiClientError } from './client';
import { FridgeAnalysisView } from './types';
import { SelectedIngredientPhoto } from '@/types/ingredient-photo';

const MAX_PHOTOS = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MiB

const ACCEPTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function resolveMimeType(photo: SelectedIngredientPhoto): string {
  if (photo.mimeType) {
    const normalized = photo.mimeType.toLowerCase();
    if (normalized === 'image/jpg') return 'image/jpeg';
    return normalized;
  }

  // Inferência por extensão do URI ou fileName
  const source = (photo.fileName || photo.uri).toLowerCase();
  if (source.endsWith('.png')) return 'image/png';
  if (source.endsWith('.webp')) return 'image/webp';
  if (source.endsWith('.jpg') || source.endsWith('.jpeg')) return 'image/jpeg';
  if (source.endsWith('.gif')) return 'image/gif';
  if (source.endsWith('.heic')) return 'image/heic';

  // Por padrão, fotos de câmera capturadas no app são JPEG
  return 'image/jpeg';
}

/**
 * Envia de 1 a 3 fotos para o endpoint autenticado de análise da geladeira.
 * Utiliza instâncias File do expo-file-system para upload multipart compatível com Android.
 */
export async function analyzeFridgePhotos(
  token: string,
  photos: SelectedIngredientPhoto[]
): Promise<FridgeAnalysisView> {
  if (!photos || photos.length === 0) {
    throw new ApiClientError('Selecione ao menos 1 foto para realizar a análise.', 'INVALID_REQUEST', 400);
  }

  if (photos.length > MAX_PHOTOS) {
    throw new ApiClientError('Envie no máximo 3 fotos para análise.', 'INVALID_REQUEST', 400);
  }

  const formData = new FormData();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const mime = resolveMimeType(photo);

    if (!ACCEPTED_MIME_TYPES.has(mime)) {
      throw new ApiClientError(
        `Formato não suportado na foto #${i + 1}. Utilize fotos em formato JPEG, PNG ou WebP.`,
        'INVALID_REQUEST',
        400
      );
    }

    if (photo.fileSize && photo.fileSize > MAX_FILE_BYTES) {
      throw new ApiClientError(
        `A foto #${i + 1} excede o limite máximo permitido de 5 MiB.`,
        'PAYLOAD_TOO_LARGE',
        413
      );
    }

    // Cria a instância File do expo-file-system a partir do URI local
    const file = new File(photo.uri);

    const uriScheme = photo.uri.includes(':') ? photo.uri.split(':')[0] : 'file';
    console.warn('[fridge-upload]', {
      message: `Foto #${i + 1} anexada para análise`,
      name: file.name || `photo_${i + 1}`,
      uriScheme,
    });

    // Anexa a instância File à chave repetida 'photos'
    formData.append('photos', file as unknown as Blob);
  }

  // Timeout estendido para 30 segundos conforme especificação
  return apiRequest<FridgeAnalysisView>('/fridge-analyses', {
    method: 'POST',
    body: formData,
    token,
    timeoutMs: 30000,
  });
}
