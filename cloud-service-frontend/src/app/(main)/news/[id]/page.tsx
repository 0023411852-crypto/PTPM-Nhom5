import Link from "next/link";
import { notFound } from "next/navigation";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

const API_BASE_URL = "http://localhost:5154";

function resolveMediaUrl(url?: string | null) {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getArticle(id: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/NewsArticles/${id}`, {
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

  const thumbnailUrl = resolveMediaUrl(article.thumbnailUrl);

  return (
    <main className="flex-grow bg-surface-container-lowest pt-20 pb-3xl">
      <div className="max-w-container-max mx-auto px-gutter">
        <Link href="/news" className="inline-flex items-center gap-xs text-primary font-body-sm mb-xl hover:underline">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Quay lại danh sách tin tức
        </Link>

        <article className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[26rem]">
            <div className="relative min-h-[18rem] lg:min-h-full bg-primary-container">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={article.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-sm bg-gradient-to-br from-primary-container to-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-6xl">article</span>
                  <span className="font-body-sm">CloudNova News</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-xl md:p-2xl lg:p-3xl">
              <span className="mb-lg inline-flex w-fit rounded-full bg-primary-container px-md py-xs font-label-caps text-label-caps uppercase tracking-wide text-primary">
                {article.category || "Tin tức"}
              </span>
              <h1 className="mb-lg font-display-md text-display-md leading-tight text-on-surface">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-md gap-y-xs border-t border-outline-variant pt-lg font-body-sm text-secondary">
                <span>{article.authorName || "CloudNova"}</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span>{formatDate(article.createdAt)}</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span>{article.viewCount || 0} lượt xem</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-xl border-t border-outline-variant p-xl md:p-2xl">
            <div>
              <div className="mb-lg rounded-xl border border-primary/15 bg-primary-container/40 p-lg font-body-lg leading-relaxed text-on-surface">
                Nội dung bài viết mới nhất từ CloudNova, được biên tập để giúp bạn vận hành hạ tầng Cloud an toàn và hiệu quả.
              </div>
              <div className="prose prose-blue max-w-none prose-headings:font-semibold prose-a:text-primary" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <aside className="h-fit rounded-xl border border-outline-variant bg-surface-container-low p-lg">
              <h2 className="mb-md font-headline-sm text-headline-sm text-on-surface">Thông tin bài viết</h2>
              <dl className="space-y-sm font-body-sm">
                <div className="flex items-start justify-between gap-md">
                  <dt className="text-secondary">Chuyên mục</dt>
                  <dd className="text-right font-medium text-on-surface">{article.category || "Tin tức"}</dd>
                </div>
                <div className="flex items-start justify-between gap-md">
                  <dt className="text-secondary">Tác giả</dt>
                  <dd className="text-right font-medium text-on-surface">{article.authorName || "CloudNova"}</dd>
                </div>
                <div className="flex items-start justify-between gap-md">
                  <dt className="text-secondary">Ngày đăng</dt>
                  <dd className="text-right font-medium text-on-surface">{formatDate(article.createdAt)}</dd>
                </div>
              </dl>
              <Link href="/news" className="mt-lg inline-flex w-full items-center justify-center rounded-lg border border-primary px-md py-sm font-body-sm font-semibold text-primary hover:bg-primary-container">
                Xem thêm tin tức
              </Link>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
