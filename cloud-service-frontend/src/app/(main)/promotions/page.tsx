"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Promotion = {
    id: string;
    title: string;
    badgeText: string;
    description: string;
    category: string;
    isFeatured: boolean;
    startDate: string;
    endDate?: string;
    isActive: boolean;
};

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

export default function PromotionsPage() {
    const [activeTab, setActiveTab] = useState("Tất cả");
    const tabs = ["Tất cả", "Cloud", "Hosting", "Domain", "Email"];
    const [timeLeft, setTimeLeft] = useState("");
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [featuredPromo, setFeaturedPromo] = useState<Promotion | null>(null);

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startScrollLeft, setStartScrollLeft] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await fetch('http://localhost:5154/api/Promotions?PageNumber=1&PageSize=50&onlyActive=true');
                if (res.ok) {
                    const data = await res.json();
                    const activePromos = data.data as Promotion[];
                    setPromotions(activePromos);
                    
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
        if (!featuredPromo || !featuredPromo.endDate) {
            setTimeLeft("Không giới hạn");
            return;
        }

        const targetDate = new Date(featuredPromo.endDate);
        
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            
            if (difference <= 0) {
                setTimeLeft("Đã kết thúc");
                clearInterval(interval);
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            
            setTimeLeft(`${String(days).padStart(2, '0')} ngày ${String(hours).padStart(2, '0')} giờ ${String(minutes).padStart(2, '0')} phút ${String(seconds).padStart(2, '0')} giây`);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [featuredPromo]);

    useEffect(() => {
        let animationId: number;
        
        const scroll = () => {
            if (scrollRef.current && !isDragging && !isHovered) {
                scrollRef.current.scrollLeft += 1;
                
                const halfWidth = scrollRef.current.scrollWidth / 2;
                if (scrollRef.current.scrollLeft >= halfWidth) {
                    scrollRef.current.scrollLeft -= halfWidth;
                }
            }
            animationId = requestAnimationFrame(scroll);
        };
        
        // Stop the marquee since it can glitch when content dynamically changes, 
        // or just rely on CSS / pure scroll. For now, comment out auto-scroll to let user swipe.
        // animationId = requestAnimationFrame(scroll);
        // return () => cancelAnimationFrame(animationId);
    }, [isDragging, isHovered]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setStartScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        setIsHovered(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; 
        let newScrollLeft = startScrollLeft - walk;
        scrollRef.current.scrollLeft = newScrollLeft;
    };

    const filteredPromotions = promotions.filter(p => activeTab === 'Tất cả' || p.category === activeTab);

    const getIconByCategory = (cat: string) => {
        switch (cat) {
            case 'Cloud': return 'dns';
            case 'Hosting': return 'storage';
            case 'Domain': return 'language';
            case 'Email': return 'mail';
            default: return 'sell';
        }
    };

    const getColorsByCategory = (cat: string) => {
        switch (cat) {
            case 'Cloud': return 'bg-primary-fixed text-on-primary-fixed';
            case 'Hosting': return 'bg-tertiary-fixed text-on-tertiary-fixed';
            case 'Domain': return 'bg-secondary-fixed text-on-secondary-fixed';
            case 'Email': return 'bg-primary-fixed-dim text-on-primary-fixed-variant';
            default: return 'bg-surface-variant text-on-surface-variant';
        }
    };

    return (
        <main className="flex-grow pt-16">
            {/* Hero Section */}
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
                                    <Link href="/pricing" className="inline-block text-center w-full md:w-auto font-body-md text-body-md font-medium bg-primary text-on-primary px-xl py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 duration-150">Nhận ưu đãi ngay</Link>
                                </div>
                                <div className="hidden md:block relative h-full min-h-[300px] rounded-lg overflow-hidden border border-outline-variant/30">
                                    <div className="absolute inset-0 bg-cover bg-center w-full h-full bg-surface-variant" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpxAUBIDXID43pe1PI-UYoUZDHv_pbG8n5u11B9bH6BJRNzwZspTUbDLspZ7jx-UM9QwdKoPrqXcxOB4PTYhvT8q6fRDKpszCrjZyQ-ZrrQxykhJfNtWzODkSUZtXB3zdRn1j0lnlfx8vyeEiP-n6Je6HYcMbzEZlNDY-ty_NWK5j0PT-kBqaSmL0sPKQMoj5CDzf9A1qhWtnERcHS0CnjxQzUVyNXQoK0CUO2kNnTxr5vl27jlg')" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Promotion Filter */}
            <section className="px-gutter mb-xl border-b border-outline-variant sticky top-[64px] z-40 bg-background/90 backdrop-blur-sm pt-md">
                <div className="max-w-container-max mx-auto">
                    <div className="flex overflow-x-auto no-scrollbar gap-lg">
                        {tabs.map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`font-body-md text-body-md font-medium pb-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotion List */}
            <section className="pb-3xl w-full">
                <div 
                    ref={scrollRef}
                    className="w-full flex gap-lg px-gutter py-md overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                >
                    {filteredPromotions.length === 0 ? (
                        <div className="w-full text-center py-10 font-body-md text-on-surface-variant">Không có chương trình khuyến mãi nào.</div>
                    ) : (
                        filteredPromotions.map((promo) => (
                            <div key={promo.id} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300 animate-fade-in">
                                <div className="flex justify-between items-start mb-md">
                                    <span className={`inline-block font-label-caps text-label-caps px-2 py-1 rounded-md ${getColorsByCategory(promo.category)}`}>
                                        {promo.category.toUpperCase()}
                                    </span>
                                    <span className="material-symbols-outlined text-outline">{getIconByCategory(promo.category)}</span>
                                </div>
                                <h3 className="font-headline-md text-headline-md text-on-background mb-xs">{promo.badgeText}</h3>
                                <div className="font-body-md font-medium text-on-surface mb-2">{promo.title}</div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-grow">{promo.description}</p>
                                <div className="font-body-sm text-body-sm text-outline flex items-center gap-xs mb-lg">
                                    <span className="material-symbols-outlined text-[16px]">calendar_today</span> 
                                    HSD: {promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                                    <Link href="/pricing" className="font-body-sm text-body-sm font-medium text-primary hover:underline">Sử dụng ngay</Link>
                                    <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Terms & Conditions */}
            <section className="px-gutter pb-3xl bg-surface-container-lowest py-3xl border-t border-outline-variant/30">
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
        </main>
    );
}
