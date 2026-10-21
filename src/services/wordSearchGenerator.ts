import { 
  DifficultyLevel, 
  DirectionVector, 
  PlacedWord, 
  WordSearchPuzzle, 
  BookSettings 
} from '../types/wordSearch';
import { BUILT_IN_TOPICS, resolveSeedToSubtopics } from '../data/topicLibrary';

// Letter frequency weights based on English language distribution for natural puzzle filler
const WEIGHTED_LETTERS = 'EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNSSSSSSRRRRRRTTTTTTHHHHHHDDDDCCCLLLUMMFFGGYYPPBVKJXQZ';

const DIRECTIONS: Record<DifficultyLevel, DirectionVector[]> = {
  easy: [
    { dr: 0, dc: 1, name: 'Horizontal (Right)' },
    { dr: 1, dc: 0, name: 'Vertical (Down)' }
  ],
  medium: [
    { dr: 0, dc: 1, name: 'Horizontal (Right)' },
    { dr: 1, dc: 0, name: 'Vertical (Down)' },
    { dr: 1, dc: 1, name: 'Diagonal (Down-Right)' }
  ],
  hard: [
    { dr: 0, dc: 1, name: 'Horizontal (Right)' },
    { dr: 0, dc: -1, name: 'Horizontal (Left)' },
    { dr: 1, dc: 0, name: 'Vertical (Down)' },
    { dr: -1, dc: 0, name: 'Vertical (Up)' },
    { dr: 1, dc: 1, name: 'Diagonal (Down-Right)' },
    { dr: 1, dc: -1, name: 'Diagonal (Down-Left)' },
    { dr: -1, dc: 1, name: 'Diagonal (Up-Right)' },
    { dr: -1, dc: -1, name: 'Diagonal (Up-Left)' }
  ]
};

/**
 * Clean and uppercase word, removing any non-alpha characters.
 */
export function cleanWord(raw: string): string {
  return raw.replace(/[^A-Za-z]/g, '').toUpperCase();
}

/**
 * Get random filler character
 */
function getRandomLetter(): string {
  const idx = Math.floor(Math.random() * WEIGHTED_LETTERS.length);
  return WEIGHTED_LETTERS[idx];
}

/**
 * Shuffle an array in place
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a single word search puzzle
 */
export function generateSinglePuzzle(
  puzzleNumber: number,
  title: string,
  category: string,
  wordPool: string[],
  targetWordCount: number,
  gridSize: number,
  difficulty: DifficultyLevel
): WordSearchPuzzle {
  const directions = DIRECTIONS[difficulty];
  
  // Clean, filter by length (must fit within grid dimension) and deduplicate
  const cleanPool = Array.from(new Set(
    wordPool
      .map(w => ({ original: w.trim().toUpperCase(), clean: cleanWord(w) }))
      .filter(item => item.clean.length >= 3 && item.clean.length <= gridSize)
  ));

  // Pick target number of words from the pool
  const selectedCandidates = shuffle(cleanPool).slice(0, Math.min(targetWordCount + 4, cleanPool.length));
  
  // Sort descending by length to place longer words first
  selectedCandidates.sort((a, b) => b.clean.length - a.clean.length);

  // Initialize empty grid
  const grid: string[][] = Array.from({ length: gridSize }, () => 
    Array.from({ length: gridSize }, () => '')
  );

  const placedWords: PlacedWord[] = [];
  const unplacedWords: string[] = [];

  for (const candidate of selectedCandidates) {
    if (placedWords.length >= targetWordCount) {
      break;
    }

    const word = candidate.clean;
    let placed = false;
    const maxAttempts = 350;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      
      // Calculate allowable start bounds
      const minR = dir.dr < 0 ? word.length - 1 : 0;
      const maxR = dir.dr > 0 ? gridSize - word.length : gridSize - 1;
      const minC = dir.dc < 0 ? word.length - 1 : 0;
      const maxC = dir.dc > 0 ? gridSize - word.length : gridSize - 1;

      if (maxR < minR || maxC < minC) continue;

      const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
      const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

      // Check if word can fit without conflicting existing cells
      let canPlace = true;
      const cells: { r: number; c: number }[] = [];

      for (let i = 0; i < word.length; i++) {
        const r = startR + i * dir.dr;
        const c = startC + i * dir.dc;
        const currentChar = grid[r][c];

        if (currentChar !== '' && currentChar !== word[i]) {
          canPlace = false;
          break;
        }
        cells.push({ r, c });
      }

      if (canPlace) {
        // Place letters on grid
        for (let i = 0; i < word.length; i++) {
          const { r, c } = cells[i];
          grid[r][c] = word[i];
        }

        const endCell = cells[cells.length - 1];
        placedWords.push({
          word: candidate.original,
          cleanWord: word,
          start: { r: startR, c: startC },
          end: { r: endCell.r, c: endCell.c },
          direction: dir.name,
          cells
        });
        placed = true;
        break;
      }
    }

    if (!placed) {
      unplacedWords.push(candidate.original);
    }
  }

  // Fill empty spaces with weighted random letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = getRandomLetter();
      }
    }
  }

  // Sort placed words alphabetically for user display in word bank
  placedWords.sort((a, b) => a.word.localeCompare(b.word));

  return {
    id: `puzzle-${puzzleNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    puzzleNumber,
    title,
    category,
    gridSize,
    grid,
    placedWords,
    unplacedWords,
    allWords: placedWords.map(p => p.word),
    difficulty
  };
}

/**
 * Generate full collection of puzzles for the book based on settings.
 * Accepts optional AI-generated subtopics or resolves seed keywords dynamically.
 */
export function generateBookPuzzles(
  settings: BookSettings,
  resolvedSubtopics?: { title: string; category?: string; words: string[] }[]
): WordSearchPuzzle[] {
  const puzzles: WordSearchPuzzle[] = [];
  const requestedCount = Math.max(1, Math.min(settings.puzzleCount, 100));

  // Use provided AI subtopics, or resolve seed keywords dynamically
  const subtopics = resolvedSubtopics && resolvedSubtopics.length > 0
    ? resolvedSubtopics.slice(0, requestedCount)
    : resolveSeedToSubtopics(settings.customTopicsText, requestedCount);

  for (let i = 0; i < subtopics.length; i++) {
    const topic = subtopics[i];
    
    // Ensure words pool is large enough for target wordsPerPuzzle
    let words = [...topic.words];
    if (words.length < settings.wordsPerPuzzle + 4) {
      words = enrichKeywordTopic(topic.title, words);
    }

    const puzzle = generateSinglePuzzle(
      i + 1,
      topic.title,
      topic.category || 'Word Search',
      words,
      settings.wordsPerPuzzle,
      settings.gridSize,
      settings.difficulty
    );

    puzzles.push(puzzle);
  }

  return puzzles;
}

/**
 * Intelligent client-side vocabulary enricher for custom topics
 */
function enrichKeywordTopic(keyword: string, existingWords: string[] = []): string[] {
  const result = new Set<string>(existingWords.map(w => w.toUpperCase()));
  const kw = keyword.toLowerCase();

  // Find partial matches across built-in topics to harvest related vocabulary
  for (const topic of BUILT_IN_TOPICS) {
    if (topic.title.toLowerCase().includes(kw) || kw.includes(topic.title.toLowerCase())) {
      topic.words.forEach(w => result.add(w.toUpperCase()));
    }
  }

  // Domain associations dictionary
  const DOMAIN_SEEDS: Record<string, string[]> = {
    nature: ['WILDLIFE', 'SUNLIGHT', 'MEADOW', 'RIVER', 'MOUNTAIN', 'VALLEY', 'CANOPY', 'WILDERNESS', 'BLOSSOM', 'STREAM', 'FOREST', 'EARTH', 'BREEZE'],
    ocean: ['PACIFIC', 'ATLANTIC', 'CURRENTS', 'TRENCH', 'ABYSS', 'LAGOON', 'CORAL', 'WAVES', 'SUBMARINE', 'NAUTICAL', 'MARITIME', 'TIDE', 'SHORELINE'],
    animal: ['HABITAT', 'PREDATOR', 'CARNIVORE', 'HERBIVORE', 'TERRITORY', 'SPECIES', 'NOCTURNAL', 'FORAGING', 'CAMOUFLAGE', 'MIGRATION'],
    space: ['ORBITAL', 'CELESTIAL', 'ASTRONOMER', 'SPECTRUM', 'RADIATION', 'PHOTON', 'ASTROPHYSICS', 'LIGHTYEAR', 'ZENITH', 'NADIR', 'INTERSTELLAR'],
    food: ['DELICACY', 'SEASONING', 'HERBS', 'SPICES', 'GOURMET', 'KITCHEN', 'RECIPE', 'SIMMER', 'ROASTING', 'BAKING', 'APPETITE', 'FLAVOR'],
    music: ['SYMPHONY', 'HARMONY', 'MELODY', 'RHYTHM', 'TEMPO', 'CRESCENDO', 'CONCERTO', 'CADENCE', 'ORCHESTRA', 'INTERVAL', 'CHORD'],
    science: ['EXPERIMENT', 'HYPOTHESIS', 'LABORATORY', 'VARIABLE', 'DISCOVERY', 'ANALYSIS', 'EQUATION', 'RESEARCH', 'EVIDENCE', 'PRINCIPLE'],
    history: ['HERITAGE', 'CHRONOLOGY', 'ARCHIVE', 'CENTURY', 'CIVILIZATION', 'MONUMENT', 'ANCESTOR', 'DYNASTY', 'TREATY', 'ARTIFACT'],
    travel: ['VOYAGE', 'JOURNEY', 'EXPEDITION', 'PASSPORT', 'ITINERARY', 'WANDERLUST', 'LODGING', 'WAYFINDER', 'HORIZON', 'CROSSING'],
    book: ['CHAPTER', 'EDITION', 'PUBLISHER', 'LITERARY', 'NARRATIVE', 'MANUSCRIPT', 'AUTHOR', 'PAGES', 'VOLUME', 'PASSAGE'],
    game: ['CHAMPION', 'STRATEGY', 'VICTORY', 'PUZZLE', 'BOARD', 'PLAYER', 'TACTICS', 'CHALLENGE', 'SCORING', 'RULES']
  };

  for (const [key, seeds] of Object.entries(DOMAIN_SEEDS)) {
    if (kw.includes(key)) {
      seeds.forEach(s => result.add(s));
    }
  }

  // If still less than 18 words, supplement with universal engaging puzzle words
  const UNIVERSAL_FALLBACKS = [
    'ENDEAVOR', 'DISCOVERY', 'REFLECTION', 'HARMONY', 'WONDER', 'SERENITY',
    'PERSPECTIVE', 'BRILLIANCE', 'INSPIRATION', 'TREASURE', 'ILLUMINATE',
    'CHRONICLE', 'HORIZON', 'SPECTACLE', 'VENTURE', 'ADVENTURE'
  ];

  let fallbackIdx = 0;
  while (result.size < 20 && fallbackIdx < UNIVERSAL_FALLBACKS.length) {
    result.add(UNIVERSAL_FALLBACKS[fallbackIdx]);
    fallbackIdx++;
  }

  return Array.from(result);
}
