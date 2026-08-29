import React from "react";
import Link from "next/link";

async function getStaticPages() {
  try {
    const API_URL = process.env.API_PROXY_URL || "http://localhost:5154";
    const res = await fetch(`${API_URL}/api/StaticPages?onlyPublished=true&PageNumber=1&PageSize=10`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const linkClass = "footer-link text-[length:var(--text-body-sm)] text-surface-variant";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link className={linkClass} href={href}>
        {children}
      </Link>
    </li>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="footer-heading text-[length:var(--text-label-caps)] font-semibold text-surface-variant">{children}</h4>;
}

export default async function Footer() {
  const staticPages = await getStaticPages();

  return (
    <footer className="site-footer w-full">
      <div className="footer-orb footer-orb-one" aria-hidden="true" />
      <div className="footer-orb footer-orb-two" aria-hidden="true" />

      <div className="site-footer-inner max-w-[var(--spacing-container-max)] mx-auto px-gutter">
        <div className="footer-topbar flex flex-col gap-md md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-sm">
            <span className="footer-live-dot" aria-hidden="true" />
            <span className="text-[length:var(--text-body-sm)] text-surface-variant">Hệ thống đang hoạt động ổn định</span>
            <span className="footer-topbar-divider" aria-hidden="true" />
            <span className="text-[length:var(--text-body-sm)] text-[#9bb5d7]">99.9% uptime SLA</span>
          </div>
          <Link href="/pricing" className="footer-topbar-link inline-flex items-center gap-xs text-[length:var(--text-body-sm)] font-semibold text-primary-fixed">
            Khám phá gói dịch vụ
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="footer-main grid grid-cols-1 gap-2xl md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="footer-brand inline-flex items-center gap-2" aria-label="CloudNova trang chủ">
              <span className="footer-brand-icon material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
              <span className="text-[length:var(--text-headline-md)] font-bold tracking-[-0.04em] text-white">CloudNova</span>
            </Link>
            <p className="footer-description mt-md max-w-[24rem] text-[length:var(--text-body-md)] text-[#a9c0df]">
              Hạ tầng Cloud mạnh mẽ, minh bạch và sẵn sàng mở rộng cho doanh nghiệp Việt Nam.
            </p>
            <div className="footer-status-card mt-xl">
              <span className="footer-status-icon material-symbols-outlined">verified</span>
              <div>
                <p className="text-[length:var(--text-body-sm)] font-semibold text-white">Hạ tầng được giám sát 24/7</p>
                <p className="mt-1 text-[length:var(--text-label-caps)] text-[#8faed2]">Bảo mật nhiều lớp · Hỗ trợ tận tâm</p>
              </div>
            </div>
            <div className="mt-lg flex items-center gap-sm">
              <a className="footer-social" href="mailto:support@cloudnova.vn" aria-label="Email CloudNova">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
              <a className="footer-social" href="tel:+842873066688" aria-label="Gọi CloudNova">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
              <Link className="footer-contact-link text-[length:var(--text-body-sm)] text-[#b5cbea]" href="/lien-he">
                Liên hệ đội ngũ CloudNova
                <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
              </Link>
            </div>
          </div>

          <div>
            <FooterHeading>Sản phẩm</FooterHeading>
            <ul className="footer-links mt-lg flex flex-col gap-sm">
              <FooterLink href="/services">Tất cả dịch vụ</FooterLink>
              <FooterLink href="/services/vps">Cloud VPS</FooterLink>
              <FooterLink href="/services/hosting">Web Hosting</FooterLink>
              <FooterLink href="/pricing">Bảng giá</FooterLink>
              <FooterLink href="/checkout">Giỏ hàng</FooterLink>
            </ul>
          </div>

          <div>
            <FooterHeading>Giải pháp</FooterHeading>
            <ul className="footer-links mt-lg flex flex-col gap-sm">
              <FooterLink href="/partners">Đối tác CloudNova</FooterLink>
              <FooterLink href="/top-customers">Khách hàng tiêu biểu</FooterLink>
              <FooterLink href="/about">Cho doanh nghiệp</FooterLink>
              <FooterLink href="/services/ssl">Bảo mật SSL / TLS</FooterLink>
              <FooterLink href="/services/firewall-chong-ddos">Firewall chống DDoS</FooterLink>
            </ul>
          </div>

          <div>
            <FooterHeading>Tài nguyên</FooterHeading>
            <ul className="footer-links mt-lg flex flex-col gap-sm">
              <FooterLink href="/news">Tin tức</FooterLink>
              <FooterLink href="/huong-dan">Hướng dẫn triển khai</FooterLink>
              <FooterLink href="/api-docs">API Documentation</FooterLink>
              <FooterLink href="/login">Cổng khách hàng</FooterLink>
            </ul>
          </div>

          <div>
            <FooterHeading>Hỗ trợ</FooterHeading>
            <ul className="footer-links mt-lg flex flex-col gap-sm">
              <FooterLink href="/register">Đăng ký tài khoản</FooterLink>
              <FooterLink href="/about">Về CloudNova</FooterLink>
              <FooterLink href="/news">Góc kiến thức</FooterLink>
              <FooterLink href="/pricing">Nhận tư vấn miễn phí</FooterLink>
            </ul>
          </div>
        </div>

        <div className="footer-bottom grid grid-cols-1 gap-lg lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[length:var(--text-body-sm)] text-[#91add0]">© 2024 CloudNova Infrastructure. All rights reserved.</p>
            <p className="mt-xs text-[length:var(--text-label-caps)] text-[#7695bc]">Xây nền tảng. Mở rộng tương lai.</p>
          </div>
          <div className="footer-legal-wrap">
            <span className="footer-legal-label text-[length:var(--text-label-caps)] text-[#7695bc]">Chính sách & pháp lý</span>
            <nav className="footer-legal-links flex flex-wrap gap-x-lg gap-y-sm" aria-label="Liên kết pháp lý">
              {staticPages.length > 0 ? (
                staticPages.map((page: { id: string; slug: string; title: string }) => (
                  <Link key={page.id} className={linkClass} href={`/${page.slug}`}>{page.title}</Link>
                ))
              ) : (
                <>
                  <Link className={linkClass} href="/dieu-khoan">Điều khoản</Link>
                  <Link className={linkClass} href="/bao-mat">Bảo mật</Link>
                  <Link className={linkClass} href="/sla">SLA</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
