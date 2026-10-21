import { resolveSeedToSubtopics, ThemedSubtopic } from '../data/topicLibrary';

export interface AISubtopicResult {
  title: string;
  category: string;
  words: string[];
}

export interface GenerationStatus {
  source: 'gemini' | 'encyclopedia';
  message: string;
}

/**
 * Fetch AI-generated subtopics from the server (Gemini 3.8 Flash),
 * or gracefully fall back to the built-in seed cluster encyclopedia.
 */
export async function fetchSeedSubtopics(
  seed: string,
  count: number,
  wordsPerPuzzle: number,
  onStatusChange?: (status: GenerationStatus) => void
): Promise<AISubtopicResult[]> {
  const trimmed = seed.trim();

  // 1. Try server-side Gemini AI generation
  try {
    onStatusChange?.({
      source: 'gemini',
      message: `Discovering authentic chapters and vocabulary with Gemini AI for "${trimmed || 'American History'}"...`
    });

    const response = await fetch('/api/generate-subtopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seed: trimmed || 'American History',
        count,
        wordsPerPuzzle,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.subtopics) && data.subtopics.length > 0) {
        onStatusChange?.({
          source: data.source || 'gemini',
          message: data.source === 'gemini'
            ? `Generated ${data.subtopics.length} themed chapters via Gemini AI.`
            : `Loaded ${data.subtopics.length} themed chapters from seed encyclopedia.`
        });
        return data.subtopics;
      }
    }
  } catch (err) {
    console.log('Gemini endpoint offline or unreachable. Using built-in seed engine:', err);
  }

  // 2. Fallback to built-in seed decomposition engine
  onStatusChange?.({
    source: 'encyclopedia',
    message: 'Using built-in thematic encyclopedia.'
  });

  return resolveSeedToSubtopics(trimmed, count);
}
