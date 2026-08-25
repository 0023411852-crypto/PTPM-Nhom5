"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  category: string;
  authorName: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

interface NewsResponse {
  data: NewsArticle[];
  totalPages: number;
  totalRecords: number;
}

const PAGE_SIZE = 6;
const API_URL = "/api/NewsArticles";
const API_BASE_URL = "";

function resolveMediaUrl(url?: string | null) {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getExcerpt(content: string) {
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 150 ? `${text.slice(0, 150)}...` : text;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

        async function loadArticles() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}?PageNumber=${page}&PageSize=${PAGE_SIZE}&onlyPublished=true&search=${encodeURIComponent(search.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Không thể tải danh sách tin tức.");
        const result: NewsResponse = await response.json();
        setArticles(Array.isArray(result.data) ? result.data : []);
        // NOTE: BE requires Category filter to be implemented to properly support filtering
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    const timer = window.setTimeout(loadArticles, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, page]);

  const categories = useMemo(() => [
    "Tất cả",
    ...Array.from(new Set(articles.map((article) => article.category).filter(Boolean))).sort(),
  ], [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = category === "Tất cả" || article.category === category;
      const matchesSearch = !normalizedSearch ||
        article.title.toLowerCase().includes(normalizedSearch) ||
        article.content.toLowerCase().includes(normalizedSearch) ||
        article.category.toLowerCase().includes(normalizedSearch) ||
        article.slug.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [articles, category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  // Remove local slice since we use BE pagination
  const visibleArticles = filteredArticles;
  const featuredArticle = filteredArticles[0];

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <main className="flex-grow pt-16">
      <section className="relative pt-3xl pb-2xl px-gutter overflow-hidden shader-overlay border-b border-outline-variant">
        <div className="max-w-container-max mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-md">Cloud Knowledge</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-[42rem] mx-auto mb-xl">
            Kiến thức, hướng dẫn và tin tức mới nhất về Cloud, VPS, Hosting và bảo mật.
          </p>
          <div className="w-full max-w-[42rem] relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-body-md text-on-surface placeholder:text-outline shadow-sm"
              placeholder="Tìm kiếm bài viết..."
              type="search"
              aria-label="Tìm kiếm bài viết"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-outline-variant bg-surface-container-lowest sticky top-16 z-40">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex overflow-x-auto hide-scrollbar gap-sm py-sm" role="tablist" aria-label="Lọc theo danh mục">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-selected={category === item}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-body-sm font-semibold transition-colors ${
                  category === item
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface border border-transparent hover:border-outline-variant"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-gutter py-xl">
        {loading && <p className="py-2xl text-center text-secondary">Đang tải tin tức...</p>}
        {error && (
          <div className="py-xl text-center text-error">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-md text-primary underline">Thử lại</button>
          </div>
        )}

        {!loading && !error && featuredArticle && (
          <section className="mb-2xl">
            <div className="group flex flex-col lg:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
              <div className="lg:w-7/12 relative overflow-hidden bg-surface-container min-h-[260px]">
                {resolveMediaUrl(featuredArticle.thumbnailUrl) ? (
                  <img src={resolveMediaUrl(featuredArticle.thumbnailUrl) || undefined} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : <div className="flex w-full h-full min-h-[260px] items-center justify-center bg-gradient-to-br from-primary-container to-surface-container-high text-primary"><span className="material-symbols-outlined text-5xl">article</span></div>}
              </div>
              <div className="lg:w-5/12 p-lg lg:p-xl flex flex-col justify-center">
                <span className="w-fit px-2 py-1 bg-surface-variant text-primary font-label-caps text-label-caps rounded uppercase mb-md">{featuredArticle.category}</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md group-hover:text-primary transition-colors">{featuredArticle.title}</h2>
                <p className="font-body-md text-body-md text-secondary mb-lg line-clamp-3">{getExcerpt(featuredArticle.content)}</p>
                <div className="flex items-center justify-between mt-auto pt-lg border-t border-outline-variant">
                  <span className="font-body-sm text-secondary">{formatDate(featuredArticle.createdAt)}</span>
                  <Link href={`/news/${featuredArticle.id}`} className="text-primary font-body-sm font-semibold hover:underline flex items-center gap-1">
                    Đọc bài viết <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!loading && !error && visibleArticles.length === 0 && (
          <p className="py-2xl text-center text-secondary">Không tìm thấy bài viết phù hợp.</p>
        )}

        {!loading && !error && visibleArticles.length > 0 && (
          <div className="grid grid-cols-1 gap-xl lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section>
              <div className="mb-lg flex items-end justify-between gap-md">
                <div>
                  <p className="mb-xs font-label-caps text-label-caps uppercase tracking-wide text-primary">CloudNova Knowledge</p>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Bài viết mới nhất</h3>
                </div>
                <span className="font-body-sm text-secondary">{filteredArticles.length} bài viết</span>
              </div>
              <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                {visibleArticles.map((article) => (
                  <article key={article.id} className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="relative h-52 overflow-hidden bg-surface-container">
                      {resolveMediaUrl(article.thumbnailUrl) ? <img src={resolveMediaUrl(article.thumbnailUrl) || undefined} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center bg-surface-container text-primary"><span className="material-symbols-outlined text-4xl">article</span></div>}
                      <span className="absolute left-4 top-4 rounded border border-outline-variant bg-surface-container-lowest/90 px-2 py-1 font-label-caps text-label-caps text-secondary">{article.category || "Tin tức"}</span>
                    </div>
                    <div className="flex flex-grow flex-col p-lg">
                      <h4 className="mb-sm font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">{article.title}</h4>
                      <p className="mb-lg line-clamp-3 font-body-sm text-secondary">{getExcerpt(article.content)}</p>
                      <div className="mt-auto flex items-center justify-between gap-sm border-t border-outline-variant/50 pt-md">
                        <span className="text-xs text-secondary">{formatDate(article.createdAt)}</span>
                        <Link href={`/news/${article.id}`} className="font-body-sm text-primary hover:underline">Xem chi tiết →</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-xl flex items-center justify-center gap-sm">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-outline-variant px-4 py-2 font-body-sm text-secondary transition-colors hover:bg-surface-container disabled:opacity-50">← Trước</button>
                <span className="px-4 py-2 font-body-sm text-secondary">Trang {currentPage}/{totalPages}</span>
                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-outline-variant px-4 py-2 font-body-sm text-secondary transition-colors hover:bg-surface-container disabled:opacity-50">Sau →</button>
              </div>
            </section>

            <aside className="space-y-lg">
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
                <div className="mb-md flex items-center gap-sm border-b border-outline-variant pb-md">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Thông tin nổi bật</h3>
                </div>
                {featuredArticle && (
                  <Link href={`/news/${featuredArticle.id}`} className="group block">
                    {resolveMediaUrl(featuredArticle.thumbnailUrl) ? <img src={resolveMediaUrl(featuredArticle.thumbnailUrl) || undefined} alt={featuredArticle.title} className="mb-md h-32 w-full rounded-lg object-cover" /> : <div className="mb-md flex h-32 w-full items-center justify-center rounded-lg bg-primary-container text-primary"><span className="material-symbols-outlined text-4xl">article</span></div>}
                    <p className="mb-xs font-label-caps text-label-caps uppercase text-primary">{featuredArticle.category || "Tin tức"}</p>
                    <h4 className="font-body-md font-semibold leading-snug text-on-surface group-hover:text-primary">{featuredArticle.title}</h4>
                    <p className="mt-sm line-clamp-2 font-body-sm text-secondary">{getExcerpt(featuredArticle.content)}</p>
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
                <h3 className="mb-md border-b border-outline-variant pb-md font-headline-sm text-headline-sm text-on-surface">Thẻ chủ đề</h3>
                <div className="flex flex-wrap gap-sm">
                  {categories.filter((item) => item !== "Tất cả").map((item) => (
                    <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-md py-xs font-body-sm transition-colors ${category === item ? "border-primary bg-primary-container text-primary" : "border-outline-variant text-secondary hover:border-primary hover:text-primary"}`}>
                      #{item}
                    </button>
                  ))}
                  {categories.length === 1 && <span className="font-body-sm text-secondary">Chưa có thẻ chủ đề.</span>}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

    </main>
  );
}
