const fs = require('fs');

const rawHtml = `
<!-- SideNavBar -->
<aside class="bg-inverse-surface text-on-secondary fixed left-0 top-0 h-full w-[260px] flex flex-col py-lg z-20">
<div class="px-lg mb-lg">
<h1 class="font-headline-md text-headline-md font-bold text-surface">CloudAdmin</h1>
<p class="font-body-sm text-body-sm text-on-secondary/70">Infrastructure v2.4</p>
</div>
<nav class="flex-1 flex flex-col gap-unit">
<a class="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg mx-sm transition-colors duration-200" href="#">
<span class="material-symbols-outlined filled-icon" data-icon="dashboard">dashboard</span>
<span class="font-body-md text-body-md">Overview</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-surface-variant hover:text-surface mx-sm hover:bg-primary-fixed-variant/10 rounded-lg transition-colors duration-200" href="#">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-body-md text-body-md">User Management</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-surface-variant hover:text-surface mx-sm hover:bg-primary-fixed-variant/10 rounded-lg transition-colors duration-200" href="#">
<span class="material-symbols-outlined" data-icon="dns">dns</span>
<span class="font-body-md text-body-md">Server/VPS Management</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-surface-variant hover:text-surface mx-sm hover:bg-primary-fixed-variant/10 rounded-lg transition-colors duration-200" href="#">
<span class="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
<span class="font-body-md text-body-md">Billing/Orders</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-surface-variant hover:text-surface mx-sm hover:bg-primary-fixed-variant/10 rounded-lg transition-colors duration-200" href="#">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
<span class="font-body-md text-body-md">Revenue Reports</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-surface-variant hover:text-surface mx-sm hover:bg-primary-fixed-variant/10 rounded-lg transition-colors duration-200" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-body-md text-body-md">System Settings</span>
</a>
</nav>
<div class="px-md mt-auto">
<div class="flex items-center gap-sm p-sm rounded-lg hover:bg-primary-fixed-variant/10 cursor-pointer transition-colors">
<div class="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0">
<img alt="Admin Logo" class="w-full h-full object-cover" data-alt="A professional headshot of a corporate IT administrator, male, wearing glasses, well-lit studio lighting, against a solid gray background, representing a premium enterprise platform user." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOCaM618_L8wvckuuCRwIbLO4YBhcpgXtfvuSOxdu3Lsy6-cIP571uAixRrdTAnwZla5y-64mDh2ur749axxvDTLvvbHHd2FupknF4oOJhxp0iVlQsV6O1iAzH4e1kNCD-M6nfkm93BzVXXobmtOFA3hiKlGjViAYgJbRTZ2wVQGEBGbZowvIO3VrwudODWirTKqJlb_89NXVGiHHRru0N8Srz3HfOhwttucCEBk0xz3Eol2w3VQ"/>
</div>
<div class="overflow-hidden">
<p class="font-body-sm text-body-sm font-medium truncate">Admin User</p>
<p class="font-body-sm text-body-sm text-on-secondary/70 text-[12px] truncate">admin@cloudnova.com</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<div class="flex-1 flex flex-col ml-[260px] h-full">
<!-- TopNavBar -->
<header class="bg-surface fixed top-0 right-0 left-[260px] h-16 border-b border-outline-variant shadow-sm z-10 flex justify-between items-center px-lg transition-all duration-150">
<div class="flex-1 max-w-md relative">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm pl-[36px] pr-sm font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="Search resources, servers, users..." type="text"/>
</div>
<div class="flex items-center gap-md">
<button class="text-on-surface-variant hover:text-primary transition-colors relative">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
</button>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
<div class="h-8 w-px bg-outline-variant mx-sm"></div>
<button class="text-primary font-body-sm text-body-sm font-medium hover:text-primary-container transition-colors">
                    Profile
                </button>
<div class="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 border border-outline-variant ml-sm">
<img alt="User profile photo" class="w-full h-full object-cover" data-alt="A professional headshot of a corporate IT administrator, male, wearing glasses, well-lit studio lighting, against a solid gray background, representing a premium enterprise platform user." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbMEgEupdtqeNJbFCWOuVqd_GjuaVKzdIHU0ql9HU2j1MEyenAXeRddJMIGE7MUcNS8Uck3AfqjloPJhuk4ydEGDAKK_o-bKFfIqpmYJEQUj3Kypy0bk7ZsmbyI7ViTfVBTNqQLK0mEI48pStNag4v7FXjZXJrTd63vPNF2u_p8HRihk1UdYfhcGYFhAPZ2pyqal6y4Oqa5Ql-LGFPchxDabNPkIE5qw3ZXM0WSUwt8WSLwTip1w"/>
</div>
</div>
</header>
<!-- Dashboard Canvas -->
<main class="flex-1 overflow-y-auto mt-16 p-lg bg-background">
<div class="max-w-container-max mx-auto space-y-lg pb-xl">
<div class="flex justify-between items-end">
<div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Tổng quan hệ thống</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-unit">CloudNova Platform Analytics</p>
</div>
<div class="flex gap-sm">
<button class="px-md py-sm bg-surface-container border border-outline-variant rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-sm">
<span class="material-symbols-outlined text-[18px]" data-icon="calendar_today">calendar_today</span>
                            This Month
                        </button>
<button class="px-md py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm">
<span class="material-symbols-outlined text-[18px]" data-icon="download">download</span>
                            Báo cáo
                        </button>
</div>
</div>
<!-- Quick Stats Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
<!-- Stat Card 1 -->
<div class="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start mb-md">
<div class="p-sm bg-primary-container/10 rounded-lg text-primary">
<span class="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<span class="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded uppercase">+12% vs last month</span>
</div>
<h3 class="font-body-sm text-body-sm text-on-surface-variant">Tổng doanh thu</h3>
<p class="font-headline-md text-headline-md text-on-surface mt-xs group-hover:text-primary transition-colors">1.250.000.000đ</p>
</div>
<!-- Stat Card 2 -->
<div class="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start mb-md">
<div class="p-sm bg-secondary-container/30 rounded-lg text-primary">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
<span class="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded uppercase">+5%</span>
</div>
<h3 class="font-body-sm text-body-sm text-on-surface-variant">Người dùng mới</h3>
<p class="font-headline-md text-headline-md text-on-surface mt-xs group-hover:text-primary transition-colors">856</p>
</div>
<!-- Stat Card 3 -->
<div class="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all group">
<div class="flex justify-between items-start mb-md">
<div class="p-sm bg-primary-container/10 rounded-lg text-primary">
<span class="material-symbols-outlined" data-icon="dns">dns</span>
</div>
<span class="font-label-caps text-label-caps text-outline bg-surface-container px-unit py-[2px] rounded uppercase">Stable</span>
</div>
<h3 class="font-body-sm text-body-sm text-on-surface-variant">VPS đang chạy</h3>
<p class="font-headline-md text-headline-md text-on-surface mt-xs group-hover:text-primary transition-colors">3,420</p>
</div>
<!-- Stat Card 4 -->
<div class="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-error/30 transition-all group">
<div class="flex justify-between items-start mb-md">
<div class="p-sm bg-error-container/50 rounded-lg text-error">
<span class="material-symbols-outlined" data-icon="confirmation_number">confirmation_number</span>
</div>
<span class="font-label-caps text-label-caps text-error bg-error-container/50 px-unit py-[2px] rounded uppercase">Urgent</span>
</div>
<h3 class="font-body-sm text-body-sm text-on-surface-variant">Ticket chờ xử lý</h3>
<p class="font-headline-md text-headline-md text-on-surface mt-xs group-hover:text-error transition-colors">12</p>
</div>
</div>
<!-- Main Content Bento Grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
<!-- Revenue Chart Card (Spans 2 columns on large screens) -->
<div class="lg:col-span-2 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg flex flex-col">
<div class="flex justify-between items-center mb-lg">
<div>
<h3 class="font-headline-md text-[20px] font-semibold text-on-surface">Biểu đồ doanh thu</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant">Monthly recurring revenue (MRR)</p>
</div>
<div class="flex items-center gap-sm text-on-surface-variant">
<div class="flex items-center gap-xs"><span class="w-3 h-3 rounded-full bg-primary block"></span><span class="font-body-sm text-body-sm">2024</span></div>
<div class="flex items-center gap-xs ml-sm"><span class="w-3 h-3 rounded-full bg-surface-container-highest block"></span><span class="font-body-sm text-body-sm">2023</span></div>
</div>
</div>
<!-- Simulated Chart Area -->
<div class="flex-1 relative min-h-[300px] w-full chart-grid rounded-lg border border-outline-variant/50 overflow-hidden flex items-end pt-lg px-md pb-md">
<!-- Y-axis labels simulated -->
<div class="absolute left-sm top-0 h-full flex flex-col justify-between py-md text-[10px] text-outline font-code-md">
<span>1.5B</span>
<span>1.0B</span>
<span>0.5B</span>
<span>0</span>
</div>
<!-- Simulated Line Chart Vectors -->
<div class="w-full h-full relative ml-8">
<svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
<!-- 2023 Line (Gray) -->
<path d="M0,80 Q10,75 20,70 T40,65 T60,70 T80,50 T100,60" fill="none" stroke="#d3e4fe" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
<!-- 2024 Line (Primary Blue) -->
<path d="M0,90 Q10,80 20,60 T40,40 T60,30 T80,15 T100,10" fill="none" stroke="#004bca" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
<!-- Area under Primary Line -->
<path d="M0,90 Q10,80 20,60 T40,40 T60,30 T80,15 T100,10 L100,100 L0,100 Z" fill="url(#blue-gradient)" opacity="0.2"></path>
<defs>
<linearGradient id="blue-gradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#0061ff"></stop>
<stop offset="100%" stopColor="#f8f9ff" stopOpacity="0"></stop>
</linearGradient>
</defs>
<!-- Data points -->
<circle cx="20" cy="60" fill="#ffffff" r="1.5" stroke="#004bca" strokeWidth="1"></circle>
<circle cx="40" cy="40" fill="#ffffff" r="1.5" stroke="#004bca" strokeWidth="1"></circle>
<circle cx="60" cy="30" fill="#ffffff" r="1.5" stroke="#004bca" strokeWidth="1"></circle>
<circle cx="80" cy="15" fill="#004bca" r="2"></circle> <!-- Current month highlight -->
</svg>
</div>
<!-- X-axis labels simulated -->
<div class="absolute bottom-1 left-8 right-md flex justify-between text-[10px] text-outline font-code-md">
<span>Jan</span>
<span>Feb</span>
<span>Mar</span>
<span>Apr</span>
<span>May</span>
<span>Jun</span>
</div>
</div>
</div>
<!-- Recent Transactions Table -->
<div class="lg:col-span-1 bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg flex flex-col">
<div class="flex justify-between items-center mb-md">
<h3 class="font-headline-md text-[20px] font-semibold text-on-surface">Giao dịch gần đây</h3>
<button class="text-primary hover:text-primary-container font-body-sm text-body-sm font-medium">View all</button>
</div>
<div class="flex-1 overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-outline-variant text-outline font-label-caps text-label-caps bg-surface-container-low/50">
<th class="py-sm px-sm font-semibold">Mã GD</th>
<th class="py-sm px-sm font-semibold">Khách hàng</th>
<th class="py-sm px-sm font-semibold text-right">Số tiền</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors group cursor-pointer">
<td class="py-md px-sm">
<p class="font-code-md text-code-md text-on-surface font-medium">CN-8942</p>
<span class="font-label-caps text-[10px] text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded mt-xs inline-block">Thành công</span>
</td>
<td class="py-md px-sm">
<p class="font-body-sm text-body-sm text-on-surface font-medium">Nguyễn Văn A</p>
<p class="font-body-sm text-[12px] text-on-surface-variant mt-xs truncate max-w-[120px]">Cloud VPS Pro</p>
</td>
<td class="py-md px-sm text-right">
<p class="font-code-md text-body-sm text-on-surface font-medium">399.000đ</p>
</td>
</tr>
<tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors group cursor-pointer">
<td class="py-md px-sm">
<p class="font-code-md text-code-md text-on-surface font-medium">CN-8941</p>
<span class="font-label-caps text-[10px] text-primary bg-primary/10 px-unit py-[2px] rounded mt-xs inline-block">Đang xử lý</span>
</td>
<td class="py-md px-sm">
<p class="font-body-sm text-body-sm text-on-surface font-medium">Trần Thị B</p>
<p class="font-body-sm text-[12px] text-on-surface-variant mt-xs truncate max-w-[120px]">Domain .vn</p>
</td>
<td class="py-md px-sm text-right">
<p class="font-code-md text-body-sm text-on-surface font-medium">750.000đ</p>
</td>
</tr>
<tr class="hover:bg-surface-container-low transition-colors group cursor-pointer">
<td class="py-md px-sm">
<p class="font-code-md text-code-md text-on-surface font-medium">CN-8940</p>
<span class="font-label-caps text-[10px] text-error bg-error/10 px-unit py-[2px] rounded mt-xs inline-block">Thất bại</span>
</td>
<td class="py-md px-sm">
<p class="font-body-sm text-body-sm text-on-surface font-medium">Lê Văn C</p>
<p class="font-body-sm text-[12px] text-on-surface-variant mt-xs truncate max-w-[120px]">VPS Starter</p>
</td>
<td class="py-md px-sm text-right">
<p class="font-code-md text-body-sm text-on-surface font-medium">99.000đ</p>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</main>
</div>
`;

let reactCode = rawHtml.replace(/class=/g, 'className=');
reactCode = reactCode.replace(/<!--(.*?)-->/g, ''); 
reactCode = reactCode.replace(/for=/g, 'htmlFor=');

reactCode = reactCode.replace(/data-alt/g, 'alt');
reactCode = reactCode.replace(/<img(.*?)src="(.*?)"(.*?)>/g, (match, p1, p2, p3) => {
    if (!match.endsWith('/>')) {
        return `<img${p1}src="${p2}"${p3} />`;
    }
    return match;
});

const pageContent = `
import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="bg-background text-on-background font-body-md text-body-md overflow-hidden h-screen flex">
            ${reactCode}
        </div>
    );
}
`;

fs.mkdirSync('src/app/admin', { recursive: true });
fs.writeFileSync('src/app/admin/page.tsx', pageContent);
console.log('Admin page generated');
