export type AnvilAction = 'punch' | 'bend' | 'upset' | 'shrink' | 'hit_light' | 'hit_medium' | 'hit_hard' | 'draw';

export const ACTION_ICONS: Record<AnvilAction, string> = {
  punch: 'assets/punch.png',
  bend: 'assets/bend.png',
  upset: 'assets/upset.png',
  shrink: 'assets/shrink.png',
  hit_light: 'assets/hit1.png',
  hit_medium: 'assets/hit2.png',
  hit_hard: 'assets/hit3.png',
  draw: 'assets/draw.png',
};

export const ACTION_LABELS: Record<AnvilAction, string> = {
  punch: 'Punch',
  bend: 'Bend',
  upset: 'Upset',
  shrink: 'Shrink',
  hit_light: 'Light Hit',
  hit_medium: 'Medium Hit',
  hit_hard: 'Hard Hit',
  draw: 'Draw',
};

export interface Category {
  id: string;
  name: string;
}

export interface AnvilRecipe {
  id: string;
  name: string;
  steps: AnvilAction[];
  targetValue?: number;
  categoryId?: string;
}

export interface ExportData {
  recipes: AnvilRecipe[];
  categories: Category[];
}
