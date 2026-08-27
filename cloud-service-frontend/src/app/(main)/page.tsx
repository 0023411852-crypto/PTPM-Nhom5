"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ServiceCategory = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive?: boolean;
};

type ServicePlan = {
  id: string;
  name: string;
  description?: string;
  category?: { name?: string };
  prices?: Array<{ price?: number }>;
  isActive?: boolean;
};

type Promotion = {
  id: string;
  title?: string;
  description?: string;
  discountPercentage?: number;
};

type NewsArticle = {
  id: string;
  title?: string;
  category?: string;
  createdAt?: string;
  thumbnailUrl?: string;
};

type ApiKey = "services" | "plans" | "promotions" | "news";
type ApiStatus = "loading" | "live" | "fallback" | "error";

type ApiStatusMap = Record<ApiKey, ApiStatus>;

async function requestJson(url: string) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

function ApiBadge({ status }: { status: ApiStatus }) {
  const labels: Record<ApiStatus, string> = {
    loading: "Đang đồng bộ",
    live: "Dữ liệu live",
    fallback: "Nội dung mặc định",
    error: "Tạm thời offline",
  };
  return <span className={`api-badge api-badge-${status}`}><span className="api-badge-dot" />{labels[status]}</span>;
}

function DataSkeleton({ variant }: { variant: "service" | "plan" | "news" }) {
  if (variant === "news") return <div className="api-skeleton api-skeleton-news"><span /><span /><span /></div>;
  return <div className={`api-skeleton api-skeleton-${variant}`}><span /><span /><span /><span /></div>;
}

const fallbackServices: ServiceCategory[] = [
  { id: "vps", name: "Cloud VPS", slug: "vps", icon: "dns", description: "Máy chủ ảo hiệu năng cao, triển khai nhanh và dễ dàng mở rộng." },
  { id: "hosting", name: "Web Hosting", slug: "hosting", icon: "language", description: "Không gian lưu trữ ổn định cho website, WordPress và ứng dụng web." },
  { id: "domain", name: "Tên miền", slug: "domain", icon: "public", description: "Đăng ký, quản lý và bảo vệ thương hiệu số trên Internet." },
  { id: "email", name: "Email doanh nghiệp", slug: "email-doanh-nghiep", icon: "mail", description: "Email theo tên miền riêng, chuyên nghiệp và bảo mật cho đội ngũ." },
  { id: "ssl", name: "SSL / TLS", slug: "ssl", icon: "verified_user", description: "Mã hóa kết nối và tăng độ tin cậy cho mọi điểm chạm của khách hàng." },
  { id: "firewall", name: "Firewall chống DDoS", slug: "firewall-chong-ddos", icon: "shield", description: "Lớp bảo vệ chủ động trước lưu lượng bất thường và tấn công mạng." },
];

const benefits = [
  { icon: "speed", title: "Triển khai trong vài phút", text: "Khởi tạo hạ tầng nhanh, cấu hình rõ ràng và sẵn sàng đưa dự án vào vận hành." },
  { icon: "monitoring", title: "Giám sát 24/7", text: "Theo dõi tình trạng máy chủ liên tục để bạn yên tâm tập trung phát triển kinh doanh." },
  { icon: "security", title: "Bảo mật nhiều lớp", text: "Firewall, SSL/TLS và chính sách sao lưu giúp dữ liệu luôn được bảo vệ chủ động." },
  { icon: "support_agent", title: "Đồng hành tận tâm", text: "Đội ngũ kỹ thuật phản hồi nhanh, tư vấn đúng nhu cầu và ngân sách thực tế." },
];

const trustStats = [
  { value: "99.9%", label: "Uptime cam kết" },
  { value: "10Gbps", label: "Băng thông quốc tế" },
  { value: "24/7", label: "Hỗ trợ kỹ thuật" },
  { value: "5 phút", label: "Thời gian khởi tạo" },
];

function formatPrice(price?: number) {
  if (typeof price !== "number") return "Liên hệ";
  return `${price.toLocaleString("vi-VN")}đ`;
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Home() {
  const homeRef = useRef<HTMLElement | null>(null);
  const [slogan, setSlogan] = useState("Hạ tầng Cloud mạnh mẽ cho mọi ý tưởng.");
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [featuredPlans, setFeaturedPlans] = useState<ServicePlan[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatusMap>({ services: "loading", plans: "loading", promotions: "loading", news: "loading" });

  useEffect(() => {
    let cancelled = false;

    requestJson("/api/SiteSettings/public")
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          const found = data.find((item: { key?: string }) => item.key === "Slogan");
          if (found?.value) setSlogan(found.value);
        }
      })
      .catch(() => undefined);

    const loadHomepageData = async () => {
      const endpoints: Record<ApiKey, string> = {
        services: "/api/ServiceCategories?PageNumber=1&PageSize=6",
        plans: "/api/ServicePlans?PageNumber=1&PageSize=3",
        promotions: "/api/Promotions?PageNumber=1&PageSize=3&onlyActive=true",
        news: "/api/NewsArticles?onlyPublished=true&pageNumber=1&pageSize=3",
      };
      const results = await Promise.allSettled(Object.entries(endpoints).map(async ([key, url]) => [key as ApiKey, await requestJson(url)] as const));
      if (cancelled) return;

      const nextStatus: Partial<ApiStatusMap> = {};
      results.forEach((result) => {
        if (result.status === "rejected") return;
        const [key, data] = result.value;
        const items = Array.isArray(data?.data) ? data.data : [];
        nextStatus[key] = items.length > 0 ? "live" : "fallback";
        if (key === "services") setServices(items.filter((service: ServiceCategory) => service.isActive !== false).slice(0, 6));
        if (key === "plans") setFeaturedPlans(items.filter((plan: ServicePlan) => plan.isActive !== false).slice(0, 3));
        if (key === "promotions") setActivePromotions(items.slice(0, 3));
        if (key === "news") setLatestNews(items.slice(0, 3));
      });
      (Object.keys(endpoints) as ApiKey[]).forEach((key) => {
        if (!nextStatus[key]) nextStatus[key] = "error";
      });
      setApiStatus((current) => ({ ...current, ...nextStatus }));
    };

    loadHomepageData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-home-reveal]"));
    if (typeof IntersectionObserver === "undefined") {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [apiStatus]);

  useEffect(() => {
    const home = homeRef.current;
    const hero = home?.querySelector<HTMLElement>(".home-hero");
    if (!home || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const bounds = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(bounds.height, 1)));
      const shift = Math.max(-1, Math.min(1, -bounds.top / Math.max(window.innerHeight, 1)));
      home.style.setProperty("--home-scroll-progress", progress.toFixed(3));
      home.style.setProperty("--hero-scroll-shift", `${(shift * 42).toFixed(1)}px`);
      home.style.setProperty("--hero-aurora-shift", `${(shift * -70).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const visibleServices = services.length > 0 ? services : fallbackServices;
  const spotlightPromotion = activePromotions[0];
  const serviceIsLoading = apiStatus.services === "loading";
  const plansAreLoading = apiStatus.plans === "loading";
  const newsIsLoading = apiStatus.news === "loading";

  return (
    <main ref={homeRef} className="home-page flex-grow pt-16 overflow-hidden">
      <div className="home-scroll-progress" aria-hidden="true" />
      <section className="home-hero relative overflow-hidden">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="hero-aurora" />
        <div className="hero-scanline" />
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-gutter relative z-10">
          <div className="flex items-center gap-sm pt-8 text-[length:var(--text-label-caps)] text-blue-100/75">
            <span className="status-dot" />
            <span>Hệ thống đang hoạt động ổn định</span>
            <span className="hidden sm:inline text-blue-200/40">•</span>
            <span className="hidden sm:inline">99.9% uptime SLA</span>
          </div>
          <div className="hero-ticker"><span className="status-dot status-dot-small" /><strong>LIVE</strong><span>Hạ tầng đang phục vụ doanh nghiệp Việt Nam</span><Icon name="arrow_forward" className="text-[14px] text-cyan-300" /></div>

          <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 xl:gap-20 items-center pt-12 pb-16 lg:pt-16 lg:pb-20">
            <div className="max-w-[40rem]">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/10 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-cyan-100 uppercase backdrop-blur-sm">
                <Icon name="auto_awesome" className="text-[16px] text-cyan-300" />
                Cloud infrastructure cho doanh nghiệp Việt
              </div>
              <h1 className="mt-7 text-5xl sm:text-6xl xl:text-[76px] xl:leading-[1.03] font-bold tracking-[-0.055em] text-white">
                Xây nền tảng.
                <span className="block hero-title-gradient">Mở rộng tương lai.</span>
              </h1>
              <p className="mt-7 max-w-[36rem] text-lg leading-8 text-blue-100/75">
                {slogan} Triển khai VPS, Hosting, Domain và các giải pháp bảo mật trên hạ tầng ổn định, minh bạch và sẵn sàng tăng trưởng.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link href="/pricing" className="home-primary-button group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#07327d] shadow-[0_15px_45px_rgba(40,142,255,0.28)]">
                  Bắt đầu ngay
                  <Icon name="arrow_forward" className="text-[19px] transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
                  Khám phá dịch vụ
                  <Icon name="north_east" className="text-[18px]" />
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6">
                {trustStats.slice(0, 3).map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-blue-100/55">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
              <div className="hero-dashboard-glow" />
              <div className="hero-dashboard relative overflow-hidden rounded-[26px] border border-white/20 bg-[#0a2348]/90 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff6a6a]" /><span className="h-2 w-2 rounded-full bg-[#ffcf5c]" /><span className="h-2 w-2 rounded-full bg-[#65dd95]" /></div>
                    <span className="ml-2 text-[11px] font-medium text-blue-100/50">cloudnova / overview</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="status-dot status-dot-small" /> All systems operational</div>
                </div>
                <div className="grid sm:grid-cols-[1.02fr_0.98fr] gap-3 p-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.16em] text-blue-100/40">Network traffic</p><p className="mt-2 text-2xl font-semibold text-white">8.42 <span className="text-sm font-normal text-blue-100/45">Gbps</span></p></div><Icon name="monitoring" className="text-cyan-300" /></div>
                    <div className="mt-7 flex h-28 items-end gap-1.5 border-b border-l border-white/10 px-2 pb-0">
                      {[31, 45, 38, 55, 42, 67, 53, 71, 64, 79, 67, 91, 76, 88, 96, 82].map((height, index) => <span key={index} className="chart-bar" style={{ height: `${height}%`, opacity: `${0.34 + index / 28}` }} />)}
                    </div>
                    <div className="mt-3 flex justify-between text-[10px] text-blue-100/35"><span>09:00</span><span>12:00</span><span>15:00</span><span>Now</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"><div className="flex items-center justify-between text-[10px] text-blue-100/45"><span>CPU Usage</span><Icon name="memory" className="text-[17px] text-violet-300" /></div><div className="mt-3 flex items-end justify-between"><span className="text-2xl font-semibold text-white">24.8%</span><span className="text-[10px] text-emerald-300">−3.2%</span></div><div className="metric-track mt-3"><span className="metric-fill w-[25%] bg-violet-400" /></div></div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"><div className="flex items-center justify-between text-[10px] text-blue-100/45"><span>Memory Allocation</span><Icon name="storage" className="text-[17px] text-cyan-300" /></div><div className="mt-3 flex items-end justify-between"><span className="text-2xl font-semibold text-white">6.2 <small className="text-sm font-normal text-blue-100/45">/ 16 GB</small></span><span className="text-[10px] text-cyan-300">38.7%</span></div><div className="metric-track mt-3"><span className="metric-fill w-[39%] bg-cyan-400" /></div></div>
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.08] p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-200"><Icon name="verified" className="text-[16px]" /> Server health</div><p className="mt-2 text-lg font-semibold text-white">Excellent</p><p className="mt-1 text-[10px] text-emerald-100/55">Checked a few seconds ago</p></div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/15 px-4 py-3 text-[10px] text-blue-100/45"><span>node-hcm-01.cloudnova.vn</span><span className="flex items-center gap-1.5 text-emerald-300"><span className="status-dot status-dot-small" /> 100% available</span></div>
              </div>
              <div className="floating-chip floating-chip-top"><Icon name="bolt" className="text-[17px] text-amber-300" /><span><b className="block text-[11px] text-white">Ultra fast</b><small className="text-[9px] text-blue-100/50">NVMe SSD storage</small></span></div>
              <div className="floating-chip floating-chip-bottom"><Icon name="shield_lock" className="text-[17px] text-cyan-300" /><span><b className="block text-[11px] text-white">Protected</b><small className="text-[9px] text-blue-100/50">DDoS mitigation active</small></span></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint"><span>Cuộn để khám phá</span><Icon name="south" className="text-[16px]" /></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8faff] to-transparent" />
      </section>

      <section data-home-reveal className="trust-strip home-section-reveal relative z-10 -mt-1 border-y border-[#dfe8f7] bg-white/90">
        <div className="max-w-[var(--spacing-container-max)] mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 px-gutter">
          {trustStats.map((stat, index) => <div data-reveal key={stat.label} className={`flex items-center gap-3 py-5 ${index > 1 ? "hidden md:flex" : ""} ${index !== 0 ? "md:border-l md:border-[#e7edf7] md:pl-8" : ""}`}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef5ff] text-primary"><Icon name={["verified", "language", "support_agent", "rocket_launch"][index]} className="text-[19px]" /></span><div><p className="text-lg font-bold text-[#0b1c30]">{stat.value}</p><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#73819a]">{stat.label}</p></div></div>)}
        </div>
      </section>

      <section data-home-reveal className="home-section-reveal bg-[#f8faff] px-gutter py-20 lg:py-28">
        <div className="max-w-[var(--spacing-container-max)] mx-auto">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-[40rem]">
              <div className="flex flex-wrap items-center gap-3"><p className="section-eyebrow">Hệ sinh thái dịch vụ</p><ApiBadge status={apiStatus.services} /></div>
              <h2 className="section-title mt-3">Một nền tảng cho mọi<br className="hidden sm:block" /> bước tiến số.</h2>
              <p className="section-description mt-4">Từ ý tưởng đầu tiên đến hệ thống phục vụ hàng triệu người dùng, CloudNova cung cấp đầy đủ những mảnh ghép bạn cần.</p>
            </div>
            <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-bold text-primary">Xem tất cả dịch vụ <Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceIsLoading ? Array.from({ length: 6 }).map((_, index) => <DataSkeleton key={index} variant="service" />) : visibleServices.map((service, index) => <Link key={service.id} href={`/services/${service.slug || ""}`} data-reveal className={`service-card group ${index === 0 ? "lg:col-span-2 lg:flex lg:items-end" : ""}`}><div className="service-card-shine" /><div className={`relative z-10 flex h-full flex-col ${index === 0 ? "lg:flex-row lg:items-end lg:justify-between lg:gap-10" : ""}`}><div><div className="service-icon"><Icon name={service.icon || "cloud"} className="text-[22px]" /></div><h3 className="mt-6 text-xl font-bold tracking-[-0.02em] text-[#0b1c30]">{service.name}</h3><p className="mt-3 max-w-[27rem] text-sm leading-6 text-[#63718b]">{service.description || "Giải pháp hạ tầng ổn định, bảo mật và dễ dàng mở rộng."}</p></div><span className="mt-8 inline-flex h-10 w-10 items-center justify-center self-end rounded-full border border-[#d9e4f4] text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-white"><Icon name="arrow_outward" className="text-[18px]" /></span></div></Link>)}
          </div>
        </div>
      </section>

      <section data-home-reveal className="home-section-reveal bg-white px-gutter py-20 lg:py-28">
        <div className="max-w-[var(--spacing-container-max)] mx-auto grid lg:grid-cols-[0.86fr_1.14fr] gap-14 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="section-eyebrow">Vì sao chọn CloudNova?</p>
            <h2 className="section-title mt-3">Không chỉ là máy chủ.<br /><span className="text-primary">Đó là sự an tâm.</span></h2>
            <p className="section-description mt-5">Hạ tầng tốt giúp đội ngũ đi nhanh hơn. Chúng tôi tập trung vào hiệu năng, sự minh bạch và trải nghiệm hỗ trợ để bạn có thể tập trung vào sản phẩm của mình.</p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#d8e2f0] px-5 py-3 text-sm font-bold text-[#193152] transition hover:border-primary hover:text-primary">Tìm hiểu về CloudNova <Icon name="north_east" className="text-[18px]" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit, index) => <div data-reveal key={benefit.title} className={`benefit-card ${index === 0 ? "sm:translate-y-8" : ""}`}><div className="flex items-center justify-between"><div className="benefit-icon"><Icon name={benefit.icon} className="text-[21px]" /></div><span className="text-xs font-bold text-[#b6c2d4]">0{index + 1}</span></div><h3 className="mt-12 text-lg font-bold text-[#0b1c30]">{benefit.title}</h3><p className="mt-3 text-sm leading-6 text-[#6e7d95]">{benefit.text}</p></div>)}
          </div>
        </div>
      </section>

      <section data-home-reveal className="home-section-reveal bg-[#f1f5fc] px-gutter py-20 lg:py-28">
        <div className="max-w-[var(--spacing-container-max)] mx-auto">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="flex flex-wrap items-center gap-3"><p className="section-eyebrow">Bảng giá minh bạch</p><ApiBadge status={apiStatus.plans} /></div><h2 className="section-title mt-3">Bắt đầu nhỏ.<br className="sm:hidden" /> Sẵn sàng lớn.</h2><p className="section-description mt-4">Chọn cấu hình phù hợp hôm nay, nâng cấp bất cứ lúc nào khi doanh nghiệp phát triển.</p></div><Link href="/pricing" className="group inline-flex items-center gap-2 text-sm font-bold text-primary">Xem bảng giá đầy đủ <Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" /></Link></div>
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {plansAreLoading ? Array.from({ length: 3 }).map((_, index) => <DataSkeleton key={index} variant="plan" />) : featuredPlans.length > 0 ? featuredPlans.map((plan, index) => <article key={plan.id} data-reveal className={`price-card ${index === 1 ? "price-card-featured" : ""}`}><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-[#eaf1ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary">{plan.category?.name || "Cloud"}</span><h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#0b1c30]">{plan.name}</h3></div>{index === 1 && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">Phổ biến</span>}</div><p className="mt-3 min-h-10 text-sm leading-6 text-[#6e7d95]">{plan.description || "Cấu hình cân bằng cho website và ứng dụng đang tăng trưởng."}</p><div className="mt-8 border-t border-[#e5ebf4] pt-6"><span className="text-xs text-[#7c899d]">Từ</span><p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#0b1c30]">{formatPrice(plan.prices?.[0]?.price)}<span className="text-sm font-medium text-[#7c899d]"> / tháng</span></p></div><Link href="/pricing" className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${index === 1 ? "bg-primary text-white hover:bg-[#0639a0]" : "border border-[#d4dfef] text-[#17345e] hover:border-primary hover:text-primary"}`}>Xem chi tiết <Icon name="arrow_forward" className="text-[17px]" /></Link></article>) : ["VPS Starter", "VPS Business", "VPS Enterprise"].map((name, index) => <article key={name} data-reveal className={`price-card ${index === 1 ? "price-card-featured" : ""}`}><div className="flex items-start justify-between"><span className="rounded-full bg-[#eaf1ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Cloud VPS</span>{index === 1 && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">Phổ biến</span>}</div><h3 className="mt-5 text-2xl font-bold text-[#0b1c30]">{name}</h3><p className="mt-3 min-h-10 text-sm leading-6 text-[#6e7d95]">Cấu hình linh hoạt cho từng giai đoạn phát triển.</p><div className="mt-8 border-t border-[#e5ebf4] pt-6"><span className="text-xs text-[#7c899d]">Từ</span><p className="mt-1 text-3xl font-bold text-[#0b1c30]">Liên hệ</p></div><Link href="/contact" className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${index === 1 ? "bg-primary text-white" : "border border-[#d4dfef] text-[#17345e]"}`}>Tư vấn cấu hình <Icon name="arrow_forward" className="text-[17px]" /></Link></article>)}
          </div>
        </div>
      </section>

      <section data-home-reveal className="home-section-reveal bg-white px-gutter py-20 lg:py-28">
        <div className="max-w-[var(--spacing-container-max)] mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-5">
          <div className="promo-panel relative overflow-hidden rounded-[26px] p-8 sm:p-12"><div className="promo-panel-grid" /><div className="relative z-10 max-w-[36rem]"><div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200"><span className="flex items-center gap-2"><Icon name="local_fire_department" className="text-[18px]" /> Ưu đãi dành cho bạn</span><ApiBadge status={apiStatus.promotions} /></div><h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">Hạ tầng tốt hơn.<br /><span className="text-cyan-300">Chi phí hợp lý hơn.</span></h2><p className="mt-4 max-w-[30rem] text-sm leading-6 text-blue-100/65">{spotlightPromotion?.description || "Khởi động dự án mới với ưu đãi hấp dẫn cho các gói dịch vụ Cloud đang được quan tâm."}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><Link href="/promotions" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#07327d]">Xem ưu đãi <Icon name="arrow_forward" className="text-[17px]" /></Link>{spotlightPromotion?.discountPercentage ? <span className="text-sm font-semibold text-cyan-100">Tiết kiệm đến {spotlightPromotion.discountPercentage}%</span> : <span className="text-sm font-semibold text-cyan-100">Ưu đãi có thời hạn</span>}</div></div><div className="promo-sphere" /></div>
          <div className="rounded-[26px] border border-[#e1e9f5] bg-[#f8faff] p-7 sm:p-9"><div className="flex items-center justify-between"><div><div className="flex flex-wrap items-center gap-3"><p className="section-eyebrow">Góc kiến thức</p><ApiBadge status={apiStatus.news} /></div><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#0b1c30]">Tin mới từ CloudNova</h2></div><Link href="/news" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d5e0ef] text-primary transition hover:bg-primary hover:text-white"><Icon name="arrow_outward" className="text-[17px]" /></Link></div><div className="mt-7 divide-y divide-[#e2eaf5]">{newsIsLoading ? <DataSkeleton variant="news" /> : latestNews.length > 0 ? latestNews.map((article) => <Link href={`/news/${article.id}`} key={article.id} data-reveal className="group block py-4 first:pt-0"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{article.category || "Tin tức"}</span><Icon name="arrow_forward" className="text-[16px] text-[#aab8ca] transition group-hover:translate-x-1 group-hover:text-primary" /></div><h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#203654] transition group-hover:text-primary">{article.title || "Cập nhật mới từ CloudNova"}</h3><p className="mt-2 text-[11px] text-[#8b98aa]">{article.createdAt ? new Date(article.createdAt).toLocaleDateString("vi-VN") : "Mới cập nhật"}</p></Link>) : ["5 điều cần biết trước khi triển khai Cloud VPS", "Tối ưu website để tăng tốc độ và trải nghiệm người dùng", "Bảo mật nhiều lớp cho hạ tầng doanh nghiệp"].map((title, index) => <Link href="/news" key={title} data-reveal className="group block py-4 first:pt-0"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{index === 0 ? "Hướng dẫn" : "Kiến thức"}</span><Icon name="arrow_forward" className="text-[16px] text-[#aab8ca] transition group-hover:translate-x-1 group-hover:text-primary" /></div><h3 className="mt-2 text-sm font-bold leading-5 text-[#203654] transition group-hover:text-primary">{title}</h3><p className="mt-2 text-[11px] text-[#8b98aa]">Cập nhật gần đây</p></Link>)}</div></div>
        </div>
      </section>

      <section data-home-reveal className="home-section-reveal bg-[#f8faff] px-gutter py-20 lg:py-28">
        <div className="max-w-[var(--spacing-container-max)] mx-auto"><div className="mx-auto max-w-[38rem] text-center"><p className="section-eyebrow">Khách hàng nói gì</p><h2 className="section-title mt-3">Được tin tưởng để<br />vận hành mỗi ngày.</h2></div><div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"><blockquote data-reveal className="quote-card md:translate-y-5"><div className="flex gap-1 text-amber-400"><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /></div><p className="mt-6 text-base leading-7 text-[#314766]">“Dịch vụ VPS ổn định, hỗ trợ kỹ thuật nhanh chóng. Đội ngũ CloudNova luôn phản hồi rất có trách nhiệm.”</p><footer className="mt-8 flex items-center gap-3"><span className="avatar-circle">NA</span><span><b className="block text-sm text-[#0b1c30]">Nguyễn Anh</b><small className="text-xs text-[#8390a3]">Founder, ABC Tech</small></span></footer></blockquote><blockquote className="quote-card"><div className="flex gap-1 text-amber-400"><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /></div><p className="mt-6 text-base leading-7 text-[#314766]">“Chuyển hệ thống lên Cloud rất nhẹ nhàng. Chi phí rõ ràng và hiệu năng tốt hơn hẳn so với trước đây.”</p><footer className="mt-8 flex items-center gap-3"><span className="avatar-circle avatar-purple">ML</span><span><b className="block text-sm text-[#0b1c30]">Minh Linh</b><small className="text-xs text-[#8390a3]">CTO, Studio 11</small></span></footer></blockquote><blockquote data-reveal className="quote-card md:translate-y-5"><div className="flex gap-1 text-amber-400"><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /><Icon name="star" className="text-[17px] filled-icon" /></div><p className="mt-6 text-base leading-7 text-[#314766]">“Website luôn nhanh và ổn định dù lượng truy cập tăng. Đây là lựa chọn rất đáng tin cậy cho doanh nghiệp.”</p><footer className="mt-8 flex items-center gap-3"><span className="avatar-circle avatar-cyan">TH</span><span><b className="block text-sm text-[#0b1c30]">Thanh Hà</b><small className="text-xs text-[#8390a3]">CEO, Retail Hub</small></span></footer></blockquote></div></div>
      </section>

      <section data-home-reveal className="home-section-reveal home-cta relative overflow-hidden px-gutter py-20 lg:py-24"><div className="cta-rings" /><div className="relative z-10 mx-auto max-w-[46rem] text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Sẵn sàng bắt đầu?</p><h2 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl">Đưa ý tưởng của bạn<br /><span className="text-cyan-300">lên một tầm cao mới.</span></h2><p className="mx-auto mt-5 max-w-[34rem] text-base leading-7 text-blue-100/65">Hãy để CloudNova đồng hành cùng bạn xây dựng một nền tảng nhanh, an toàn và sẵn sàng mở rộng.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#07327d]">Khám phá bảng giá <Icon name="arrow_forward" className="text-[18px]" /></Link><Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white">Liên hệ tư vấn <Icon name="support_agent" className="text-[18px]" /></Link></div></div></section>
    </main>
  );
}
