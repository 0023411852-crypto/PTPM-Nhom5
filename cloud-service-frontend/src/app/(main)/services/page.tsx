"use client";

import Link from "next/link";
import React, { useState } from 'react';

export default function ServicesPage() {
    const [filter, setFilter] = useState('Tất cả');
    
    const categories = ['Tất cả', 'Cloud', 'Hosting', 'Domain', 'Email', 'Security'];

    return (
        <>
            
<main className="flex-grow pt-16">

<section className="py-3xl px-gutter max-w-container-max mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-2xl items-center">
<div>
<h1 className="font-display-lg text-display-lg text-on-background mb-md">Dịch vụ Cloud cho mọi nhu cầu</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[42rem]">Từ website cá nhân đến hệ thống doanh nghiệp, CloudNova cung cấp hạ tầng Cloud mạnh mẽ, ổn định và dễ mở rộng.</p>
<div className="flex flex-col sm:flex-row gap-md justify-center md:justify-start">
<Link href="/pricing" className="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold hover:bg-primary-container transition-colors inline-flex items-center justify-center">Xem bảng giá</Link>
<button onClick={() => alert('Vui lòng gọi hotline: 1900 xxxx hoặc gửi email đến contact@cloudnova.vn')} className="border border-primary text-primary px-lg py-md rounded-lg font-semibold hover:bg-surface-container transition-colors">Tư vấn miễn phí</button>
</div>
</div>
<div className="hidden md:flex justify-center items-center">
<div className="relative w-full max-w-[28rem] aspect-square bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center p-xl overflow-hidden shadow-inner">
    {/* Inner Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

    {/* Orbit 3 (Outer) */}
    <div className="absolute w-[360px] h-[360px] rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '35s', animationTimingFunction: 'linear' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-surface rounded-xl shadow-md p-2 border border-outline-variant flex items-center justify-center animate-spin" style={{ animationDuration: '35s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                <span className="material-symbols-outlined text-primary text-[20px]">public</span>
            </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="bg-surface rounded-xl shadow-md p-2 border border-outline-variant flex items-center justify-center animate-spin" style={{ animationDuration: '35s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                <span className="material-symbols-outlined text-tertiary text-[20px]">api</span>
            </div>
        </div>
    </div>

    {/* Orbit 2 (Middle) */}
    <div className="absolute w-[260px] h-[260px] rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '25s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-surface rounded-xl shadow-md p-2 border border-outline-variant flex items-center justify-center animate-spin" style={{ animationDuration: '25s', animationTimingFunction: 'linear' }}>
                <span className="material-symbols-outlined text-secondary text-[20px]">dns</span>
            </div>
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
            <div className="bg-surface rounded-xl shadow-md p-2 border border-outline-variant flex items-center justify-center animate-spin" style={{ animationDuration: '25s', animationTimingFunction: 'linear' }}>
                <span className="material-symbols-outlined text-error text-[20px]">security</span>
            </div>
        </div>
    </div>

    {/* Orbit 1 (Inner) */}
    <div className="absolute w-[160px] h-[160px] rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '15s', animationTimingFunction: 'linear' }}>
        <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2">
            <div className="bg-surface rounded-xl shadow-md p-2 border border-outline-variant flex items-center justify-center animate-spin" style={{ animationDuration: '15s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                <span className="material-symbols-outlined text-primary text-[20px]">code</span>
            </div>
        </div>
    </div>

    {/* Central Cloud */}
    <div className="absolute z-10 bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center animate-pulse" style={{ animationDuration: '3s' }}>
        <div className="bg-primary shadow-[0_0_30px_rgba(0,97,255,0.4)] w-16 h-16 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
        </div>
    </div>
</div>
</div>
</section>

<section className="py-lg px-gutter max-w-container-max mx-auto flex justify-center overflow-x-auto no-scrollbar">
<div className="flex space-x-sm bg-surface-container-low p-xs rounded-full border border-outline-variant">
    {categories.map(cat => (
        <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-lg py-sm rounded-full font-body-sm font-medium transition-colors ${
                filter === cat 
                    ? 'bg-primary text-on-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container'
            }`}
        >
            {cat}
        </button>
    ))}
</div>
</section>

<section className="py-2xl px-gutter max-w-container-max mx-auto">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">

{(filter === 'Tất cả' || filter === 'Cloud') && (
<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">dns</span>
</div>
<h3 className="font-headline-md text-headline-md">Cloud VPS</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Hiệu năng cao với ổ cứng NVMe và khả năng mở rộng linh hoạt. Lựa chọn hoàn hảo cho dự án lớn.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> vCPU &amp; RAM linh hoạt</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> NVMe siêu tốc</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Root Access toàn quyền</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> 99.9% Uptime Guarantee</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="/pricing">Khám phá VPS <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>
)}

{(filter === 'Tất cả' || filter === 'Hosting') && (
<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">web</span>
</div>
<h3 className="font-headline-md text-headline-md">Web Hosting</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Giải pháp lưu trữ website ổn định, dễ dàng quản lý với cPanel/DirectAdmin.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> SSD/NVMe Storage</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Free SSL Certificate</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Auto Backup daily</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Integrated Email</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="/pricing">Khám phá Hosting <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>
)}

{(filter === 'Tất cả' || filter === 'Domain') && (
<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">public</span>
</div>
<h3 className="font-headline-md text-headline-md">Domain</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Đăng ký tên miền quốc tế và Việt Nam với công cụ quản lý DNS mạnh mẽ.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> International domains</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Advanced DNS Management</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Free WHOIS Protection</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Auto Renewal options</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Đăng ký Domain <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>
)}

{(filter === 'Tất cả' || filter === 'Email') && (
<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">mail</span>
</div>
<h3 className="font-headline-md text-headline-md">Business Email</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Email doanh nghiệp theo tên miền riêng, chuyên nghiệp và bảo mật cao.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Custom domains</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Advanced Spam Protection</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Large storage quotas</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Modern Webmail UI</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá Email <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>
)}

{(filter === 'Tất cả' || filter === 'Security') && (
<>
<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">lock</span>
</div>
<h3 className="font-headline-md text-headline-md">SSL Certificate</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Bảo vệ dữ liệu truyền tải và tăng độ tin cậy cho website của bạn với HTTPS.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Secure HTTPS</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> 256-bit Encryption</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Domain Validation (DV)</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> High Browser Trust</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Xem SSL <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>

<div className="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group animate-fade-in">
<div className="flex items-center gap-sm mb-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span className="material-symbols-outlined">shield</span>
</div>
<h3 className="font-headline-md text-headline-md">DDoS Firewall</h3>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Hệ thống tường lửa bảo vệ ứng dụng khỏi các cuộc tấn công mạng quy mô lớn.</p>
<ul className="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Intelligent Traffic Filtering</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> L3/4/7 Protection</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Real-time Monitoring</li>
<li className="flex items-center gap-xs"><span className="material-symbols-outlined text-[16px] text-primary">check</span> Custom Rulesets</li>
</ul>
<Link className="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá Security <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link>
</div>
</>
)}
</div>
</section>

<section className="py-2xl bg-surface-container-lowest px-gutter">
<div className="max-w-container-max mx-auto">
<h2 className="font-headline-lg text-headline-lg text-center mb-xl">Không chỉ là Cloud. Đó là nền tảng để phát triển.</h2>
<div className="overflow-x-auto rounded-xl border border-outline-variant">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-bright font-label-caps text-label-caps text-on-surface-variant">
<th className="p-md font-semibold border-b border-outline-variant">Tính năng</th>
<th className="p-md font-semibold border-b border-outline-variant">Cloud VPS</th>
<th className="p-md font-semibold border-b border-outline-variant">Web Hosting</th>
<th className="p-md font-semibold border-b border-outline-variant">Business Email</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm text-on-surface">
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="p-md font-medium">Performance</td>
<td className="p-md">Dedicated Resources</td>
<td className="p-md">Shared, Optimized</td>
<td className="p-md">High Deliverability</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="p-md font-medium">Security</td>
<td className="p-md">Custom Firewall, DDoS App</td>
<td className="p-md">WAF, Imunify360</td>
<td className="p-md">SpamAssassin, DKIM/SPF</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="p-md font-medium">Scalability</td>
<td className="p-md">Instant upgrade</td>
<td className="p-md">Tiered plans</td>
<td className="p-md">Storage add-ons</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="p-md font-medium">Backup</td>
<td className="p-md">Snapshots available</td>
<td className="p-md">Daily automated</td>
<td className="p-md">Daily automated</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-md font-medium">Support</td>
<td className="p-md">24/7 Technical</td>
<td className="p-md">24/7 Technical</td>
<td className="p-md">24/7 Technical</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>

<section className="py-3xl px-gutter bg-surface-container text-center">
<div className="max-w-[42rem] mx-auto">
<h2 className="font-headline-lg text-headline-lg mb-sm text-on-background">Chưa biết nên chọn dịch vụ nào?</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl">Đội ngũ CloudNova sẵn sàng tư vấn giải pháp phù hợp với nhu cầu và ngân sách của bạn.</p>
<div className="flex flex-col sm:flex-row gap-md justify-center">
<button onClick={() => alert('Vui lòng gọi hotline: 1900 xxxx hoặc gửi email đến contact@cloudnova.vn')} className="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold hover:bg-primary-container transition-colors shadow-sm">Nhận tư vấn</button>
<Link href="/pricing" className="bg-surface-container-lowest border border-outline-variant text-on-surface px-lg py-md rounded-lg font-semibold hover:bg-surface-container-high transition-colors shadow-sm inline-flex items-center justify-center">Xem bảng giá</Link>
</div>
</div>
</section>
</main>

</>
    );
}
