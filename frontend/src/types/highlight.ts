export type HighlightType = 'added' | 'assigned' | 'edited' | null;
export type HighlightedItem = {
  id: number;
  type: HighlightType;
} | null;