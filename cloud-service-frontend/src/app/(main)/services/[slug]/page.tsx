"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";

type PackageSpecification = {
    id: string;
    name: string;
    value: string;
    unit: string;
    displayOrder: number;
};

type ServicePlan = {
    id: string;
    name: string;
    description: string;
    specifications: string;
    packageSpecifications?: PackageSpecification[];
    isActive: boolean;
    prices?: { id: string; billingCycle: string; price: number; setupFee?: number | null; isActive: boolean }[];
    category?: { id: string; name?: string; slug?: string };
};

type ServiceFeature = {
    id: string;
    name: string;
    isActive: boolean;
    displayOrder: number;
};

type ServiceCategory = {
    id: string;
    slug: string;
    name: string;
    description?: string;
    detailTitle?: string;
    icon?: string;
    featuresJson?: string;
    serviceFeatures?: ServiceFeature[];
};

function getFeatures(category: ServiceCategory | null | undefined, fallback: string[]) {
    if (category?.serviceFeatures && category.serviceFeatures.length > 0) {
        return category.serviceFeatures
            .filter(f => f.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(f => f.name);
    }
    try {
        const parsed = JSON.parse(category?.featuresJson || "[]");
        return Array.isArray(parsed) && parsed.length > 0 ? parsed.filter(item => typeof item === "string") : fallback;
    } catch {
        return fallback;
    }
}

function getSpecifications(plan: ServicePlan) {
    if (plan.packageSpecifications && plan.packageSpecifications.length > 0) {
        return plan.packageSpecifications
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(s => [s.name, s.unit ? `${s.value} ${s.unit}` : s.value]);
    }
    try {
        const parsed = JSON.parse(plan.specifications || "{}");
        return Object.entries(parsed).filter(([, value]) => value !== null && value !== undefined && value !== "");
    } catch {
        return [];
    }
}

export default function ServiceDetailsPage() {
    const params = useParams<{ slug: string }>();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: "1900 xxxx", email: "contact@cloudnova.vn" });
    const [categoryContent, setCategoryContent] = useState<ServiceCategory | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            fetch(`/api/ServicePlans?PageNumber=1&PageSize=100`, { signal: controller.signal }),
            fetch(`/api/SiteSettings/public`, { signal: controller.signal }),
            fetch(`/api/ServiceCategories?PageNumber=1&PageSize=100`, { signal: controller.signal }),
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
                    const selected = categories.find((category: ServiceCategory) => category.slug?.toLowerCase() === slug.toLowerCase());
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
    }, [slug]);

    const displayConfig = useMemo(() => ({
        title: categoryContent?.detailTitle || categoryContent?.name || "Chi tiết dịch vụ",
        eyebrow: categoryContent?.name || "Dịch vụ",
        description: categoryContent?.description || "Thông tin dịch vụ đang được cập nhật.",
        icon: categoryContent?.icon || "dns",
        features: getFeatures(categoryContent, ["Hiệu năng cao", "Bảo mật & An toàn", "Hỗ trợ 24/7", "Dễ dàng mở rộng"]),
    }), [categoryContent]);

    const detailPlans = useMemo(() => {
        return plans.filter(plan => plan.category?.slug?.toLowerCase() === slug.toLowerCase() || plan.category?.id === categoryContent?.id);
    }, [plans, slug, categoryContent]);

    if (!isLoading && !categoryContent) {
        return (
            <main className="flex-grow bg-surface py-3xl px-gutter text-center">
                <div className="max-w-container-max mx-auto py-3xl">
                    <h1 className="font-headline-lg text-headline-lg text-on-background mb-md">Không tìm thấy dịch vụ</h1>
                    <p className="mb-lg text-secondary">Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị ẩn.</p>
                    <Link href="/services" className="text-on-primary bg-primary px-lg py-md rounded-lg hover:bg-primary/90">Quay lại danh sách dịch vụ</Link>
                </div>
            </main>
        );
    }

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
                {isLoading ? <div className="py-2xl text-center text-secondary">Đang tải các gói dịch vụ...</div> : detailPlans.length === 0 ? <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center text-secondary">Hiện chưa có gói {displayConfig.eyebrow} đang hoạt động.</div> : <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">{detailPlans.map(plan => { const price = plan.prices?.find(item => item.isActive !== false); const specs = getSpecifications(plan); return <article key={plan.id} className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"><p className="mb-sm font-label-caps text-label-caps uppercase tracking-wider text-primary">{plan.category?.name || displayConfig.eyebrow}</p><h3 className="mb-sm font-headline-md text-headline-md text-on-background">{plan.name}</h3><p className="mb-lg min-h-12 text-secondary">{plan.description || displayConfig.description}</p><div className="mb-xl flex-1 space-y-sm border-y border-outline-variant py-md">{specs.length > 0 ? specs.map(([key, value]) => <div key={key} className="flex justify-between gap-md text-sm"><span className="text-secondary">{key}</span><strong>{String(value)}</strong></div>) : <p className="text-sm text-secondary">Liên hệ để nhận thông tin chi tiết.</p>}</div><div className="flex items-center justify-between gap-md"><span className="font-semibold text-primary">{price ? `${price.price.toLocaleString("vi-VN")} đ/${price.billingCycle === "12" ? "năm" : "tháng"}` : "Liên hệ"}</span><Link href={`/pricing?plan=${plan.id}`} className="rounded-lg bg-primary px-md py-sm text-sm font-semibold text-on-primary hover:bg-primary/90">Đăng ký gói</Link></div></article>; })}</div>}
            </section>

            <section className="bg-primary-container px-gutter py-3xl text-center text-on-primary-container"><h2 className="mb-md font-headline-lg text-headline-lg">Cần tư vấn lựa chọn gói?</h2><p className="mx-auto mb-xl max-w-[42rem] text-body-lg opacity-80">Hãy để CloudNova đề xuất phương án phù hợp với nhu cầu và ngân sách của bạn.</p><button onClick={() => setIsContactOpen(true)} className="rounded-lg bg-surface-container-lowest px-xl py-md font-semibold text-primary shadow-sm">Nhận tư vấn miễn phí</button></section>

            <Modal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} title="Thông tin liên hệ" maxWidth="max-w-[30rem]" footer={<button onClick={() => setIsContactOpen(false)} className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-on-primary">Đóng</button>}><div className="space-y-4 py-4 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20"><span className="material-symbols-outlined text-3xl text-primary">support_agent</span></div><p className="text-body-lg text-on-surface">Vui lòng liên hệ với chúng tôi để được tư vấn chi tiết:</p><div className="rounded-xl border border-outline-variant p-4"><a href={`tel:${contactInfo.phone}`} className="mb-3 flex justify-center gap-3 font-semibold hover:text-primary"><span className="material-symbols-outlined text-primary">call</span>{contactInfo.phone}</a><a href={`mailto:${contactInfo.email}`} className="flex justify-center gap-3 text-primary hover:underline"><span className="material-symbols-outlined">mail</span>{contactInfo.email}</a></div></div></Modal>
        </main>
    );
}
