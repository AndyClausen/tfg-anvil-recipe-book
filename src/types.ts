export type AnvilAction = 'punch' | 'bend' | 'upset' | 'shrink' | 'hit' | 'draw';

export const ACTION_ICONS: Record<AnvilAction, string> = {
  punch: '/assets/punch.png',
  bend: '/assets/bend.png',
  upset: '/assets/upset.png',
  shrink: '/assets/shrink.png',
  hit: '/assets/hit.png',
  draw: '/assets/draw.png',
};

export interface AnvilRecipe {
  id: string;
  name: string;
  steps: AnvilAction[];
  targetValue?: number;
}
