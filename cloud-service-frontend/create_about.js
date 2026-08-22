const fs = require('fs');

const rawHtml = `
<main class="pt-16 pb-3xl flex-grow">
<!-- Hero Section -->
<section class="px-gutter max-w-container-max mx-auto pt-xl pb-3xl">
<div class="flex flex-col md:flex-row items-center gap-2xl">
<div class="w-full md:w-1/2 space-y-lg">
<h1 class="font-display-lg text-display-lg text-on-surface md:pr-xl">Chúng tôi xây dựng hạ tầng cho những ý tưởng lớn.</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem]">CloudNova cung cấp nền tảng Cloud giúp cá nhân, startup và doanh nghiệp triển khai sản phẩm nhanh hơn, an toàn hơn và dễ dàng mở rộng hơn.</p>
<div class="pt-sm flex gap-md">
<button class="bg-primary text-on-primary px-lg py-md rounded-lg font-body-md text-body-md hover:opacity-90 transition-opacity">Khám phá dịch vụ</button>
</div>
</div>
<div class="w-full md:w-1/2 rounded-2xl overflow-hidden border border-outline-variant relative h-[400px]">
<img class="w-full h-full object-cover" data-alt="A clean, modern 3d illustration of cloud infrastructure servers and floating data nodes, rendered in bright corporate light mode with primary blue and white accents, evoking a sense of speed, scale, and high-tech developer environments." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiixOfW_BKeUSHQNlJGzk0jmXT_NhtNkeybOiq3ttiC_Upmu8P4viKwRkx4fNxke3LllWRWkWiRt798bh7B5ptkq9qfjOrAdVxawzxMJDmuUZe1jIt5U7XiEoHRfvTZPcLZ-3LJzy8PKS-54Y_dk1yPEDIX1It3lJpyZ5eQgcgUjRMVUa-V5kj1iAbwIyP-eMn8KjfwwUxC1XVbc7nuo0FdyJ986KISRfutukg-5zloepANdaVdg"/>
</div>
</div>
</section>
<!-- Company Story Section -->
<section class="bg-surface-container-low py-3xl px-gutter">
<div class="max-w-container-max mx-auto">
<h2 class="font-headline-lg text-headline-lg text-center mb-2xl">Câu chuyện CloudNova</h2>
<div class="relative mt-2xl">
<div class="absolute top-1/2 left-0 w-full h-px bg-outline-variant -translate-y-1/2 hidden md:block"></div>
<div class="grid grid-cols-1 md:grid-cols-5 gap-lg relative z-10">
<div class="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center">
<span class="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2022</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Khởi đầu</span>
</div>
<div class="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span class="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2023</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Ra mắt Cloud VPS</span>
</div>
<div class="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span class="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2024</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Mở rộng hệ sinh thái dịch vụ</span>
</div>
<div class="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span class="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2025</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Phát triển hạ tầng Cloud doanh nghiệp</span>
</div>
<div class="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span class="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2026</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Mở rộng nền tảng Cloud</span>
</div>
</div>
</div>
</div>
</section>
<!-- Mission Section -->
<section class="py-3xl px-gutter max-w-container-max mx-auto">
<div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
<div class="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div class="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-lg">
<span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
</div>
<h3 class="font-headline-md text-headline-md mb-sm">Hiệu suất</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Infrastructure built for speed, optimized for intense compute workloads.</p>
</div>
<div class="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div class="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-lg">
<span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
<h3 class="font-headline-md text-headline-md mb-sm">Tin cậy</h3>
<p class="font-body-md text-body-md text-on-surface-variant">99.9% SLA and continuous monitoring to ensure your apps stay online.</p>
</div>
<div class="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div class="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-lg">
<span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
</div>
<h3 class="font-headline-md text-headline-md mb-sm">Đơn giản</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Cloud technology that is easy to use, designed with developers in mind.</p>
</div>
</div>
</section>
<!-- Infrastructure Section -->
<section class="py-3xl bg-on-surface text-surface px-gutter relative overflow-hidden">
<div class="max-w-container-max mx-auto relative z-10 flex flex-col md:flex-row items-center gap-2xl">
<div class="w-full md:w-1/2">
<h2 class="font-headline-lg text-headline-lg mb-lg text-surface">Hạ tầng được xây dựng để luôn sẵn sàng</h2>
<div class="grid grid-cols-2 gap-md">
<div class="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span class="block font-headline-md text-headline-md text-primary-fixed mb-xs">99.9%</span>
<span class="font-body-sm text-body-sm text-outline-variant">Uptime SLA</span>
</div>
<div class="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span class="block font-headline-md text-headline-md text-primary-fixed mb-xs">24/7</span>
<span class="font-body-sm text-body-sm text-outline-variant">Monitoring</span>
</div>
<div class="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span class="block font-headline-md text-headline-md text-primary-fixed mb-xs">Multi-layer</span>
<span class="font-body-sm text-body-sm text-outline-variant">Security</span>
</div>
<div class="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span class="block font-headline-md text-headline-md text-primary-fixed mb-xs">NVMe</span>
<span class="font-body-sm text-body-sm text-outline-variant">Infrastructure</span>
</div>
</div>
</div>
<div class="w-full md:w-1/2 h-[400px] rounded-2xl overflow-hidden border border-on-secondary-fixed-variant relative">
<img class="w-full h-full object-cover" data-alt="A dark-mode technical illustration of a modern server rack in a datacenter, illuminated by cool blue LED status lights, conveying high-performance computing, enterprise reliability, and secure network infrastructure." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcQi6Wps5KzMbObSyVpeRrWotFAT5BJvBpVCsdTLMOS_qqC9K_vjeyktNPZxUhLanbop6_SaPNI8vAxIPN0E-LZkyda8zpZj3-3Zk_Bz1N9P6p7sLiO_Bzkw5-VECRRLkW4p_ogOURrWRu82KXe1D9kTpPd6l5y4Iu2EznALUOyaLRWrAvOHhtayDpcJ7R0KYTrGroooF50TtxMULkXknFfg3sFGdHkZWTl2wgRvF6V_iPPOXh1A"/>
</div>
</div>
</section>
<!-- Security Section -->
<section class="py-3xl px-gutter max-w-container-max mx-auto">
<h2 class="font-headline-lg text-headline-lg text-center mb-2xl">Bảo mật là nền tảng</h2>
<div class="grid grid-cols-2 md:grid-cols-3 gap-lg">
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
<span class="font-body-md text-body-md font-medium text-on-surface">DDoS Protection</span>
</div>
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>wall_art</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Firewall</span>
</div>
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
<span class="font-body-md text-body-md font-medium text-on-surface">SSL/TLS</span>
</div>
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>backup</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Automated Backup</span>
</div>
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Active Monitoring</span>
</div>
<div class="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span class="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
<span class="font-body-md text-body-md font-medium text-on-surface">Access Control</span>
</div>
</div>
</section>
<!-- Our Values Section -->
<section class="py-3xl bg-surface-container-low px-gutter">
<div class="max-w-container-max mx-auto">
<h2 class="font-headline-lg text-headline-lg text-center mb-2xl">Giá trị cốt lõi</h2>
<div class="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div class="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span class="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
<h4 class="font-headline-md text-headline-md mb-xs">Customer First</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Lợi ích của khách hàng luôn là ưu tiên số một trong mọi quyết định.</p>
</div>
<div class="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span class="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
<h4 class="font-headline-md text-headline-md mb-xs">Innovation</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Không ngừng đổi mới để mang lại những giải pháp công nghệ tiên tiến nhất.</p>
</div>
<div class="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span class="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
<h4 class="font-headline-md text-headline-md mb-xs">Reliability</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Cung cấp hệ thống ổn định, đáng tin cậy để bạn an tâm phát triển.</p>
</div>
<div class="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span class="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
<h4 class="font-headline-md text-headline-md mb-xs">Transparency</h4>
<p class="font-body-sm text-body-sm text-on-surface-variant">Minh bạch trong vận hành, giá cả và giao tiếp với khách hàng.</p>
</div>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-3xl px-gutter max-w-container-max mx-auto text-center">
<div class="bg-primary-container text-on-primary-container rounded-2xl p-2xl md:p-3xl relative overflow-hidden">
<div class="relative z-10">
<h2 class="font-display-lg text-display-lg mb-lg">Hãy xây dựng sản phẩm tiếp theo cùng CloudNova.</h2>
<div class="flex flex-col sm:flex-row justify-center gap-md">
<button class="bg-on-primary-container text-primary-container px-lg py-md rounded-lg font-body-md text-body-md font-medium hover:opacity-90 transition-opacity">Khám phá dịch vụ</button>
<button class="bg-transparent border border-on-primary-container text-on-primary-container px-lg py-md rounded-lg font-body-md text-body-md font-medium hover:bg-on-primary-container/10 transition-colors">Liên hệ với chúng tôi</button>
</div>
</div>
</div>
</section>
</main>
`;

let reactCode = rawHtml.replace(/class=/g, 'className=');
reactCode = reactCode.replace(/<!--(.*?)-->/g, ''); 

// Run the fix logic (like we did for services)
reactCode = reactCode.replace(/\bmax-w-md\b/g, 'max-w-[28rem]');
reactCode = reactCode.replace(/\bmax-w-lg\b/g, 'max-w-[32rem]');
reactCode = reactCode.replace(/\bmax-w-xl\b/g, 'max-w-[36rem]');
reactCode = reactCode.replace(/\bmax-w-2xl\b/g, 'max-w-[42rem]');
reactCode = reactCode.replace(/\bmax-w-3xl\b/g, 'max-w-[48rem]');
reactCode = reactCode.replace(/\bmax-w-4xl\b/g, 'max-w-[56rem]');

// Also fix standard HTML attributes
reactCode = reactCode.replace(/data-alt/g, 'alt'); // Just use alt instead of data-alt
reactCode = reactCode.replace(/<img(.*?)src="(.*?)"(.*?)>/g, (match, p1, p2, p3) => {
    if (!match.endsWith('/>')) {
        return `<img${p1}src="${p2}"${p3} />`;
    }
    return match;
});

const pageContent = `
import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <>
            ${reactCode}
        </>
    );
}
`;

fs.mkdirSync('src/app/about', { recursive: true });
fs.writeFileSync('src/app/about/page.tsx', pageContent);
console.log('About page generated');
