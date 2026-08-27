"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import NewsCard from "@/components/NewsCard";
import Nav from "@/components/Nav";

type Article = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string };
};

const CATEGORIES = [
  { label: "General", value: "general" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Sports", value: "sports" },
  { label: "Health", value: "health" },
  { label: "Entertainment", value: "entertainment" },
];

export default function Home() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("general");
  const [query, setQuery] = useState("");
  const [favoritedUrls, setFavoritedUrls] = useState<Set<string>>(new Set());

  const loadFavorites = useCallback(async () => {
    if (!session) {
      setFavoritedUrls(new Set());
      return;
    }
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavoritedUrls(new Set(data.map((f: { articleUrl: string }) => f.articleUrl)));
      }
    } catch {}
  }, [session]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.set("category", category);
      }
      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudieron cargar las noticias");
        setArticles([]);
      } else {
        setArticles(data.articles || []);
      }
    } catch {
      setError("Error de conexión al cargar noticias");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteChange = (url: string, favorited: boolean) => {
    setFavoritedUrls((prev) => {
      const next = new Set(prev);
      if (favorited) next.add(url);
      else next.delete(url);
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadNews();
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <Nav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex gap-5 overflow-x-auto font-mono-label text-xs uppercase tracking-wider">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setQuery("");
                  setCategory(cat.value);
                }}
                className={`pb-1 border-b-2 whitespace-nowrap transition ${
                  category === cat.value && !query
                    ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-ink)]/45 hover:text-[var(--color-ink)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center border-b border-[var(--color-ink)]/30 focus-within:border-[var(--color-accent)] transition w-full md:w-64"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-[var(--color-ink)]/40"
            />
            <button type="submit" aria-label="Search" className="text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] px-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-20 font-mono-label text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            Cargando noticias…
          </div>
        )}

        {!loading && error && <div className="text-center py-20 text-sm text-red-600">{error}</div>}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20 text-sm text-[var(--color-ink)]/50">No found news</div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <NewsCard
                key={article.url}
                article={article}
                isFavorited={favoritedUrls.has(article.url)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}