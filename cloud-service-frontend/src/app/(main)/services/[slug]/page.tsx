"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";

type ServicePlan = {
    id: string;
    name: string;
    description: string;
    specifications: string;
    isActive: boolean;
    prices?: { id: string; billingCycle: string; price: number; setupFee?: number | null; isActive: boolean }[];
    category?: { name?: string };
};

type ServiceCategory = {
    slug: string;
    name: string;
    description?: string;
    detailTitle?: string;
    icon?: string;
    featuresJson?: string;
};

type ServiceConfig = {
    title: string;
    eyebrow: string;
    description: string;
    icon: string;
    keywords: string[];
    features: string[];
};

const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
    hosting: {
        title: "Web Hosting ổn định, dễ quản lý",
        eyebrow: "Web Hosting",
        description: "Lưu trữ website nhanh và an toàn với SSD/NVMe, SSL miễn phí cùng công cụ quản trị thân thiện.",
        icon: "web",
        keywords: ["hosting", "web"],
        features: ["SSD/NVMe Storage", "Free SSL Certificate", "Auto Backup daily", "Integrated Email"],
    },
    domain: {
        title: "Tên miền cho thương hiệu của bạn",
        eyebrow: "Domain",
        description: "Đăng ký tên miền quốc tế và Việt Nam, quản lý DNS tập trung và bảo vệ thông tin đăng ký.",
        icon: "public",
        keywords: ["domain", "tên miền"],
        features: ["International domains", "Advanced DNS Management", "Free WHOIS Protection", "Auto Renewal options"],
    },
    email: {
        title: "Business Email chuyên nghiệp",
        eyebrow: "Business Email",
        description: "Email doanh nghiệp theo tên miền riêng với dung lượng linh hoạt, giao diện hiện đại và chống spam.",
        icon: "mail",
        keywords: ["email", "mail"],
        features: ["Custom domains", "Advanced Spam Protection", "Large storage quotas", "Modern Webmail UI"],
    },
    ssl: {
        title: "SSL Certificate bảo vệ website",
        eyebrow: "SSL Certificate",
        description: "Tăng độ tin cậy cho website bằng HTTPS và mã hóa dữ liệu truyền tải với chứng chỉ phù hợp.",
        icon: "lock",
        keywords: ["ssl", "certificate", "bảo mật"],
        features: ["Secure HTTPS", "256-bit Encryption", "Domain Validation (DV)", "High Browser Trust"],
    },
    security: {
        title: "DDoS Firewall bảo vệ hạ tầng",
        eyebrow: "DDoS Firewall",
        description: "Giám sát và lọc lưu lượng thông minh để giảm thiểu rủi ro từ các cuộc tấn công mạng quy mô lớn.",
        icon: "shield",
        keywords: ["security", "bảo mật", "ddos", "firewall"],
        features: ["Intelligent Traffic Filtering", "L3/4/7 Protection", "Real-time Monitoring", "Custom Rulesets"],
    },
};

const API_BASE_URL = "";

function parseFeatures(value: string | undefined, fallback: string[]) {
    try {
        const parsed = JSON.parse(value || "[]");
        return Array.isArray(parsed) && parsed.length > 0 ? parsed.filter(item => typeof item === "string") : fallback;
    } catch {
        return fallback;
    }
}

function parseSpecifications(specifications: string) {
    try {
        const parsed = JSON.parse(specifications || "{}");
        return Object.entries(parsed).filter(([, value]) => value !== null && value !== undefined && value !== "");
    } catch {
        return [];
    }
}

export default function ServiceDetailsPage() {
    const params = useParams<{ slug: string }>();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const config = SERVICE_CONFIGS[slug] || SERVICE_CONFIGS.hosting;
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: "1900 xxxx", email: "contact@cloudnova.vn" });
    const [categoryContent, setCategoryContent] = useState<ServiceCategory | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            fetch(`${API_BASE_URL}/api/ServicePlans?PageNumber=1&PageSize=100`, { signal: controller.signal }),
            fetch(`${API_BASE_URL}/api/SiteSettings/public`, { signal: controller.signal }),
            fetch(`${API_BASE_URL}/api/ServiceCategories?PageNumber=1&PageSize=100`, { signal: controller.signal }),
        ])
            .then(async ([plansResponse, settingsResponse, categoriesResponse]) => {
                if (plansResponse.ok) {
                    const result = await plansResponse.json();
                    const data = Array.isArray(result?.data) ? result.data : [];
                    setPlans(data.filter((plan: ServicePlan) => plan.isActive !== false));
                }
                if (categoriesResponse.ok) {
                    const result = await categoriesResponse.json();
                    const categories = Array.isArray(result?.data) ? result.data : [];
                    const selected = categories.find((category: ServiceCategory) => category.slug?.toLowerCase() === slug.toLowerCase()) || categories.find((category: ServiceCategory) => config.keywords.some(keyword => `${category.name} ${category.slug}`.toLowerCase().includes(keyword)));
                    if (selected) setCategoryContent(selected);
                }
                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json();
                    if (Array.isArray(settings)) {
                        const phone = settings.find(setting => setting.key === "PhoneNumber");
                        const email = settings.find(setting => setting.key === "ContactEmail");
                        setContactInfo({ phone: phone?.value || "1900 xxxx", email: email?.value || "contact@cloudnova.vn" });
                    }
                }
            })
            .catch(error => {
                if (error.name !== "AbortError") console.error("Không thể tải dữ liệu dịch vụ:", error);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });
        return () => controller.abort();
    }, []);

    const displayConfig = useMemo(() => ({
        ...config,
        title: categoryContent?.detailTitle || config.title,
        description: categoryContent?.description || config.description,
        icon: categoryContent?.icon || config.icon,
        features: parseFeatures(categoryContent?.featuresJson, config.features),
    }), [categoryContent, config]);

    const detailPlans = useMemo(() => {
        const matching = plans.filter(plan => {
            const text = `${plan.category?.name || ""} ${plan.name} ${plan.description}`.toLowerCase();
            return displayConfig.keywords.some(keyword => text.includes(keyword));
        });
        return matching.length > 0 ? matching : plans.filter(plan => plan.category?.name?.toLowerCase() === displayConfig.eyebrow.toLowerCase());
    }, [plans, displayConfig]);

    return (
        <main className="flex-grow bg-surface">
            <section className="relative overflow-hidden bg-background px-gutter py-3xl">
                <div className="relative z-10 mx-auto grid max-w-container-max grid-cols-1 items-center gap-2xl lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <Link href="/services" className="mb-lg inline-flex items-center gap-xs text-sm font-semibold text-primary hover:underline"><span className="material-symbols-outlined text-lg">arrow_back</span>Tất cả dịch vụ</Link>
                        <p className="mb-sm font-label-caps text-label-caps uppercase tracking-wider text-primary">{displayConfig.eyebrow}</p>
                        <h1 className="mb-md font-display-lg text-display-lg text-on-background">{displayConfig.title}</h1>
                        <p className="mb-xl max-w-[42rem] font-body-lg text-body-lg text-secondary">{displayConfig.description}</p>
                        <div className="flex flex-col gap-md sm:flex-row">
                            <button onClick={() => setIsContactOpen(true)} className="rounded-lg bg-primary px-lg py-md font-semibold text-on-primary hover:bg-primary/90">Tư vấn dịch vụ</button>
                            <button onClick={() => setIsContactOpen(true)} className="rounded-lg border border-primary px-lg py-md font-semibold text-primary hover:bg-primary/5">Liên hệ kinh doanh</button>
                        </div>
                    </div>
                    <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low p-xl shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                        <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-primary/10"><div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary shadow-[0_0_40px_rgba(0,97,255,0.35)]"><span className="material-symbols-outlined text-6xl text-on-primary">{displayConfig.icon}</span></div></div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-container-max px-gutter py-3xl">
                <div className="mb-2xl text-center"><h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Gói {displayConfig.eyebrow}</h2><p className="font-body-md text-body-md text-secondary">Các gói dưới đây được lấy trực tiếp từ dữ liệu dịch vụ đang hoạt động.</p></div>
                <div className="mb-2xl grid grid-cols-1 gap-lg md:grid-cols-2">
                    {displayConfig.features.map(feature => <div key={feature} className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-on-surface"><span className="material-symbols-outlined text-primary">check_circle</span>{feature}</div>)}
                </div>
                {isLoading ? <div className="py-2xl text-center text-secondary">Đang tải các gói dịch vụ...</div> : detailPlans.length === 0 ? <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center text-secondary">Hiện chưa có gói {displayConfig.eyebrow} đang hoạt động.</div> : <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">{detailPlans.map(plan => { const price = plan.prices?.find(item => item.isActive !== false); const specs = parseSpecifications(plan.specifications); return <article key={plan.id} className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"><p className="mb-sm font-label-caps text-label-caps uppercase tracking-wider text-primary">{plan.category?.name || displayConfig.eyebrow}</p><h3 className="mb-sm font-headline-md text-headline-md text-on-background">{plan.name}</h3><p className="mb-lg min-h-12 text-secondary">{plan.description || displayConfig.description}</p><div className="mb-xl flex-1 space-y-sm border-y border-outline-variant py-md">{specs.length > 0 ? specs.map(([key, value]) => <div key={key} className="flex justify-between gap-md text-sm"><span className="text-secondary">{key}</span><strong>{String(value)}</strong></div>) : <p className="text-sm text-secondary">Liên hệ để nhận thông tin chi tiết.</p>}</div><div className="flex items-center justify-between gap-md"><span className="font-semibold text-primary">{price ? `${price.price.toLocaleString("vi-VN")} đ/${price.billingCycle === "Yearly" ? "năm" : "tháng"}` : "Liên hệ"}</span><Link href={`/pricing?plan=${plan.id}`} className="rounded-lg bg-primary px-md py-sm text-sm font-semibold text-on-primary hover:bg-primary/90">Đăng ký gói</Link></div></article>; })}</div>}
            </section>

            <section className="bg-primary-container px-gutter py-3xl text-center text-on-primary-container"><h2 className="mb-md font-headline-lg text-headline-lg">Cần tư vấn lựa chọn gói?</h2><p className="mx-auto mb-xl max-w-[42rem] text-body-lg opacity-80">Hãy để CloudNova đề xuất phương án phù hợp với nhu cầu và ngân sách của bạn.</p><button onClick={() => setIsContactOpen(true)} className="rounded-lg bg-surface-container-lowest px-xl py-md font-semibold text-primary shadow-sm">Nhận tư vấn miễn phí</button></section>

            <Modal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} title="Thông tin liên hệ" maxWidth="max-w-[30rem]" footer={<button onClick={() => setIsContactOpen(false)} className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-on-primary">Đóng</button>}><div className="space-y-4 py-4 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20"><span className="material-symbols-outlined text-3xl text-primary">support_agent</span></div><p className="text-body-lg text-on-surface">Vui lòng liên hệ với chúng tôi để được tư vấn chi tiết:</p><div className="rounded-xl border border-outline-variant p-4"><a href={`tel:${contactInfo.phone}`} className="mb-3 flex justify-center gap-3 font-semibold hover:text-primary"><span className="material-symbols-outlined text-primary">call</span>{contactInfo.phone}</a><a href={`mailto:${contactInfo.email}`} className="flex justify-center gap-3 text-primary hover:underline"><span className="material-symbols-outlined">mail</span>{contactInfo.email}</a></div></div></Modal>
        </main>
    );
}
