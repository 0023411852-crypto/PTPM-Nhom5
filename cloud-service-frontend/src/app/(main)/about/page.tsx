
import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <>
            
<main className="pt-16 pb-3xl flex-grow">

<section className="px-gutter max-w-container-max mx-auto pt-xl pb-3xl">
<div className="flex flex-col md:flex-row items-center gap-2xl">
<div className="w-full md:w-1/2 space-y-lg">
<h1 className="font-display-lg text-display-lg text-on-surface md:pr-xl">Chúng tôi xây dựng hạ tầng cho những ý tưởng lớn.</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem]">CloudNova cung cấp nền tảng Cloud giúp cá nhân, startup và doanh nghiệp triển khai sản phẩm nhanh hơn, an toàn hơn và dễ dàng mở rộng hơn.</p>
<div className="pt-sm flex gap-md">
<button className="bg-primary text-on-primary px-lg py-md rounded-lg font-body-md text-body-md hover:opacity-90 transition-opacity">Khám phá dịch vụ</button>
</div>
</div>
<div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-outline-variant relative h-[400px]">
<img className="w-full h-full object-cover" alt="A clean, modern 3d illustration of cloud infrastructure servers and floating data nodes, rendered in bright corporate light mode with primary blue and white accents, evoking a sense of speed, scale, and high-tech developer environments." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiixOfW_BKeUSHQNlJGzk0jmXT_NhtNkeybOiq3ttiC_Upmu8P4viKwRkx4fNxke3LllWRWkWiRt798bh7B5ptkq9qfjOrAdVxawzxMJDmuUZe1jIt5U7XiEoHRfvTZPcLZ-3LJzy8PKS-54Y_dk1yPEDIX1It3lJpyZ5eQgcgUjRMVUa-V5kj1iAbwIyP-eMn8KjfwwUxC1XVbc7nuo0FdyJ986KISRfutukg-5zloepANdaVdg"/>
</div>
</div>
</section>

<section className="bg-surface-container-low py-3xl px-gutter">
<div className="max-w-container-max mx-auto">
<h2 className="font-headline-lg text-headline-lg text-center mb-2xl">Câu chuyện CloudNova</h2>
<div className="relative mt-2xl">
<div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant -translate-y-1/2 hidden md:block"></div>
<div className="grid grid-cols-1 md:grid-cols-5 gap-lg relative z-10">
<div className="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center">
<span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2022</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Khởi đầu</span>
</div>
<div className="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2023</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Ra mắt Cloud VPS</span>
</div>
<div className="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2024</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Mở rộng hệ sinh thái dịch vụ</span>
</div>
<div className="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2025</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Phát triển hạ tầng Cloud doanh nghiệp</span>
</div>
<div className="bg-surface rounded-xl p-md border border-outline-variant flex flex-col items-center text-center mt-xl md:mt-0">
<span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded mb-md">2026</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Mở rộng nền tảng Cloud</span>
</div>
</div>
</div>
</div>
</section>

<section className="py-3xl px-gutter max-w-container-max mx-auto">
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
<div className="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-lg">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
</div>
<h3 className="font-headline-md text-headline-md mb-sm">Hiệu suất</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Infrastructure built for speed, optimized for intense compute workloads.</p>
</div>
<div className="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-lg">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
<h3 className="font-headline-md text-headline-md mb-sm">Tin cậy</h3>
<p className="font-body-md text-body-md text-on-surface-variant">99.9% SLA and continuous monitoring to ensure your apps stay online.</p>
</div>
<div className="p-xl bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors hover:shadow-lg">
<div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-lg">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
</div>
<h3 className="font-headline-md text-headline-md mb-sm">Đơn giản</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Cloud technology that is easy to use, designed with developers in mind.</p>
</div>
</div>
</section>

<section className="py-3xl bg-on-surface text-surface px-gutter relative overflow-hidden">
<div className="max-w-container-max mx-auto relative z-10 flex flex-col md:flex-row items-center gap-2xl">
<div className="w-full md:w-1/2">
<h2 className="font-headline-lg text-headline-lg mb-lg text-surface">Hạ tầng được xây dựng để luôn sẵn sàng</h2>
<div className="grid grid-cols-2 gap-md">
<div className="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span className="block font-headline-md text-headline-md text-primary-fixed mb-xs">99.9%</span>
<span className="font-body-sm text-body-sm text-outline-variant">Uptime SLA</span>
</div>
<div className="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span className="block font-headline-md text-headline-md text-primary-fixed mb-xs">24/7</span>
<span className="font-body-sm text-body-sm text-outline-variant">Monitoring</span>
</div>
<div className="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span className="block font-headline-md text-headline-md text-primary-fixed mb-xs">Multi-layer</span>
<span className="font-body-sm text-body-sm text-outline-variant">Security</span>
</div>
<div className="p-md bg-inverse-surface rounded-xl border border-on-secondary-fixed-variant">
<span className="block font-headline-md text-headline-md text-primary-fixed mb-xs">NVMe</span>
<span className="font-body-sm text-body-sm text-outline-variant">Infrastructure</span>
</div>
</div>
</div>
<div className="w-full md:w-1/2 h-[400px] rounded-2xl overflow-hidden border border-on-secondary-fixed-variant relative">
<img className="w-full h-full object-cover" alt="A dark-mode technical illustration of a modern server rack in a datacenter, illuminated by cool blue LED status lights, conveying high-performance computing, enterprise reliability, and secure network infrastructure." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcQi6Wps5KzMbObSyVpeRrWotFAT5BJvBpVCsdTLMOS_qqC9K_vjeyktNPZxUhLanbop6_SaPNI8vAxIPN0E-LZkyda8zpZj3-3Zk_Bz1N9P6p7sLiO_Bzkw5-VECRRLkW4p_ogOURrWRu82KXe1D9kTpPd6l5y4Iu2EznALUOyaLRWrAvOHhtayDpcJ7R0KYTrGroooF50TtxMULkXknFfg3sFGdHkZWTl2wgRvF6V_iPPOXh1A"/>
</div>
</div>
</section>

<section className="py-3xl px-gutter max-w-container-max mx-auto">
<h2 className="font-headline-lg text-headline-lg text-center mb-2xl">Bảo mật là nền tảng</h2>
<div className="grid grid-cols-2 md:grid-cols-3 gap-lg">
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
<span className="font-body-md text-body-md font-medium text-on-surface">DDoS Protection</span>
</div>
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>wall_art</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Firewall</span>
</div>
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
<span className="font-body-md text-body-md font-medium text-on-surface">SSL/TLS</span>
</div>
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>backup</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Automated Backup</span>
</div>
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Active Monitoring</span>
</div>
<div className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
<span className="font-body-md text-body-md font-medium text-on-surface">Access Control</span>
</div>
</div>
</section>

<section className="py-3xl bg-surface-container-low px-gutter">
<div className="max-w-container-max mx-auto">
<h2 className="font-headline-lg text-headline-lg text-center mb-2xl">Giá trị cốt lõi</h2>
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div className="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span className="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
<h4 className="font-headline-md text-headline-md mb-xs">Customer First</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Lợi ích của khách hàng luôn là ưu tiên số một trong mọi quyết định.</p>
</div>
<div className="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span className="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
<h4 className="font-headline-md text-headline-md mb-xs">Innovation</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Không ngừng đổi mới để mang lại những giải pháp công nghệ tiên tiến nhất.</p>
</div>
<div className="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span className="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
<h4 className="font-headline-md text-headline-md mb-xs">Reliability</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Cung cấp hệ thống ổn định, đáng tin cậy để bạn an tâm phát triển.</p>
</div>
<div className="p-lg bg-surface border border-outline-variant rounded-xl text-center">
<span className="material-symbols-outlined text-3xl text-primary mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
<h4 className="font-headline-md text-headline-md mb-xs">Transparency</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Minh bạch trong vận hành, giá cả và giao tiếp với khách hàng.</p>
</div>
</div>
</div>
</section>

<section className="py-3xl px-gutter max-w-container-max mx-auto text-center">
<div className="bg-primary-container text-on-primary-container rounded-2xl p-2xl md:p-3xl relative overflow-hidden">
<div className="relative z-10">
<h2 className="font-display-lg text-display-lg mb-lg">Hãy xây dựng sản phẩm tiếp theo cùng CloudNova.</h2>
<div className="flex flex-col sm:flex-row justify-center gap-md">
<button className="bg-on-primary-container text-primary-container px-lg py-md rounded-lg font-body-md text-body-md font-medium hover:opacity-90 transition-opacity">Khám phá dịch vụ</button>
<button className="bg-transparent border border-on-primary-container text-on-primary-container px-lg py-md rounded-lg font-body-md text-body-md font-medium hover:bg-on-primary-container/10 transition-colors">Liên hệ với chúng tôi</button>
</div>
</div>
</div>
</section>
</main>

        </>
    );
}
