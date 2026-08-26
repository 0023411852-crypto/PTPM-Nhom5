import React from "react";
import Link from "next/link";

async function getStaticPages() {
  try {
    const API_URL = process.env.API_PROXY_URL || "http://localhost:5154";
    const res = await fetch(`${API_URL}/api/StaticPages?onlyPublished=true&PageNumber=1&PageSize=10`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function Footer() {
  const staticPages = await getStaticPages();

  return (
    <footer className="bg-inverse-surface w-full py-xl border-t border-outline-variant">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-lg px-gutter max-w-[var(--spacing-container-max)] mx-auto">
        <div className="col-span-2 lg:col-span-2">
          <span className="text-[length:var(--text-headline-md)] font-bold text-primary-fixed flex items-center gap-2 mb-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud
            </span>
            CloudNova
          </span>
          <p className="text-[length:var(--text-body-sm)] text-surface-variant mb-lg">
            © 2024 CloudNova Infrastructure. All rights reserved.
          </p>
        </div>
        <div>
          <h4 className="text-[length:var(--text-label-caps)] font-semibold text-surface-variant mb-md opacity-70">
            Company
          </h4>
          <ul className="flex flex-col gap-sm">
            <li>
              <Link
                className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                href="/about"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                href="/news"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                href="/lien-he"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[length:var(--text-label-caps)] font-semibold text-surface-variant mb-md opacity-70">
            Chính sách & Pháp lý
          </h4>
          <ul className="flex flex-col gap-sm">
            {staticPages.length > 0 ? (
                staticPages.map((page: { id: string; slug: string; title: string }) => (
                    <li key={page.id}>
                      <Link
                        className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                        href={`/${page.slug}`}
                      >
                        {page.title}
                      </Link>
                    </li>
                ))
            ) : (
                <>
                    <li>
                      <Link
                        className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                        href="/dieu-khoan"
                      >
                        Điều khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                        href="/bao-mat"
                      >
                        Bảo mật
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                        href="/sla"
                      >
                        SLA
                      </Link>
                    </li>
                </>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-[length:var(--text-label-caps)] font-semibold text-surface-variant mb-md opacity-70">
            Resources
          </h4>
          <ul className="flex flex-col gap-sm">
            <li>
              <Link
                className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                href="/huong-dan"
              >
                Hướng dẫn
              </Link>
            </li>
            <li>
              <Link
                className="text-[length:var(--text-body-sm)] text-surface-variant hover:text-white hover:underline transition-colors"
                href="/api-docs"
              >
                API Documentation
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
