const fs = require('fs');

const rawHtml = `
<main class="flex-grow pt-16 pb-2xl">
<!-- Hero Section -->
<section class="max-w-container-max mx-auto px-gutter pt-3xl pb-2xl text-center">
<h1 class="font-display-lg text-display-lg text-on-background mb-md">Bảng giá minh bạch. Không chi phí ẩn.</h1>
<p class="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto mb-2xl">Chọn cấu hình phù hợp với nhu cầu của bạn và dễ dàng nâng cấp khi doanh nghiệp phát triển.</p>
<!-- Billing Toggle -->
<div class="flex items-center justify-center gap-md mb-2xl">
<span class="font-body-md text-body-md font-medium text-secondary">Thanh toán theo tháng</span>
<button 
    onClick={() => setIsAnnual(!isAnnual)}
    className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 \${isAnnual ? 'bg-primary' : 'bg-outline-variant'}\`} 
    id="billing-toggle">
<span class={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${isAnnual ? 'translate-x-6' : 'translate-x-1'}\`}></span>
</button>
<div class="flex items-center gap-sm">
<span class="font-body-md text-body-md font-medium text-on-background">Thanh toán theo năm</span>
<span class="bg-surface-container text-primary font-label-caps text-label-caps px-sm py-xs rounded-DEFAULT">GIẢM 20%</span>
</div>
</div>
</section>
<!-- Pricing Cards (Bento-inspired asymmetric layout) -->
<section class="max-w-container-max mx-auto px-gutter mb-3xl">
<div class="bento-grid">
<!-- Starter -->
<div class="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:border-primary transition-colors hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
<div class="mb-lg">
<h3 class="font-headline-md text-headline-md text-on-background mb-sm">VPS STARTER</h3>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-[40px] font-bold text-on-background">{isAnnual ? '79.000đ' : '99.000đ'}</span>
<span class="font-body-sm text-body-sm text-secondary">/ tháng</span>
</div>
</div>
<ul class="flex-grow space-y-md mb-lg">
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">memory</span>
<span class="font-body-md text-body-md text-on-background">2 vCPU</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">memory_alt</span>
<span class="font-body-md text-body-md text-on-background">2 GB RAM</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">hard_drive</span>
<span class="font-body-md text-body-md text-on-background">40 GB NVMe</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">speed</span>
<span class="font-body-md text-body-md text-on-background">1 TB Bandwidth</span>
</li>
</ul>
<button class="w-full bg-surface text-primary border border-primary font-body-md text-body-md font-medium py-sm rounded-lg hover:bg-surface-variant transition-colors">Chọn gói này</button>
</div>
<!-- Business (Featured) -->
<div class="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col bg-surface-container-lowest rounded-xl border-2 border-primary p-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative transform md:-translate-y-4">
<div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-caps text-label-caps px-md py-xs rounded-full">
                        PHỔ BIẾN NHẤT
                    </div>
<div class="mb-lg pt-sm">
<h3 class="font-headline-md text-headline-md text-primary mb-sm">VPS BUSINESS</h3>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-[48px] font-bold text-on-background">{isAnnual ? '159.000đ' : '199.000đ'}</span>
<span class="font-body-sm text-body-sm text-secondary">/ tháng</span>
</div>
</div>
<ul class="flex-grow space-y-md mb-lg">
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
<span class="font-body-md text-body-md font-medium text-on-background">4 vCPU</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory_alt</span>
<span class="font-body-md text-body-md font-medium text-on-background">8 GB RAM</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hard_drive</span>
<span class="font-body-md text-body-md font-medium text-on-background">100 GB NVMe</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
<span class="font-body-md text-body-md font-medium text-on-background">3 TB Bandwidth</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
<span class="font-body-md text-body-md font-medium text-on-background">Advanced DDoS Protection</span>
</li>
</ul>
<button class="w-full bg-primary text-on-primary font-body-md text-body-md font-medium py-md rounded-lg hover:bg-primary-container transition-colors">Chọn gói này</button>
</div>
<!-- Pro -->
<div class="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:border-primary transition-colors hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
<div class="mb-lg">
<h3 class="font-headline-md text-headline-md text-on-background mb-sm">VPS PRO</h3>
<div class="flex items-baseline gap-xs">
<span class="font-display-lg text-[40px] font-bold text-on-background">{isAnnual ? '319.000đ' : '399.000đ'}</span>
<span class="font-body-sm text-body-sm text-secondary">/ tháng</span>
</div>
</div>
<ul class="flex-grow space-y-md mb-lg">
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">memory</span>
<span class="font-body-md text-body-md text-on-background">8 vCPU</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">memory_alt</span>
<span class="font-body-md text-body-md text-on-background">16 GB RAM</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">hard_drive</span>
<span class="font-body-md text-body-md text-on-background">200 GB NVMe</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-primary text-[20px]">speed</span>
<span class="font-body-md text-body-md text-on-background">5 TB Bandwidth</span>
</li>
</ul>
<button class="w-full bg-surface text-primary border border-primary font-body-md text-body-md font-medium py-sm rounded-lg hover:bg-surface-variant transition-colors">Chọn gói này</button>
</div>
<!-- Enterprise -->
<div class="col-span-12 md:col-span-6 lg:col-span-2 flex flex-col bg-inverse-surface rounded-xl border border-inverse-surface p-lg">
<div class="mb-lg">
<h3 class="font-headline-md text-headline-md text-surface-container-lowest mb-sm">ENTERPRISE</h3>
<div class="flex items-baseline gap-xs mt-md">
<span class="font-headline-lg text-surface-container-lowest">Liên hệ</span>
</div>
<p class="font-body-sm text-body-sm text-secondary-fixed-dim mt-sm">Giải pháp tùy chỉnh cho doanh nghiệp lớn.</p>
</div>
<ul class="flex-grow space-y-md mb-lg">
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
<span class="font-body-sm text-body-sm text-surface-variant">Dedicated resources</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
<span class="font-body-sm text-body-sm text-surface-variant">Custom config</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
<span class="font-body-sm text-body-sm text-surface-variant">Priority support</span>
</li>
<li class="flex items-center gap-sm">
<span class="material-symbols-outlined text-inverse-primary text-[16px]">check_circle</span>
<span class="font-body-sm text-body-sm text-surface-variant">Enterprise security</span>
</li>
</ul>
<button class="w-full bg-transparent text-inverse-primary border border-inverse-primary font-body-md text-body-md font-medium py-sm rounded-lg hover:bg-inverse-primary hover:text-inverse-surface transition-colors">Nhận báo giá</button>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="max-w-4xl mx-auto px-gutter mb-3xl text-center bg-surface-container rounded-xl p-2xl border border-outline-variant/50">
<h2 class="font-headline-lg text-headline-lg text-on-background mb-md">Bạn chưa biết nên chọn gói nào?</h2>
<p class="font-body-md text-body-md text-secondary mb-xl">Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ bạn phân tích nhu cầu và lựa chọn giải pháp tối ưu nhất.</p>
<button class="bg-primary text-on-primary font-body-md text-body-md font-medium px-xl py-md rounded-lg hover:bg-primary-container transition-colors inline-flex items-center gap-sm">
<span class="material-symbols-outlined">support_agent</span>
                Nhận tư vấn miễn phí
            </button>
</section>
</main>
`;

let reactCode = rawHtml.replace(/class=/g, 'className=');
reactCode = reactCode.replace(/<!--(.*?)-->/g, ''); // remove comments

// Run the fix logic (like we did for services)
reactCode = reactCode.replace(/\bmax-w-md\b/g, 'max-w-[28rem]');
reactCode = reactCode.replace(/\bmax-w-lg\b/g, 'max-w-[32rem]');
reactCode = reactCode.replace(/\bmax-w-xl\b/g, 'max-w-[36rem]');
reactCode = reactCode.replace(/\bmax-w-2xl\b/g, 'max-w-[42rem]');
reactCode = reactCode.replace(/\bmax-w-3xl\b/g, 'max-w-[48rem]');
reactCode = reactCode.replace(/\bmax-w-4xl\b/g, 'max-w-[56rem]');

const pageContent = `
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function VPSPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <>
            ${reactCode}
        </>
    );
}
`;

fs.mkdirSync('src/app/vps', { recursive: true });
fs.writeFileSync('src/app/vps/page.tsx', pageContent);
console.log('VPS page generated');
