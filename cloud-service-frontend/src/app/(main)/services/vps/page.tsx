"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";

type ServiceCategory = { slug?: string; name: string; description?: string; detailTitle?: string; icon?: string; featuresJson?: string };

type ServicePlan = {
    id: string;
    name: string;
    description: string;
    specifications: string;
    isActive: boolean;
    prices?: { id: string; billingCycle: string; price: number; setupFee?: number | null; isActive: boolean }[];
    category?: { name?: string };
};

export default function VpsDetailsPage() {
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: "1900 xxxx", email: "contact@cloudnova.vn" });
    const [categoryContent, setCategoryContent] = useState<ServiceCategory | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/ServicePlans?PageNumber=1&PageSize=100"),
            fetch("/api/SiteSettings/public"),
            fetch("/api/ServiceCategories?PageNumber=1&PageSize=100")
        ])
            .then(async ([plansResponse, settingsResponse, categoriesResponse]) => {
                if (plansResponse.ok) {
                    const data = await plansResponse.json();
                    const availablePlans = Array.isArray(data?.data) ? data.data : [];
                    setPlans(availablePlans.filter((plan: ServicePlan) => plan.isActive !== false));
                }
                if (categoriesResponse.ok) {
                    const result = await categoriesResponse.json();
                    const categories = Array.isArray(result?.data) ? result.data : [];
                    const selected = categories.find((category: ServiceCategory) => category.slug?.toLowerCase() === "vps") || categories.find((category: ServiceCategory) => `${category.name} ${category.slug || ""}`.toLowerCase().includes("cloud"));
                    if (selected) setCategoryContent(selected);
                }
                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json();
                    if (Array.isArray(settings)) {
                        const phone = settings.find(setting => setting.key === "PhoneNumber");
                        const email = settings.find(setting => setting.key === "ContactEmail");
                        setContactInfo({
                            phone: phone?.value || "1900 xxxx",
                            email: email?.value || "contact@cloudnova.vn"
                        });
                    }
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const parseSpecifications = (specifications: string) => {
        try {
            const parsed = JSON.parse(specifications || "{}");
            return Object.entries(parsed).filter(([, value]) => value !== null && value !== undefined && value !== "");
        } catch {
            return [];
        }
    };

    const vpsPlans = useMemo(() => plans.filter(plan => {
        const categoryName = plan.category?.name?.toLowerCase() || "";
        return categoryName.includes("cloud") || categoryName.includes("vps") || plan.name.toLowerCase().includes("vps");
    }), [plans]);

    const displayedPlans = vpsPlans.length > 0 ? vpsPlans : plans;
    const detailTitle = categoryContent?.detailTitle || "Hạ tầng VPS mạnh mẽ cho mọi dự án";
    const detailDescription = categoryContent?.description || "Triển khai máy chủ ảo nhanh chóng với NVMe tốc độ cao, tài nguyên linh hoạt và quyền quản trị toàn diện.";
    const detailIcon = categoryContent?.icon || "dns";
    const defaultFeatures = ["vCPU & RAM linh hoạt", "NVMe siêu tốc", "Root Access toàn quyền", "99.9% Uptime Guarantee"];
    const detailFeatures = (() => { try { const parsed = JSON.parse(categoryContent?.featuresJson || "[]"); return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultFeatures; } catch { return defaultFeatures; } })();

    return (
        <main className="flex-grow bg-surface">
            <section className="relative overflow-hidden bg-background py-3xl px-gutter">
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
                <div className="relative z-10 mx-auto grid max-w-container-max grid-cols-1 items-center gap-2xl lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <Link href="/services" className="mb-lg inline-flex items-center gap-xs text-sm font-semibold text-primary hover:underline">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Tất cả dịch vụ
                        </Link>
                        <p className="mb-sm font-label-caps text-label-caps uppercase tracking-wider text-primary">Cloud VPS</p>
                        <h1 className="mb-md font-display-lg text-display-lg text-on-background">{detailTitle}</h1>
                        <p className="mb-xl max-w-[42rem] font-body-lg text-body-lg text-secondary">{detailDescription}</p>
                        <div className="flex flex-col gap-md sm:flex-row">
                            <button onClick={() => setIsContactModalOpen(true)} className="rounded-lg bg-primary px-lg py-md font-semibold text-on-primary transition-colors hover:bg-primary/90">
                                Tư vấn cấu hình VPS
                            </button>
                            <button onClick={() => setIsContactModalOpen(true)} className="rounded-lg border border-primary px-lg py-md font-semibold text-primary transition-colors hover:bg-primary/5">
                                Liên hệ kinh doanh
                            </button>
                        </div>
                    </div>
                    <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low p-xl shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                        <div className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-primary/10">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary shadow-[0_0_40px_rgba(0,97,255,0.35)]">
                                <span className="material-symbols-outlined text-6xl text-on-primary">{detailIcon}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-container-max px-gutter py-3xl">
                <div className="mb-2xl text-center">
                    <h2 className="mb-sm font-headline-lg text-headline-lg text-on-background">Chọn gói VPS phù hợp</h2>
                    <p className="font-body-md text-body-md text-secondary">Thông tin được lấy trực tiếp từ các gói dịch vụ đang hoạt động trong hệ thống.</p>
                </div>
                <div className="mb-2xl grid grid-cols-1 gap-lg md:grid-cols-2">
                    {detailFeatures.map((feature: string) => <div key={feature} className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-on-surface"><span className="material-symbols-outlined text-primary">check_circle</span>{feature}</div>)}
                </div>
                {isLoading ? (
                    <div className="py-2xl text-center text-secondary">Đang tải thông tin gói VPS...</div>
                ) : displayedPlans.length === 0 ? (
                    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center text-secondary">Hiện chưa có gói VPS đang hoạt động.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
                        {displayedPlans.map(plan => (
                            <article key={plan.id} className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                                <p className="mb-sm font-label-caps text-label-caps uppercase tracking-wider text-primary">{plan.category?.name || "Cloud VPS"}</p>
                                <h3 className="mb-sm font-headline-md text-headline-md text-on-background">{plan.name}</h3>
                                <p className="mb-lg min-h-12 font-body-md text-body-md text-secondary">{plan.description || "Gói VPS hiệu năng cao, ổn định và dễ mở rộng."}</p>
                                <div className="mb-xl space-y-sm border-y border-outline-variant py-md">
                                    {parseSpecifications(plan.specifications).length > 0 ? parseSpecifications(plan.specifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between gap-md text-sm">
                                            <span className="text-secondary">{key}</span>
                                            <strong className="text-on-surface">{String(value)}</strong>
                                        </div>
                                    )) : <p className="text-sm text-secondary">Liên hệ để nhận cấu hình chi tiết.</p>}
                                </div>
                                <div className="mt-auto flex items-center justify-between gap-md">
                                    <span className="font-semibold text-primary">
                                        {plan.prices?.find(price => price.isActive !== false)?.price?.toLocaleString("vi-VN") || "Liên hệ"}{plan.prices?.some(price => price.isActive !== false) ? " đ/tháng" : ""}
                                    </span>
                                    <Link href={`/pricing?plan=${plan.id}`} className="rounded-lg bg-primary px-md py-sm text-sm font-semibold text-on-primary hover:bg-primary/90">Đăng ký gói</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-primary-container px-gutter py-3xl text-center text-on-primary-container">
                <h2 className="mb-md font-headline-lg text-headline-lg">Chưa chắc nên chọn cấu hình nào?</h2>
                <p className="mx-auto mb-xl max-w-[42rem] font-body-lg text-body-lg opacity-80">Đội ngũ CloudNova sẽ tư vấn cấu hình phù hợp với lưu lượng, ngân sách và mục tiêu vận hành của bạn.</p>
                <button onClick={() => setIsContactModalOpen(true)} className="rounded-lg bg-surface-container-lowest px-xl py-md font-semibold text-primary shadow-sm hover:shadow-md">Nhận tư vấn miễn phí</button>
            </section>

            <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title="Thông tin liên hệ" maxWidth="max-w-[30rem]" footer={<button onClick={() => setIsContactModalOpen(false)} className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-on-primary shadow-sm">Đóng</button>}>
                <div className="space-y-4 py-4 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20"><span className="material-symbols-outlined text-3xl text-primary">support_agent</span></div>
                    <p className="font-body-lg text-on-surface">Vui lòng liên hệ với chúng tôi qua các kênh sau để được tư vấn chi tiết:</p>
                    <div className="mt-4 inline-block w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                        <a href={`tel:${contactInfo.phone}`} className="mb-3 flex items-center justify-center gap-3 font-semibold text-on-surface hover:text-primary"><span className="material-symbols-outlined text-primary">call</span>{contactInfo.phone}</a>
                        <a href={`mailto:${contactInfo.email}`} className="flex items-center justify-center gap-3 text-primary hover:underline"><span className="material-symbols-outlined text-primary">mail</span>{contactInfo.email}</a>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
