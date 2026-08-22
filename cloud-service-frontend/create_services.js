const fs = require('fs');

const rawHtml = `
<nav class="bg-surface-container-lowest font-body-md text-body-md sticky top-0 w-full z-50 border-b border-outline-variant shadow-sm">
<div class="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
<div class="font-headline-md text-headline-md font-bold text-primary">CloudNova</div>
<div class="hidden md:flex space-x-lg">
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">Trang chủ</a>
<a class="text-primary border-b-2 border-primary pb-1 active:scale-95 duration-150" href="#">Dịch vụ</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">VPS</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">Bảng giá</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">Khuyến mãi</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">Về chúng tôi</a>
<a class="text-on-surface-variant hover:text-primary transition-colors duration-150" href="#">Tin tức</a>
</div>
<button class="bg-primary text-on-primary px-md py-sm rounded-lg hover:bg-primary-container transition-colors font-semibold">Bắt đầu ngay</button>
</div>
</nav>
<!-- Main Content -->
<main class="flex-grow">
<!-- Hero Section -->
<section class="py-3xl px-gutter max-w-container-max mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-2xl items-center">
<div>
<h1 class="font-display-lg text-display-lg text-on-background mb-md">Dịch vụ Cloud cho mọi nhu cầu</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl">Từ website cá nhân đến hệ thống doanh nghiệp, CloudNova cung cấp hạ tầng Cloud mạnh mẽ, ổn định và dễ mở rộng.</p>
<div class="flex flex-col sm:flex-row gap-md justify-center md:justify-start">
<button class="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold hover:bg-primary-container transition-colors">Xem bảng giá</button>
<button class="border border-primary text-primary px-lg py-md rounded-lg font-semibold hover:bg-surface-container transition-colors">Tư vấn miễn phí</button>
</div>
</div>
<div class="hidden md:flex justify-center items-center">
<div class="relative w-full max-w-md aspect-square bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center p-xl">
<div class="text-center">
<span class="material-symbols-outlined text-[64px] text-primary mb-md block" style="font-variation-settings: 'FILL' 1;">cloud</span>
<div class="font-code-md text-code-md text-on-surface-variant">
                            Internet → Security → Cloud → Apps
                        </div>
</div>
</div>
</div>
</section>
<!-- Service Category Filter -->
<section class="py-lg px-gutter max-w-container-max mx-auto flex justify-center overflow-x-auto no-scrollbar">
<div class="flex space-x-sm bg-surface-container-low p-xs rounded-full border border-outline-variant">
<button class="px-lg py-sm rounded-full bg-primary text-on-primary font-body-sm font-medium">Tất cả</button>
<button class="px-lg py-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm font-medium">VPS</button>
<button class="px-lg py-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm font-medium">Hosting</button>
<button class="px-lg py-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm font-medium">Domain</button>
<button class="px-lg py-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm font-medium">Email</button>
<button class="px-lg py-sm rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm font-medium">Security</button>
</div>
</section>
<!-- Services Grid -->
<section class="py-2xl px-gutter max-w-container-max mx-auto">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
<!-- Card 1 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">dns</span>
</div>
<h3 class="font-headline-md text-headline-md">Cloud VPS</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Hiệu năng cao với ổ cứng NVMe và khả năng mở rộng linh hoạt. Lựa chọn hoàn hảo cho dự án lớn.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> vCPU &amp; RAM linh hoạt</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> NVMe siêu tốc</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Root Access toàn quyền</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> 99.9% Uptime Guarantee</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá VPS <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<!-- Card 2 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">web</span>
</div>
<h3 class="font-headline-md text-headline-md">Web Hosting</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Giải pháp lưu trữ website ổn định, dễ dàng quản lý với cPanel/DirectAdmin.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> SSD/NVMe Storage</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Free SSL Certificate</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Auto Backup daily</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Integrated Email</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá Hosting <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<!-- Card 3 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">public</span>
</div>
<h3 class="font-headline-md text-headline-md">Domain</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Đăng ký tên miền quốc tế và Việt Nam với công cụ quản lý DNS mạnh mẽ.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> International domains</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Advanced DNS Management</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Free WHOIS Protection</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Auto Renewal options</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Đăng ký Domain <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<!-- Card 4 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">mail</span>
</div>
<h3 class="font-headline-md text-headline-md">Business Email</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Email doanh nghiệp theo tên miền riêng, chuyên nghiệp và bảo mật cao.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Custom domains</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Advanced Spam Protection</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Large storage quotas</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Modern Webmail UI</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá Email <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<!-- Card 5 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">lock</span>
</div>
<h3 class="font-headline-md text-headline-md">SSL Certificate</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Bảo vệ dữ liệu truyền tải và tăng độ tin cậy cho website của bạn với HTTPS.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Secure HTTPS</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> 256-bit Encryption</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Domain Validation (DV)</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> High Browser Trust</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Xem SSL <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
<!-- Card 6 -->
<div class="glass-card rounded-[12px] p-lg flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all group">
<div class="flex items-center gap-sm mb-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined">shield</span>
</div>
<h3 class="font-headline-md text-headline-md">DDoS Firewall</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">Hệ thống tường lửa bảo vệ ứng dụng khỏi các cuộc tấn công mạng quy mô lớn.</p>
<ul class="space-y-sm mb-lg font-body-sm text-body-sm text-on-surface">
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Intelligent Traffic Filtering</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> L3/4/7 Protection</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Real-time Monitoring</li>
<li class="flex items-center gap-xs"><span class="material-symbols-outlined text-[16px] text-primary">check</span> Custom Rulesets</li>
</ul>
<a class="font-body-sm text-body-sm font-semibold text-primary group-hover:text-primary-container flex items-center gap-xs" href="#">Khám phá Security <span class="material-symbols-outlined text-[16px]">arrow_forward</span></a>
</div>
</div>
</section>
<!-- Feature Comparison -->
<section class="py-2xl bg-surface-container-lowest px-gutter">
<div class="max-w-container-max mx-auto">
<h2 class="font-headline-lg text-headline-lg text-center mb-xl">Không chỉ là Cloud. Đó là nền tảng để phát triển.</h2>
<div class="overflow-x-auto rounded-xl border border-outline-variant">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-bright font-label-caps text-label-caps text-on-surface-variant">
<th class="p-md font-semibold border-b border-outline-variant">Tính năng</th>
<th class="p-md font-semibold border-b border-outline-variant">Cloud VPS</th>
<th class="p-md font-semibold border-b border-outline-variant">Web Hosting</th>
<th class="p-md font-semibold border-b border-outline-variant">Business Email</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm text-on-surface">
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-md font-medium">Performance</td>
<td class="p-md">Dedicated Resources</td>
<td class="p-md">Shared, Optimized</td>
<td class="p-md">High Deliverability</td>
</tr>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-md font-medium">Security</td>
<td class="p-md">Custom Firewall, DDoS App</td>
<td class="p-md">WAF, Imunify360</td>
<td class="p-md">SpamAssassin, DKIM/SPF</td>
</tr>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-md font-medium">Scalability</td>
<td class="p-md">Instant upgrade</td>
<td class="p-md">Tiered plans</td>
<td class="p-md">Storage add-ons</td>
</tr>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td class="p-md font-medium">Backup</td>
<td class="p-md">Snapshots available</td>
<td class="p-md">Daily automated</td>
<td class="p-md">Daily automated</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors">
<td class="p-md font-medium">Support</td>
<td class="p-md">24/7 Technical</td>
<td class="p-md">24/7 Technical</td>
<td class="p-md">24/7 Technical</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-3xl px-gutter bg-surface-container text-center">
<div class="max-w-2xl mx-auto">
<h2 class="font-headline-lg text-headline-lg mb-sm text-on-background">Chưa biết nên chọn dịch vụ nào?</h2>
<p class="font-body-md text-body-md text-on-surface-variant mb-xl">Đội ngũ CloudNova sẵn sàng tư vấn giải pháp phù hợp với nhu cầu và ngân sách của bạn.</p>
<div class="flex flex-col sm:flex-row gap-md justify-center">
<button class="bg-primary text-on-primary px-lg py-md rounded-lg font-semibold hover:bg-primary-container transition-colors shadow-sm">Nhận tư vấn</button>
<button class="bg-surface-container-lowest border border-outline-variant text-on-surface px-lg py-md rounded-lg font-semibold hover:bg-surface-container-high transition-colors shadow-sm">Xem bảng giá</button>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-surface-container-low w-full py-2xl border-t border-outline-variant font-body-sm text-body-sm text-on-surface-variant">
<div class="grid grid-cols-1 md:grid-cols-4 gap-lg px-gutter max-w-container-max mx-auto">
<div>
<div class="font-headline-md text-headline-md font-bold text-on-surface mb-md">CloudNova</div>
<p class="mb-md">© 2024 CloudNova. All rights reserved. Professional Cloud Infrastructure in Vietnam.</p>
</div>
<div>
<h4 class="font-bold text-primary mb-sm">Công ty</h4>
<ul class="space-y-xs cursor-pointer">
<li class="hover:text-primary underline transition-all">Về chúng tôi</li>
<li class="hover:text-primary underline transition-all">Tuyển dụng</li>
<li class="hover:text-primary underline transition-all">Tin tức</li>
</ul>
</div>
<div>
<h4 class="font-bold text-primary mb-sm">Pháp lý</h4>
<ul class="space-y-xs cursor-pointer">
<li class="hover:text-primary underline transition-all">Điều khoản dịch vụ</li>
<li class="hover:text-primary underline transition-all">Chính sách bảo mật</li>
<li class="hover:text-primary underline transition-all">SLA</li>
</ul>
</div>
<div>
<h4 class="font-bold text-primary mb-sm">Tài nguyên</h4>
<ul class="space-y-xs cursor-pointer">
<li class="hover:text-primary underline transition-all">Tài liệu API</li>
<li class="hover:text-primary underline transition-all">Hướng dẫn</li>
<li class="hover:text-primary underline transition-all">Hỗ trợ</li>
</ul>
</div>
</div>
</footer>
`;

let reactCode = rawHtml.replace(/class=/g, 'className=');
reactCode = reactCode.replace(/<!--(.*?)-->/g, ''); // remove comments
reactCode = reactCode.replace(/style="([^"]*)"/g, (match, p1) => {
    // Basic inline style to react object converter (only handles simple cases like the one here)
    if (p1.includes("font-variation-settings: 'FILL' 1;")) {
        return "style={{ fontVariationSettings: \"'FILL' 1\" }}";
    }
    return match;
});
reactCode = reactCode.replace(/<br>/g, '<br />');
reactCode = reactCode.replace(/<hr>/g, '<hr />');

const pageContent = `
import React from 'react';

export default function ServicesPage() {
    return (
        <>
            ${reactCode}
        </>
    );
}
`;

fs.mkdirSync('src/app/services', { recursive: true });
fs.writeFileSync('src/app/services/page.tsx', pageContent);
console.log('Services page generated');
