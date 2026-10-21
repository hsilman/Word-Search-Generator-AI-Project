export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PageFormat = 'letter' | 'a4' | 'kdp6x9';

export type SolutionsPerPage = 2 | 4;

export type TitlePageStyle = 'classic' | 'modern' | 'ornate';

export interface DirectionVector {
  dr: number;
  dc: number;
  name: string;
}

export interface PlacedWord {
  word: string;
  cleanWord: string;
  start: { r: number; c: number };
  end: { r: number; c: number };
  direction: string;
  cells: { r: number; c: number }[];
}

export interface WordSearchPuzzle {
  id: string;
  puzzleNumber: number;
  title: string;
  category: string;
  gridSize: number;
  grid: string[][];
  placedWords: PlacedWord[];
  unplacedWords: string[];
  allWords: string[];
  difficulty: DifficultyLevel;
}

export interface BookSettings {
  title: string;
  subtitle: string;
  authorName: string;
  puzzleCount: number;
  wordsPerPuzzle: number;
  gridSize: number;
  difficulty: DifficultyLevel;
  pageFormat: PageFormat;
  includeIntro: boolean;
  includeTableOfContents: boolean;
  solutionsPerPage: SolutionsPerPage;
  titleStyle: TitlePageStyle;
  showCheckboxes: boolean;
  customTopicsText: string;
  footerText: string;
}

export interface TopicPreset {
  id: string;
  name: string;
  description: string;
  topics: { title: string; words: string[] }[];
}
