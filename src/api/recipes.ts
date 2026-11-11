import { apiRequest } from './client';
import { RecipeSummary, RecipeView } from './types';

/**
 * Consulta a lista de receitas disponíveis no catálogo.
 */
export async function listRecipes(token: string): Promise<RecipeSummary[]> {
  return apiRequest<RecipeSummary[]>('/recipes', {
    method: 'GET',
    token,
  });
}

/**
 * Consulta os detalhes completos de uma receita específica, incluindo ingredientes e etapas.
 */
export async function getRecipe(token: string, recipeId: string): Promise<RecipeView> {
  return apiRequest<RecipeView>(`/recipes/${recipeId}`, {
    method: 'GET',
    token,
  });
}

