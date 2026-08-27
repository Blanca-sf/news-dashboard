"use client";

import { useEffect, useState, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import Nav from "@/components/Nav";

type FavoriteRecord = {
  id: string;
  articleUrl: string;
  title: string;
  source: string | null;
  imageUrl: string | null;
  description: string | null;
  publishedAt: string | null;
};

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        setFavorites(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleFavoriteChange = (url: string, favorited: boolean) => {
    if (!favorited) {
      setFavorites((prev) => prev.filter((f) => f.articleUrl !== url));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="font-display text-2xl mb-6 text-[var(--color-ink)]">Your Favorites</h2>

        {loading && (
          <div className="text-center py-20 font-mono-label text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            Loading…
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-20 text-sm text-[var(--color-ink)]/50">
            You haven't saved any articles yet. Click the seal on any card to save it here.
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => (
              <NewsCard
                key={fav.id}
                article={{
                  title: fav.title,
                  description: fav.description || "",
                  url: fav.articleUrl,
                  image: fav.imageUrl || "",
                  publishedAt: fav.publishedAt || "",
                  source: { name: fav.source || "" },
                }}
                isFavorited={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}