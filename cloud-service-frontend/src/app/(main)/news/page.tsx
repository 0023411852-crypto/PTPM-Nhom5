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
const API_URL = "http://localhost:5154/api/NewsArticles";
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
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}?PageNumber=1&PageSize=100&onlyPublished=true`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Không thể tải danh sách tin tức.");
        const result: NewsResponse = await response.json();
        setArticles(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadArticles();
    return () => controller.abort();
  }, []);

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
        article.content.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [articles, category, search]);

  async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterState("loading");
    setNewsletterMessage("");

    try {
      const response = await fetch("http://localhost:5154/api/Newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Không thể đăng ký email.");
      setNewsletterState("success");
      setNewsletterMessage(result.message || "Đăng ký nhận email thành công.");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterState("error");
      setNewsletterMessage(err instanceof Error ? err.message : "Không thể đăng ký email.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
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
                {featuredArticle.thumbnailUrl ? (
                  <img src={featuredArticle.thumbnailUrl} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : <div className="w-full h-full min-h-[260px] bg-primary-container" />}
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
          <section>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-lg">Bài viết mới nhất</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {visibleArticles.map((article) => (
                <article key={article.id} className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    {article.thumbnailUrl ? <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-surface-container" />}
                    <span className="absolute top-4 left-4 px-2 py-1 bg-surface-container-lowest/90 text-secondary font-label-caps text-label-caps rounded border border-outline-variant">{article.category}</span>
                  </div>
                  <div className="p-md flex flex-col flex-grow">
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">{article.title}</h4>
                    <p className="font-body-sm text-secondary mb-4 line-clamp-3">{getExcerpt(article.content)}</p>
                    <div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between gap-sm">
                      <span className="text-secondary text-xs">{formatDate(article.createdAt)}</span>
                      <Link href={`/news/${article.id}`} className="text-primary hover:underline font-body-sm text-sm">Xem chi tiết →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-xl flex items-center justify-center gap-sm">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="px-4 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container transition-colors font-body-sm disabled:opacity-50">← Trước</button>
              <span className="px-4 py-2 text-secondary font-body-sm">Trang {currentPage}/{totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="px-4 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container transition-colors font-body-sm disabled:opacity-50">Sau →</button>
            </div>
          </section>
        )}
      </div>

      <section className="mt-2xl border-t border-outline-variant bg-surface-container py-2xl px-gutter">
        <div className="max-w-[48rem] mx-auto bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-md p-xl text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-md">mail</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Nhận kiến thức Cloud mới nhất</h2>
          <p className="font-body-md text-secondary mb-lg">Đăng ký email để nhận hướng dẫn kỹ thuật và tin tức mới từ CloudNova.</p>
          <form className="flex flex-col sm:flex-row gap-sm max-w-[32rem] mx-auto" onSubmit={handleNewsletterSubmit}>
            <input
              className="flex-grow px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-body-md text-on-surface placeholder:text-outline shadow-sm"
              placeholder="Email của bạn"
              required
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              disabled={newsletterState === "loading"}
            />
            <button className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-md font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-60" type="submit" disabled={newsletterState === "loading"}>
              {newsletterState === "loading" ? "Đang gửi..." : "Đăng ký"}
            </button>
          </form>
          {newsletterMessage && <p className={`text-sm mt-md ${newsletterState === "error" ? "text-error" : "text-secondary"}`}>{newsletterMessage}</p>}
        </div>
      </section>
    </main>
  );
}
