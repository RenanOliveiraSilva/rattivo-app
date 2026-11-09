export type ApiErrorBody = { code: string; message: string };
export type ApiEnvelope<T> = { data: T | null; error: ApiErrorBody | null };
export type User = { id: string; displayName: string; email: string; role: 'USER' };
export type AuthResult = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
};
export type Ingredient = { name: string; quantity: string };
export type RecipeStep = {
  id: string;
  number: number;
  instruction: string;
  visualCheck: string;
  requiresConfirmation: boolean;
};
export type RecipeSummary = { id: string; name: string; description: string };
export type Recipe = RecipeSummary & {
  preparationNotes: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
};
export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type Assessment =
  | 'IN_PROGRESS'
  | 'NEEDS_ADJUSTMENT'
  | 'READY_FOR_CONFIRMATION'
  | 'INCONCLUSIVE';
export type Observation = {
  observationId: string;
  stepId: string;
  contextRevision: number;
  capturedAt: string;
  receivedAt: string;
  assessment: Assessment;
  observation: string;
  guidance: string;
};
export type Confirmation = { stepId: string; number: number; confirmedAt: string };
export type CookingSession = {
  sessionId: string;
  recipeId: string;
  recipeName: string;
  status: SessionStatus;
  contextRevision: number;
  currentStep: RecipeStep | null;
  totalSteps: number;
  completedSteps: number;
  confirmations: Confirmation[];
  latestObservation: Observation | null;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
};
export type PageResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

