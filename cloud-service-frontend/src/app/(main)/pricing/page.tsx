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

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({ phone: '1900 xxxx', email: 'contact@cloudnova.vn' });

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

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + 'đ';
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
        <main className="flex-grow pt-16 pb-2xl">
            <section className="max-w-container-max mx-auto px-gutter pt-3xl pb-2xl text-center">
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
                            
                            const priceAmount = priceObj ? priceObj.price : 0;
                            
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
                                        <div className="flex items-baseline gap-xs">
                                            <span className={`font-display-lg ${isHighlighted ? 'text-[48px]' : 'text-[40px]'} font-bold text-on-background`}>{formatCurrency(priceAmount)}</span>
                                            <span className="font-body-sm text-body-sm text-secondary">/ {isAnnual ? 'năm' : 'tháng'}</span>
                                        </div>
                                        {isAnnual && savingsAmount > 0 && (
                                            <div className="mt-1">
                                                <span className="font-body-sm text-green-600 bg-green-50 px-2 py-1 rounded">Tiết kiệm {formatCurrency(savingsAmount)}</span>
                                            </div>
                                        )}
                                        <p className="text-secondary text-sm mt-2">{plan.description}</p>
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
                                    <Link 
                                        href={`/checkout?plan=${encodeURIComponent(plan.name)}&price=${priceAmount}&cycle=${urlCycle}&planId=${plan.id}&priceId=${priceObj?.id || ''}`} 
                                        className={`block text-center w-full font-body-md text-body-md font-medium py-sm rounded-lg transition-colors ${isHighlighted ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface text-primary border border-primary hover:bg-surface-variant'}`}
                                    >
                                        Chọn gói này
                                    </Link>
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
