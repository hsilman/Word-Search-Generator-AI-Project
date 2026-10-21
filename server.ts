import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Helper to expand subtopics up to targetCount (up to 100)
 * Ensures every puzzle title is unique, natural, and never prepends the seed word.
 */
function expandSubtopics(
  baseSubtopics: Array<{ title: string; category: string; words: string[] }>,
  targetCount: number
): Array<{ title: string; category: string; words: string[] }> {
  if (baseSubtopics.length >= targetCount) {
    return baseSubtopics.slice(0, targetCount);
  }

  const result = [...baseSubtopics];
  const seenTitles = new Set(result.map(s => s.title.toLowerCase()));

  const CHAPTER_SUBDIVISIONS = [
    'Pioneers & Icons',
    'Turning Points',
    'Decisive Moments',
    'Mastery & Strategy',
    'Untold Legends',
    'Cultural Voices',
    'The Golden Era',
    'Modern Legacy',
    'Core Chronicles',
    'Landmarks & Lore',
  ];

  let idx = 0;
  while (result.length < targetCount && idx < 500) {
    const base = baseSubtopics[idx % baseSubtopics.length];
    const subTag = CHAPTER_SUBDIVISIONS[Math.floor(idx / baseSubtopics.length) % CHAPTER_SUBDIVISIONS.length];
    const newTitle = `${base.title}: ${subTag}`;

    if (!seenTitles.has(newTitle.toLowerCase())) {
      seenTitles.add(newTitle.toLowerCase());
      // Rotate words so placement patterns and word lists feel varied
      const offset = (idx * 3) % Math.max(1, base.words.length);
      const rotatedWords = [...base.words.slice(offset), ...base.words.slice(0, offset)];
      result.push({
        title: newTitle,
        category: base.category,
        words: rotatedWords,
      });
    }
    idx++;
  }

  return result.slice(0, targetCount);
}

/**
 * AI Endpoint: Generate sub-topics and words tailored strictly to the user's seeds
 */
app.post('/api/generate-subtopics', async (req, res) => {
  const { seed, count = 10, wordsPerPuzzle = 14 } = req.body;
  const requestedCount = Math.max(1, Math.min(Number(count) || 10, 100));
  const targetWordCount = Math.max(12, Math.min(Number(wordsPerPuzzle) || 14, 25));

  if (!seed || typeof seed !== 'string' || !seed.trim()) {
    return res.status(400).json({ error: 'Seed topic or keywords are required.' });
  }

  // If Gemini is not configured, immediately use built-in encyclopedia
  if (!ai) {
    try {
      const { resolveSeedToSubtopics } = await import('./src/data/topicLibrary.ts');
      const fallback = resolveSeedToSubtopics(seed.trim(), requestedCount);
      return res.json({
        subtopics: fallback,
        source: 'encyclopedia',
        notice: 'Served curated thematic seed encyclopedia.'
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to generate fallback subtopics.' });
    }
  }

  try {
    // Generate up to 20 core chapters from Gemini (fast 3-5s response)
    const geminiBatchCount = Math.min(requestedCount, 20);

    const prompt = `You are an expert puzzle author and lexicographer.
A user wants to create a Word Search Puzzle Book based on this topic seed: "${seed.trim()}".

Generate exactly ${geminiBatchCount} unique, distinct, authentically titled puzzle chapters based ONLY on this seed topic.

CRITICAL RULES:
1. Do NOT prepend, append, or attach the literal seed word to every puzzle title.
   - EXAMPLE FOR "American History":
     GOOD TITLES: "The Revolutionary War", "Presidents of the United States", "The Civil War Era", "The Vietnam War", "Manifest Destiny", "The Space Race", "The Roaring Twenties", "The Great Depression", "The California Gold Rush", "The Civil Rights Movement".
     FORBIDDEN TITLES: "American History: Presidents", "American History Battles", "Origins of American History", "American History Vietnam".
   - The titles must be natural, standalone, compelling chapter titles.
2. Every subtopic must be strictly relevant to the seed "${seed.trim()}". Do NOT mix in random or unrelated topics.
3. For each subtopic, provide ${targetWordCount + 4} uppercase thematic single words (no spaces, no hyphens, letters A-Z only, length 3 to 12 characters).
4. Do NOT include the seed phrase itself as a word in the word lists.
5. All ${geminiBatchCount} titles must be distinct from one another.`;

    // Call gemini-3.1-flash-lite directly for fast structured JSON subtopics
    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Clean, standalone chapter title without the seed keyword prefix',
              },
              category: {
                type: Type.STRING,
                description: 'Sub-genre or era category',
              },
              words: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'Uppercase terms (A-Z only, 3-12 characters) strictly related to this subtopic',
              },
            },
            required: ['title', 'words'],
          },
        },
      },
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call exceeded 35s timeout')), 35000)
    );

    const response = await Promise.race([geminiCall, timeout]);

    if (!response || !response.text) {
      throw new Error('Empty response received from Gemini.');
    }

    const parsed = JSON.parse(response.text);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid JSON array received from Gemini.');
    }

    // Sanitize results
    const sanitized = parsed.map((item: { title?: string; category?: string; words?: string[] }) => {
      const cleanWords = (item.words || [])
        .map(w => w.replace(/[^A-Za-z]/g, '').toUpperCase())
        .filter(w => w.length >= 3 && w.length <= 16);

      return {
        title: (item.title || 'Thematic Chapter').trim(),
        category: (item.category || seed.trim()).trim(),
        words: Array.from(new Set(cleanWords)),
      };
    });

    // Expand cleanly to requestedCount if user requested more than the AI batch
    const fullList = expandSubtopics(sanitized, requestedCount);

    return res.json({ subtopics: fullList, source: 'gemini' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.log('Serving seed subtopics fallback:', errorMsg);

    // Dynamic import of encyclopedia fallback
    try {
      const { resolveSeedToSubtopics } = await import('./src/data/topicLibrary.ts');
      const fallback = resolveSeedToSubtopics(seed.trim() || 'American History', requestedCount);
      return res.json({
        subtopics: fallback,
        source: 'encyclopedia',
        notice: 'Served curated thematic seed encyclopedia.'
      });
    } catch (fallbackErr) {
      console.error('Fallback error:', fallbackErr);
      return res.status(500).json({ error: errorMsg });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WordCraft Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
