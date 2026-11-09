import { apiRequest } from './client';
import type { Recipe, RecipeSummary } from './types';

export const listRecipes = (token: string) =>
  apiRequest<RecipeSummary[]>('/recipes', { token });

export const getRecipe = (token: string, recipeId: string) =>
  apiRequest<Recipe>('/recipes/' + encodeURIComponent(recipeId), { token });

