import React, { createContext, useContext, useState } from 'react';
import { SelectedIngredientPhoto } from '@/types/ingredient-photo';

export interface IngredientPhotosContextData {
  photos: SelectedIngredientPhoto[];
  addPhoto: (photo: Omit<SelectedIngredientPhoto, 'id'>) => boolean;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  canAddMore: boolean;
  photoCount: number;
}

const MAX_PHOTOS = 3;

const IngredientPhotosContext = createContext<IngredientPhotosContextData>(
  {} as IngredientPhotosContextData
);

export const IngredientPhotosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<SelectedIngredientPhoto[]>([]);

  const addPhoto = (photoData: Omit<SelectedIngredientPhoto, 'id'>): boolean => {
    if (photos.length >= MAX_PHOTOS) {
      return false;
    }

    // Evitar duplicar a mesma foto acidentalmente
    const exists = photos.some((p) => p.uri === photoData.uri);
    if (exists) {
      return false;
    }

    const newPhoto: SelectedIngredientPhoto = {
      ...photoData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    setPhotos((prev) => [...prev, newPhoto]);
    return true;
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  return (
    <IngredientPhotosContext.Provider
      value={{
        photos,
        addPhoto,
        removePhoto,
        clearPhotos,
        canAddMore: photos.length < MAX_PHOTOS,
        photoCount: photos.length,
      }}
    >
      {children}
    </IngredientPhotosContext.Provider>
  );
};

export function useIngredientPhotos(): IngredientPhotosContextData {
  const context = useContext(IngredientPhotosContext);
  if (!context) {
    throw new Error(
      'useIngredientPhotos deve ser utilizado dentro de um IngredientPhotosProvider'
    );
  }
  return context;
}

