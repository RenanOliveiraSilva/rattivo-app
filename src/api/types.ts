export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface UserView {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserView;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ==========================================
// Tipos de Receitas
// ==========================================

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface RecipeStep {
  id: string;
  number: number;
  instruction: string;
  visualCheck: string;
  requiresConfirmation: boolean;
}

export interface RecipeSummary {
  id: string;
  name: string;
  description: string;
}

export interface RecipeView {
  id: string;
  name: string;
  description: string;
  preparationNotes: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

// ==========================================
// Tipos de Sessão de Preparo (Cooking)
// ==========================================

export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type Assessment =
  | 'IN_PROGRESS'
  | 'NEEDS_ADJUSTMENT'
  | 'READY_FOR_CONFIRMATION'
  | 'INCONCLUSIVE';

export interface ObservationView {
  observationId: string;
  stepId: string;
  contextRevision: number;
  capturedAt: string;
  receivedAt: string;
  assessment: Assessment;
  observation: string;
  guidance: string;
}

export interface ConfirmationView {
  stepId: string;
  number: number;
  confirmedAt: string;
}

export interface SessionView {
  sessionId: string;
  recipeId: string;
  recipeName: string;
  status: SessionStatus;
  contextRevision: number;
  currentStep: RecipeStep | null;
  totalSteps: number;
  completedSteps: number;
  confirmations: ConfirmationView[];
  latestObservation: ObservationView | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
}

export interface PageView<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StartSessionRequest {
  recipeId: string;
}

export interface RevisionRequest {
  contextRevision: number;
}

export interface ConfirmStepRequest {
  stepId: string;
  contextRevision: number;
  confirmed: boolean;
}

// ==========================================
// Tipos de Análise da Geladeira (Task 05)
// ==========================================

export type IngredientConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DetectedFridgeIngredient {
  name: string;
  confidence: IngredientConfidence;
}

export interface FridgeRecipeRecommendation {
  recipeId: string;
  name: string;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}

export interface FridgeAnalysisView {
  ingredients: DetectedFridgeIngredient[];
  recommendations: FridgeRecipeRecommendation[];
  warnings: string[];
}
