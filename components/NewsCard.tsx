"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Article = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string };
};

export default function NewsCard({
  article,
  isFavorited,
  onFavoriteChange,
}: {
  article: Article;
  isFavorited: boolean;
  onFavoriteChange: (url: string, favorited: boolean) => void;
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!session) {
      alert("Inicia sesión para guardar favoritos");
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await fetch(`/api/favorites?articleUrl=${encodeURIComponent(article.url)}`, {
          method: "DELETE",
        });
        onFavoriteChange(article.url, false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleUrl: article.url,
            title: article.title,
            source: article.source?.name,
            imageUrl: article.image,
            publishedAt: article.publishedAt,
          }),
        });
        onFavoriteChange(article.url, true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{article.source?.name}</span>
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="text-xl leading-none"
            aria-label="Guardar favorito"
          >
            {isFavorited ? "★" : "☆"}
          </button>
        </div>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">
          {article.description}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Read More →
        </a>
      </div>
    </div>
  );
}