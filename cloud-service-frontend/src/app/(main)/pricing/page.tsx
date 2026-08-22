"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from '@/components/admin/Modal';

interface PlanPrice {
    id: string;
    billingCycle: string;
    price: number;
    setupFee: number | null;
    isActive: boolean;
}

interface ServicePlan {
    id: string;
    name: string;
    description: string;
    specifications: string;
    isActive: boolean;
    prices: PlanPrice[];
}

interface Promotion {
    id: string;
    title: string;
    badgeText: string;
    description: string;
    category: string;
    isFeatured: boolean;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    discountPercentage?: number;
    servicePlanIds?: string[];
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="accordion-item">
            <button 
                className="w-full flex justify-between items-center p-md bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-body-lg text-body-lg font-medium text-on-background">{question}</span>
                <span className="material-symbols-outlined text-outline transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
            </button>
            {isOpen && (
                <div className="p-md bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant/30">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: '1900 xxxx', email: 'contact@cloudnova.vn' });

    const [timeLeft, setTimeLeft] = useState('');
    const [featuredPromo, setFeaturedPromo] = useState<Promotion | null>(null);
    const [isPromoActive, setIsPromoActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5154/api/SiteSettings/public')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const phoneSetting = data.find(s => s.key === 'PhoneNumber');
                    const emailSetting = data.find(s => s.key === 'ContactEmail');
                    
                    setContactInfo({
                        phone: phoneSetting ? phoneSetting.value : '1900 xxxx',
                        email: emailSetting ? emailSetting.value : 'contact@cloudnova.vn'
                    });
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('http://localhost:5154/api/ServicePlans?PageNumber=1&PageSize=50');
                const result = await res.json();
                if (result && result.data) {
                    setPlans(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await fetch('http://localhost:5154/api/Promotions?PageNumber=1&PageSize=50&onlyActive=true');
                if (res.ok) {
                    const data = await res.json();
                    const activePromos = data.data as Promotion[];
                    
                    const featured = activePromos.find(p => p.isFeatured);
                    if (featured) {
                        setFeaturedPromo(featured);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch promotions:', error);
            }
        };
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (!featuredPromo) {
            setIsPromoActive(false);
            return;
        }

        if (!featuredPromo.endDate) {
            setTimeLeft("Không giới hạn");
            setIsPromoActive(true);
            return;
        }

        const targetDate = new Date(featuredPromo.endDate);
        
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference <= 0) {
                setTimeLeft("Hết thời gian giảm giá");
                setIsPromoActive(false);
                clearInterval(interval);
                return;
            }
            
            setIsPromoActive(true);
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            
            setTimeLeft(`${String(days).padStart(2, '0')} ngày ${String(hours).padStart(2, '0')} giờ ${String(minutes).padStart(2, '0')} phút ${String(seconds).padStart(2, '0')} giây`);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [featuredPromo]);

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    const handleAddToCart = (plan: any, priceAmount: number, urlCycle: string, priceObj: any) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const newItem = {
            planId: plan.id,
            planName: plan.name,
            priceId: priceObj?.id || '',
            price: priceAmount,
            cycle: urlCycle,
            qty: 1
        };
        cart.push(newItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        setToastMessage(`Đã thêm ${plan.name} vào giỏ hàng!`);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Helper to parse specs safely
    const parseSpecs = (specsStr: string) => {
        try {
            return JSON.parse(specsStr);
        } catch {
            return {};
        }
    };

    return (
        <main className="flex-grow pt-16 pb-2xl relative">
            {toastMessage && (
                <div className="fixed top-24 right-4 z-50 bg-primary text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        {toastMessage}
                    </div>
                </div>
            )}
            
            {/* Promo Hero Section */}
            <section className="hero-pattern relative overflow-hidden py-3xl px-gutter">
                <div className="max-w-container-max mx-auto text-center relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-sm bg-primary-fixed/50 text-primary-fixed-dim px-md py-sm rounded-full mb-lg border border-primary/10">
                        <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                        <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Tháng Khuyến Mãi</span>
                    </div>
                    <h1 className="font-display-lg text-display-lg text-on-background max-w-[56rem] mx-auto mb-md leading-tight">
                        Ưu đãi Cloud dành cho bạn
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem] mx-auto mb-xl">
                        Khám phá những chương trình khuyến mãi mới nhất từ CloudNova và tiết kiệm chi phí hạ tầng. Tối ưu hóa hiệu suất với chi phí thấp nhất.
                    </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl -z-0"></div>
            </section>

            {/* Featured Promotion */}
            {featuredPromo && (
                <section className="px-gutter pb-3xl -mt-xl relative z-20">
                    <div className="max-w-container-max mx-auto">
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-colors duration-300">
                            <div className="grid md:grid-cols-2 gap-xl items-center">
                                <div>
                                    <span className="inline-block bg-error-container text-on-error-container font-label-caps text-label-caps px-2 py-1 rounded-md mb-md">HOT DEAL</span>
                                    <h2 className="font-headline-lg text-headline-lg text-on-background mb-sm">{featuredPromo.title}</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant mb-lg">{featuredPromo.description}</p>
                                    <div className="flex items-end gap-md mb-xl">
                                        <span className="font-headline-lg text-headline-lg text-primary">{featuredPromo.badgeText}</span>
                                    </div>
                                    <div className="bg-surface-container-low rounded-lg p-md mb-lg flex items-center justify-between border border-outline-variant/50">
                                        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                                            <span className="material-symbols-outlined text-[18px]">timer</span> {featuredPromo.endDate ? 'Kết thúc sau:' : 'Khuyến mãi:'}
                                        </span>
                                        <span className="font-code-md text-code-md text-on-background font-medium" suppressHydrationWarning>{timeLeft}</span>
                                    </div>
                                    <button onClick={() => {
                                        document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
                                    }} className="inline-block text-center w-full md:w-auto font-body-md text-body-md font-medium bg-primary text-on-primary px-xl py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 duration-150">Nhận ưu đãi ngay</button>
                                </div>
                                <div className="hidden md:block relative h-full min-h-[300px] rounded-lg overflow-hidden border border-outline-variant/30">
                                    <div className="absolute inset-0 bg-cover bg-center w-full h-full bg-surface-variant" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpxAUBIDXID43pe1PI-UYoUZDHv_pbG8n5u11B9bH6BJRNzwZspTUbDLspZ7jx-UM9QwdKoPrqXcxOB4PTYhvT8q6fRDKpszCrjZyQ-ZrrQxykhJfNtWzODkSUZtXB3zdRn1j0lnlfx8vyeEiP-n6Je6HYcMbzEZlNDY-ty_NWK5j0PT-kBqaSmL0sPKQMoj5CDzf9A1qhWtnERcHS0CnjxQzUVyNXQoK0CUO2kNnTxr5vl27jlg')" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section id="pricing-plans" className="max-w-container-max mx-auto px-gutter pt-xl pb-2xl text-center">
                <h1 className="font-display-lg text-display-lg text-on-background mb-md">Bảng giá minh bạch. Không chi phí ẩn.</h1>
                <p className="font-body-lg text-body-lg text-secondary max-w-[42rem] mx-auto mb-2xl">
                    Chọn cấu hình phù hợp với nhu cầu của bạn và dễ dàng nâng cấp khi doanh nghiệp phát triển.
                </p>

                <div className="flex items-center justify-center gap-md mb-2xl">
                    <span className="font-body-md text-body-md font-medium text-secondary">Thanh toán theo tháng</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isAnnual ? 'bg-primary' : 'bg-outline-variant'}`} 
                        id="billing-toggle">
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </button>
                    <div className="flex items-center gap-sm">
                        <span className="font-body-md text-body-md font-medium text-on-background">Thanh toán theo năm</span>
                        <span className="bg-surface-container text-primary font-label-caps text-label-caps px-sm py-xs rounded-DEFAULT">GIẢM 20%</span>
                    </div>
                </div>
            </section>

            <section className="max-w-container-max mx-auto px-gutter mb-3xl">
                {loading ? (
                    <div className="text-center text-secondary py-xl">Đang tải bảng giá...</div>
                ) : (
                    <div className="bento-grid">
                        {plans.map((plan, index) => {
                            const dbCycle = isAnnual ? '12' : '1';
                            const urlCycle = isAnnual ? 'yearly' : 'monthly';
                            const priceObj = plan.prices?.find(p => p.billingCycle === dbCycle) 
                                             || plan.prices?.[0]; // Fallback to first price if missing
                            
                            let priceAmount = priceObj ? priceObj.price : 0;
                            const originalPrice = priceAmount;

                            // Apply promotion discount
                            let discountPercent = 0;
                            if (isPromoActive && featuredPromo && featuredPromo.discountPercentage) {
                                // Apply if no specific plan is set, OR if the specific plan matches the current plan
                                if (!featuredPromo.servicePlanIds || featuredPromo.servicePlanIds.length === 0 || featuredPromo.servicePlanIds.includes(plan.id)) {
                                    discountPercent = featuredPromo.discountPercentage;
                                }
                            }
                            
                            // Apply annual discount if applicable (on top of promotion or instead of it, let's say they stack)
                            if (isAnnual) {
                                // Based on UI: "GIẢM 20%" for annual
                                discountPercent += 20;
                            }

                            if (discountPercent > 0) {
                                priceAmount = priceAmount * (1 - discountPercent / 100);
                            }
                            
                            // Calculate savings
                            let savingsAmount = 0;
                            if (isAnnual) {
                                const monthlyPriceObj = plan.prices?.find(p => p.billingCycle === '1');
                                if (monthlyPriceObj && priceObj) {
                                    savingsAmount = (monthlyPriceObj.price * 12) - priceObj.price;
                                }
                            }

                            const specs = parseSpecs(plan.specifications);
                            
                            // Highlight the 2nd card (BUSINESS) for UI flair, or simply use logic if name contains "Business"
                            const isHighlighted = plan.name.toLowerCase().includes("business");
                            const isEnterprise = plan.name.toLowerCase().includes("enterprise");

                            if (isEnterprise) {
                                return (
                                    <div key={plan.id} className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col bg-inverse-surface rounded-xl border border-inverse-surface p-lg">
                                        <div className="mb-lg">
                                            <h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-sm">{plan.name}</h3>
                                            <div className="flex items-baseline gap-xs mt-md">
                                                <span className="font-headline-lg text-surface-container-lowest">Liên hệ</span>
                                            </div>
                                            <p className="font-body-sm text-body-sm text-secondary-fixed-dim mt-sm">{plan.description || 'Giải pháp tùy chỉnh.'}</p>
                                        </div>
                                        <ul className="flex-grow space-y-md mb-lg">
                                            {Object.entries(specs).map(([key, val]) => (
                                                <li key={key} className="flex items-center gap-sm">
                                                    <span className="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
                                                    <span className="font-body-sm text-body-sm text-surface-variant">{key}: {String(val)}</span>
                                                </li>
                                            ))}
                                            <li className="flex items-center gap-sm">
                                                <span className="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
                                                <span className="font-body-sm text-body-sm text-surface-variant">Priority support</span>
                                            </li>
                                        </ul>
                                        <button onClick={() => setIsContactModalOpen(true)} className="w-full bg-transparent text-inverse-primary border border-inverse-primary font-body-md text-body-md font-medium py-sm rounded-lg hover:bg-inverse-primary hover:text-inverse-surface transition-colors">Nhận báo giá</button>
                                    </div>
                                );
                            }

                            return (
                                <div key={plan.id} className={`col-span-12 md:col-span-6 lg:col-span-3 flex flex-col ${isHighlighted ? 'bg-surface-container-lowest rounded-xl border-2 border-primary p-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative transform md:-translate-y-4' : 'bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:border-primary transition-colors hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]'}`}>
                                    {isHighlighted && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-caps text-label-caps px-md py-xs rounded-full">
                                            PHỔ BIẾN NHẤT
                                        </div>
                                    )}
                                    <div className={`mb-lg ${isHighlighted ? 'pt-sm' : ''}`}>
                                        <h3 className={`font-headline-md text-headline-md ${isHighlighted ? 'text-primary' : 'text-on-background'} mb-sm`}>{plan.name}</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">{plan.description}</p>
                                        <div className="mb-xl h-[80px]">
                                            {discountPercent > 0 && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-on-surface-variant line-through text-sm font-medium">{formatCurrency(originalPrice)}/{urlCycle === 'monthly' ? 'th' : 'năm'}</span>
                                                    <span className="bg-error-container text-error font-label-caps text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">-{discountPercent}%</span>
                                                </div>
                                            )}
                                            <div className="flex items-end gap-xs">
                                                <span className={`font-display-lg ${isHighlighted ? 'text-[48px]' : 'text-[40px]'} font-bold text-on-background leading-none`}>{formatCurrency(priceAmount)}</span>
                                                <span className="font-body-sm text-body-sm text-secondary mb-1">/{urlCycle === 'monthly' ? 'th' : 'năm'}</span>
                                            </div>
                                        </div>
                                        {isAnnual && savingsAmount > 0 && (
                                            <div className="mt-1">
                                                <span className="font-body-sm text-green-600 bg-green-50 px-2 py-1 rounded">Tiết kiệm {formatCurrency(savingsAmount)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <ul className="flex-grow space-y-md mb-lg">
                                        {Object.entries(specs).map(([key, val]) => {
                                            // Map icon based on key
                                            let icon = "memory";
                                            const lowerKey = key.toLowerCase();
                                            if (lowerKey.includes("ram")) icon = "memory_alt";
                                            if (lowerKey.includes("ssd") || lowerKey.includes("disk")) icon = "hard_drive";
                                            if (lowerKey.includes("bandwidth") || lowerKey.includes("network")) icon = "speed";
                                            
                                            return (
                                                <li key={key} className="flex items-center gap-sm">
                                                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                                                    <span className={`font-body-md text-body-md text-on-background ${isHighlighted ? 'font-medium' : ''}`}>
                                                        {key === "CPU" ? `${val} vCPU` : String(val)} {key !== "CPU" ? key : ""}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <button 
                                        onClick={() => handleAddToCart(plan, priceAmount, urlCycle, priceObj)}
                                        className={`block text-center w-full font-body-md text-body-md font-medium py-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${isHighlighted ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface text-primary border border-primary hover:bg-surface-variant'}`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="max-w-[56rem] mx-auto px-gutter mb-3xl text-center bg-surface-container rounded-xl p-2xl border border-outline-variant/50">
                <h2 className="font-headline-lg text-headline-lg text-on-background mb-md">Bạn chưa biết nên chọn gói nào?</h2>
                <p className="font-body-md text-body-md text-secondary mb-xl">Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ bạn phân tích nhu cầu và lựa chọn giải pháp tối ưu nhất.</p>
                <button onClick={() => setIsContactModalOpen(true)} className="bg-primary text-on-primary font-body-md text-body-md font-medium px-xl py-md rounded-lg hover:bg-primary-container transition-colors inline-flex items-center gap-sm">
                    <span className="material-symbols-outlined">support_agent</span>
                    Nhận tư vấn miễn phí
                </button>
            </section>

            {/* Terms & Conditions */}
            <section className="px-gutter pb-3xl bg-surface-container-lowest py-3xl border-t border-outline-variant/30 mt-3xl">
                <div className="max-w-[48rem] mx-auto">
                    <h2 className="font-headline-md text-headline-md text-on-background mb-xl text-center">Điều kiện áp dụng chung</h2>
                    <div className="border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant bg-surface">
                        <AccordionItem 
                            question="Thời gian chương trình" 
                            answer="Các chương trình khuyến mãi diễn ra theo thời gian được chỉ định. CloudNova có quyền điều chỉnh thời gian kết thúc sớm hơn nếu hết ngân sách khuyến mãi mà không cần báo trước." 
                        />
                        <AccordionItem 
                            question="Đối tượng áp dụng" 
                            answer="Áp dụng cho tất cả khách hàng cá nhân và doanh nghiệp đăng ký tài khoản mới trên hệ thống CloudNova. Một số ưu đãi đặc biệt có thể yêu cầu xác minh danh tính." 
                        />
                        <AccordionItem 
                            question="Dịch vụ áp dụng" 
                            answer="Khuyến mãi chỉ áp dụng cho các gói dịch vụ được liệt kê rõ trong từng thẻ khuyến mãi. Không áp dụng cho dịch vụ gia hạn, nâng cấp hoặc các dịch vụ addons mua kèm (trừ khi có quy định khác)." 
                        />
                        <AccordionItem 
                            question="Điều kiện thanh toán" 
                            answer="Mã khuyến mãi (nếu có) phải được nhập tại bước thanh toán. Không áp dụng cộng dồn với các chương trình khuyến mãi khác. Đơn hàng phải được thanh toán thành công trong thời gian diễn ra chương trình." 
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-3xl px-gutter bg-surface-container">
                <div className="max-w-container-max mx-auto text-center flex flex-col items-center">
                    <h2 className="font-headline-lg text-headline-lg text-on-background mb-md">Đừng bỏ lỡ ưu đãi tiếp theo</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[42rem]">
                        Đăng ký nhận thông báo để luôn cập nhật những chương trình khuyến mãi mới nhất và các bản cập nhật tính năng từ CloudNova.
                    </p>
                    <Link href="/services" className="inline-block font-body-md text-body-md font-medium bg-surface-container-lowest text-primary border border-outline-variant px-xl py-3 rounded-lg hover:border-primary hover:bg-surface-bright transition-colors shadow-sm active:scale-95 duration-150">Xem tất cả dịch vụ</Link>
                </div>
            </section>

            {/* Contact Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Thông tin liên hệ"
                maxWidth="max-w-[30rem]"
                footer={
                    <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm w-full">
                        Đóng
                    </button>
                }
            >
                <div className="space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                    </div>
                    <p className="font-body-lg text-on-surface">Vui lòng liên hệ với chúng tôi qua các kênh sau để được tư vấn chi tiết:</p>
                    
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant inline-block w-full mt-4">
                        <div className="flex items-center gap-3 justify-center mb-3">
                            <span className="material-symbols-outlined text-primary">call</span>
                            <span className="font-headline-md text-on-surface font-semibold">{contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            <a href={`mailto:${contactInfo.email}`} className="font-body-md text-primary hover:underline">{contactInfo.email}</a>
                        </div>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
