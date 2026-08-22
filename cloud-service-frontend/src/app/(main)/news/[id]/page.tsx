import Link from "next/link";
import { notFound } from "next/navigation";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

async function getArticle(id: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`http://localhost:5154/api/NewsArticles/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article || !article.isPublished) notFound();

  return (
    <main className="pt-24 pb-3xl flex-grow">
      <article className="px-gutter max-w-container-md mx-auto pt-xl">
        <Link href="/news" className="inline-flex items-center gap-xs text-primary font-body-sm mb-xl hover:underline">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại danh sách tin tức
        </Link>
        <div className="mb-lg">
          <span className="inline-block px-3 py-1 bg-surface-variant text-primary font-label-caps text-label-caps rounded uppercase mb-md">{article.category}</span>
          <h1 className="font-display-md text-display-md text-on-surface mb-md">{article.title}</h1>
          <div className="flex flex-wrap gap-x-md gap-y-xs text-secondary font-body-sm">
            <span>{article.authorName || "CloudNova"}</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>{article.viewCount} lượt xem</span>
          </div>
        </div>
        {article.thumbnailUrl && <img src={article.thumbnailUrl} alt={article.title} className="w-full max-h-[28rem] object-cover rounded-2xl border border-outline-variant mb-xl" />}
        <div className="prose prose-blue max-w-none prose-headings:font-semibold prose-a:text-primary" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </main>
  );
}
