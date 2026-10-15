'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { HEALTH_ARTICLES, DOCTOR_INFO } from '@/data/healthData';
import { HealthArticle } from '@/types/health';
import { 
  Clock, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Sparkles, 
  BookOpen,
  Search
} from 'lucide-react';

function renderInlineContent(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderArticleBody(content: string) {
  return content.split(/\n\s*\n/).filter(Boolean).flatMap((block, blockIndex) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const segments: { kind: 'paragraph' | 'ordered' | 'unordered'; lines: string[] }[] = [];

    for (const line of lines) {
      const listItem = line.match(/^(?:(\d+)\.|[-*])\s+(.+)$/);
      const kind = listItem ? (listItem[1] ? 'ordered' : 'unordered') : 'paragraph';
      const current = segments[segments.length - 1];
      if (current?.kind === kind) {
        current.lines.push(listItem?.[2] || line);
      } else {
        segments.push({ kind, lines: [listItem?.[2] || line] });
      }
    }

    return segments.map((segment, segmentIndex) => {
      const key = `${blockIndex}-${segmentIndex}`;
      if (segment.kind === 'paragraph') {
        return <p key={key} className="leading-8">{renderInlineContent(segment.lines.join(' '))}</p>;
      }

      const List = segment.kind === 'ordered' ? 'ol' : 'ul';
      return (
        <List key={key} className={`space-y-3 pl-6 ${segment.kind === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
          {segment.lines.map((line, itemIndex) => (
            <li key={itemIndex} className="pl-1 leading-8">{renderInlineContent(line)}</li>
          ))}
        </List>
      );
    });
  });
}

export const HealthArticles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All topics');
  const categories = useMemo(() => ['All topics', ...new Set(HEALTH_ARTICLES.map((article) => article.category))], []);
  const visibleArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return HEALTH_ARTICLES.filter((article) => {
      if (selectedCategory !== 'All topics' && article.category !== selectedCategory) return false;
      if (!query) return true;
      return [article.title, article.summary, article.category, article.content, ...article.keyPoints]
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [searchTerm, selectedCategory]);

  return (
    <section id="articles" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0">
          <label className="relative block w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search articles or health topics"
              aria-label="Search articles or health topics"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>
          <p className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            {visibleArticles.length} {visibleArticles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2" aria-label="Filter articles by topic">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCategory === category
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {visibleArticles.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map(article => (
            <div
              key={article.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative aspect-16/8 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{article.category}</span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" /> {article.readTime}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                    {article.summary}
                  </p>
                </div>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {article.keyPoints.slice(0, 2).map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="line-clamp-2">{point}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 pt-5 text-sm font-bold text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  <span>Read article</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">No matching articles</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Try another search term or topic.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All topics'); }}
              className="mt-4 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>

      {/* Full Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-4">
          <div className="relative flex max-h-dvh w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 sm:max-h-[92dvh] sm:max-w-3xl sm:rounded-2xl sm:border sm:border-slate-200 sm:dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="min-w-0 flex-1 pr-3">
                <span className="block truncate text-xs font-bold text-emerald-400">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <span className="sr-only">Article controls</span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Article Content */}
            <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>By {selectedArticle.author || DOCTOR_INFO.name}</span>
                  <span>{selectedArticle.publishedDate}</span>
                </div>
              </div>

              {/* Key Takeaways Box */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  <Sparkles className="w-4 h-4" />
                    <span>Key takeaways</span>
                  </h3>
                  <ul className="mt-3 space-y-2">
                  {selectedArticle.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body */}
              <article className="max-w-2xl space-y-6 text-base text-slate-700 dark:text-slate-200 sm:text-lg">
                {renderArticleBody(selectedArticle.content)}
              </article>

              <div className="border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Health information is educational and does not replace personal medical advice.
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="text-xs text-slate-500">Zelovita Health Academy</div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800"
                >
                  Done reading
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
