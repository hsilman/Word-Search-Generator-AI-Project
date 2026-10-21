import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Layers, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BUILT_IN_TOPICS, PRESET_COLLECTIONS, ThemedTopic } from '../data/topicLibrary';
import { BookSettings } from '../types/wordSearch';

interface TopicLibraryDrawerProps {
  settings: BookSettings;
  setSettings: React.Dispatch<React.SetStateAction<BookSettings>>;
  onApplyTopic: (topic: ThemedTopic) => void;
}

export const TopicLibraryDrawer: React.FC<TopicLibraryDrawerProps> = ({
  settings,
  setSettings,
  onApplyTopic
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedTopicIds, setAddedTopicIds] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(BUILT_IN_TOPICS.map(t => t.category)))];

  const filteredTopics = BUILT_IN_TOPICS.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.words.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddTopicToBook = (topic: ThemedTopic) => {
    const newLine = `${topic.title}: ${topic.words.slice(0, 18).join(', ')}`;
    setSettings(prev => {
      const existing = prev.customTopicsText.trim();
      const updated = existing ? `${existing}\n${newLine}` : newLine;
      return {
        ...prev,
        customTopicsText: updated,
        puzzleCount: prev.puzzleCount + 1
      };
    });

    setAddedTopicIds(prev => new Set(prev).add(topic.id));
    setTimeout(() => {
      setAddedTopicIds(prev => {
        const next = new Set(prev);
        next.delete(topic.id);
        return next;
      });
    }, 2000);
  };

  const handleSetSingleTopicBook = (topic: ThemedTopic) => {
    setSettings(prev => ({
      ...prev,
      title: `${topic.title} Word Search Book`,
      subtitle: `Relaxing Word Search Puzzles on ${topic.title} & ${topic.category}`,
      customTopicsText: `${topic.title}: ${topic.words.join(', ')}`,
      puzzleCount: Math.min(prev.puzzleCount, 5)
    }));
  };

  return (
    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-slate-200">
          <h1 className="text-base font-bold text-slate-900 font-serif-book">
            Curated Thematic Encyclopedia & Vocabulary Library
          </h1>
          <p className="text-xs text-slate-500">
            Browse our hand-crafted, high-contrast vocabulary collections. Add individual themes to your book or adopt an entire collection.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. Space, Coffee, Ancient, Dinosaur)..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-200/60 rounded-lg">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map(topic => {
            const isAdded = addedTopicIds.has(topic.id);

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono-grid text-slate-500 tracking-wider">
                      {topic.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-grid">
                      {topic.words.length} terms
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-serif-book mb-2">
                    {topic.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                    {topic.words.slice(0, 7).map((word, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-xs bg-slate-50 border border-slate-200/60">
                        {word}
                      </span>
                    ))}
                    {topic.words.length > 7 && (
                      <span className="text-slate-400 py-0.5">
                        +{topic.words.length - 7} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => handleSetSingleTopicBook(topic)}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Set as Book Topic
                  </button>

                  <button
                    onClick={() => handleAddTopicToBook(topic)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Added to Book</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add Puzzle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
