const fs = require('fs');

const pageContent = `
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

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
    const tabs = ["Tất cả", "VPS", "Hosting", "Domain", "Email"];

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
            <section className="px-gutter pb-3xl -mt-xl relative z-20">
                <div className="max-w-container-max mx-auto">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-colors duration-300">
                        <div className="grid md:grid-cols-2 gap-xl items-center">
                            <div>
                                <span className="inline-block bg-error-container text-on-error-container font-label-caps text-label-caps px-2 py-1 rounded-md mb-md">HOT DEAL</span>
                                <h2 className="font-headline-lg text-headline-lg text-on-background mb-sm">Giảm đến 30% Cloud VPS</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Ưu đãi dành cho khách hàng mới khi đăng ký các gói Cloud VPS.</p>
                                <div className="flex items-end gap-md mb-xl">
                                    <span className="font-headline-lg text-headline-lg text-primary">199.000đ</span>
                                    <span className="font-body-md text-body-md text-outline line-through mb-1">299.000đ</span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">/tháng</span>
                                </div>
                                <div className="bg-surface-container-low rounded-lg p-md mb-lg flex items-center justify-between border border-outline-variant/50">
                                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                                        <span className="material-symbols-outlined text-[18px]">timer</span> Kết thúc sau:
                                    </span>
                                    <span className="font-code-md text-code-md text-on-background font-medium">02 ngày 14 giờ 35 phút 21 giây</span>
                                </div>
                                <button className="w-full md:w-auto font-body-md text-body-md font-medium bg-primary text-on-primary px-xl py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 duration-150">Nhận ưu đãi ngay</button>
                            </div>
                            <div className="hidden md:block relative h-full min-h-[300px] rounded-lg overflow-hidden border border-outline-variant/30">
                                <div className="absolute inset-0 bg-cover bg-center w-full h-full bg-surface-variant" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBpxAUBIDXID43pe1PI-UYoUZDHv_pbG8n5u11B9bH6BJRNzwZspTUbDLspZ7jx-UM9QwdKoPrqXcxOB4PTYhvT8q6fRDKpszCrjZyQ-ZrrQxykhJfNtWzODkSUZtXB3zdRn1j0lnlfx8vyeEiP-n6Je6HYcMbzEZlNDY-ty_NWK5j0PT-kBqaSmL0sPKQMoj5CDzf9A1qhWtnERcHS0CnjxQzUVyNXQoK0CUO2kNnTxr5vl27jlg')" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promotion Filter */}
            <section className="px-gutter mb-xl border-b border-outline-variant sticky top-[64px] z-40 bg-background/90 backdrop-blur-sm pt-md">
                <div className="max-w-container-max mx-auto">
                    <div className="flex overflow-x-auto no-scrollbar gap-lg">
                        {tabs.map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={\`font-body-md text-body-md font-medium pb-sm whitespace-nowrap border-b-2 transition-colors \${activeTab === tab ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}\`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotion Grid */}
            <section className="px-gutter pb-3xl">
                <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                    {/* Card 1 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-md">
                            <span className="inline-block bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2 py-1 rounded-md">CLOUD VPS</span>
                            <span className="material-symbols-outlined text-outline">dns</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Giảm 30%</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-grow">Cho khách hàng mới đăng ký lần đầu.</p>
                        <div className="font-body-sm text-body-sm text-outline flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span> HSD: 31/12/2024
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                            <a className="font-body-sm text-body-sm font-medium text-primary hover:underline" href="#">Xem chi tiết</a>
                            <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-md">
                            <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps px-2 py-1 rounded-md">HOSTING</span>
                            <span className="material-symbols-outlined text-outline">storage</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Giảm 25%</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-grow">Áp dụng cho gói Hosting đăng ký theo năm.</p>
                        <div className="font-body-sm text-body-sm text-outline flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span> HSD: 31/12/2024
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                            <a className="font-body-sm text-body-sm font-medium text-primary hover:underline" href="#">Xem chi tiết</a>
                            <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-md">
                            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps px-2 py-1 rounded-md">DOMAIN</span>
                            <span className="material-symbols-outlined text-outline">language</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Từ 99.000đ</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-grow">Ưu đãi đăng ký mới tên miền quốc gia.</p>
                        <div className="font-body-sm text-body-sm text-outline flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span> HSD: Không giới hạn
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                            <a className="font-body-sm text-body-sm font-medium text-primary hover:underline" href="#">Xem chi tiết</a>
                            <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-md">
                            <span className="inline-block bg-primary-fixed-dim text-on-primary-fixed-variant font-label-caps text-label-caps px-2 py-1 rounded-md">BUSINESS EMAIL</span>
                            <span className="material-symbols-outlined text-outline">mail</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Giảm 20%</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-grow">Khi đăng ký từ 10 tài khoản trở lên.</p>
                        <div className="font-body-sm text-body-sm text-outline flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span> HSD: 15/11/2024
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                            <a className="font-body-sm text-body-sm font-medium text-primary hover:underline" href="#">Xem chi tiết</a>
                            <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors" href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms & Conditions */}
            <section className="px-gutter pb-3xl bg-surface-container-lowest py-3xl border-t border-outline-variant/30">
                <div className="max-w-[48rem] mx-auto">
                    <h2 className="font-headline-md text-headline-md text-on-background mb-xl text-center">Điều kiện áp dụng chung</h2>
                    <div className="border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant bg-surface">
                        <AccordionItem 
                            question="Thời gian chương trình" 
                            answer="Chương trình khuyến mãi diễn ra từ ngày 01/01/2024 đến hết ngày 31/12/2024. CloudNova có quyền điều chỉnh thời gian kết thúc sớm hơn nếu hết ngân sách khuyến mãi mà không cần báo trước." 
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
                            answer="Mã khuyến mãi phải được nhập tại bước thanh toán. Không áp dụng cộng dồn với các chương trình khuyến mãi khác. Đơn hàng phải được thanh toán thành công trong thời gian diễn ra chương trình." 
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
                    <button className="font-body-md text-body-md font-medium bg-surface-container-lowest text-primary border border-outline-variant px-xl py-3 rounded-lg hover:border-primary hover:bg-surface-bright transition-colors shadow-sm active:scale-95 duration-150">Xem tất cả dịch vụ</button>
                </div>
            </section>
        </main>
    );
}
`;

fs.mkdirSync('src/app/promotions', { recursive: true });
fs.writeFileSync('src/app/promotions/page.tsx', pageContent);
console.log('Promotions page generated');
