export interface SelectedIngredientPhoto {
  id: string;
  uri: string;
  width?: number;
  height?: number;
  timestamp?: number;
  source: 'camera' | 'gallery';
}
