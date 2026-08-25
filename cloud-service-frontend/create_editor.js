const fs = require('fs');

const rawHtml = `
<!-- Shared Component: SideNavBar -->
<nav class="fixed left-0 top-0 h-full w-[260px] bg-on-secondary-fixed dark:bg-on-background flex flex-col py-lg px-md border-r border-outline-variant/20 z-20">
<!-- Brand -->
<div class="flex items-center gap-3 mb-xl px-sm">
<div class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-surface-container-lowest">
<span class="material-symbols-outlined text-[20px]">cloud</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md font-bold text-surface-container-lowest leading-tight">CloudNova</h1>
<p class="font-body-sm text-body-sm text-surface-variant/70 leading-tight">Editor Dashboard</p>
</div>
</div>
<!-- CTA -->
<button class="w-full bg-primary-container text-on-primary-container font-body-md text-body-md py-2 px-4 rounded-lg flex items-center justify-center gap-2 mb-lg hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            New Post
        </button>
<!-- Main Nav Links -->
<ul class="flex flex-col gap-1 flex-1">
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">dashboard</span>
                    Overview
                </a>
</li>
<!-- Active State Logic Applied Here -->
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-container-lowest bg-primary-container/20 border-r-4 border-primary-container transition-all duration-200" href="#">
<span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    Article Management
                </a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">auto_stories</span>
                    Static Pages
                </a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">campaign</span>
                    Promotions
                </a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">perm_media</span>
                    Media Library
                </a>
</li>
</ul>
<!-- Footer Nav Links -->
<div class="mt-auto pt-lg border-t border-outline-variant/10">
<ul class="flex flex-col gap-1">
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
                        Settings
                    </a>
</li>
<li>
<a class="flex items-center gap-3 px-3 py-2 rounded-md font-body-md text-body-md text-surface-variant/70 hover:bg-primary-container/10 hover:text-surface-container-lowest transition-colors" href="#">
<span class="material-symbols-outlined">help_outline</span>
                        Support
                    </a>
</li>
</ul>
</div>
</nav>
<!-- Main Content Wrapper -->
<div class="flex-1 ml-[260px] flex flex-col min-w-0">
<!-- Shared Component: TopAppBar -->
<header class="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface dark:bg-surface-dim border-b border-outline-variant flex justify-between items-center px-lg z-10">
<!-- Left Side: Title & Search -->
<div class="flex items-center gap-lg flex-1">
<span class="font-headline-md text-headline-md text-on-surface whitespace-nowrap">Article Management</span>
<div class="relative w-64 hidden lg:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-md pl-10 pr-4 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Search..." type="text"/>
</div>
</div>
<!-- Right Side: Actions & Profile -->
<div class="flex items-center gap-md">
<button class="font-body-sm text-body-sm font-medium text-primary hover:bg-primary/5 px-3 py-1.5 rounded-md transition-colors">Export CSV</button>
<button class="font-body-sm text-body-sm font-medium bg-primary-container text-on-primary-container px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity">Publish All</button>
<div class="w-px h-6 bg-outline-variant mx-2"></div>
<button class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>
<!-- Main Canvas Area -->
<main class="flex-1 overflow-y-auto mt-16 p-lg bg-surface">
<div class="max-w-[1200px] mx-auto w-full">
<!-- Page Header & Main Actions -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-lg">
<div>
<h2 class="font-headline-lg text-headline-lg text-on-surface">Danh sách bài viết</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý, chỉnh sửa và xuất bản nội dung của bạn.</p>
</div>
<button class="bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto">
<span class="material-symbols-outlined">edit_note</span>
                        Viết bài mới
                    </button>
</div>
<!-- Toolbar: Search & Filters -->
<div class="flex flex-col md:flex-row gap-4 mb-lg p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
<!-- Search -->
<div class="relative flex-1 min-w-[200px]">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input class="w-full bg-surface border border-outline-variant rounded-md pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all" placeholder="Tìm kiếm bài viết..." type="text"/>
</div>
<!-- Filters -->
<div class="flex flex-wrap gap-4">
<div class="relative min-w-[160px]">
<select class="w-full bg-surface border border-outline-variant rounded-md pl-4 pr-10 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm cursor-pointer">
<option>Chuyên mục: Tất cả</option>
<option>Cloud</option>
<option>VPS</option>
<option>Hosting</option>
<option>Security</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
</div>
<div class="relative min-w-[160px]">
<select class="w-full bg-surface border border-outline-variant rounded-md pl-4 pr-10 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm cursor-pointer">
<option>Trạng thái: Tất cả</option>
<option>Đã xuất bản</option>
<option>Bản nháp</option>
</select>
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
</div>
</div>
</div>
<!-- Data Table -->
<div class="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse whitespace-nowrap">
<thead class="bg-surface-container-low border-b border-outline-variant">
<tr>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Tiêu đề</th>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Tác giả</th>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Chuyên mục</th>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Lượt xem</th>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Trạng thái</th>
<th class="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider text-right">Hành động</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/50">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-surface-variant">
<img class="w-full h-full object-cover" data-alt="A small abstract 3D illustration of a server stack floating in a blue gradient space, clean minimal lighting, enterprise SaaS aesthetic, 40x40 thumbnail size" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz8XOKNtn2nXKJtfydbw0FlVVMoYZSHd8vJRqVllFANYTs8uuXq4ixS3IujI-C2Nvdqc4-rMuyho-DdVJ5Qp64DCEYmKpvEP2r5zni0q_iGm9mIzAGuvxsz6up671iXAPYHCuPH514mL1-v_k5nKetYuq4q68jQ60SqIiPR5qvWxbXV3wFtNzv-lsgrpCNIDNh_BfLvsluKA1yTHIqgy-TuNmSEGqynidprYCDx-o9qkGxsXGFxw"/>
</div>
<span class="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary cursor-pointer transition-colors max-w-[300px] truncate">VPS là gì? Hướng dẫn lựa chọn VPS phù hợp</span>
</div>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A professional headshot avatar of a young asian male developer smiling subtly, isolated on a light gray background, high quality lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJK6N72BXs2YJj5oNTbkRQNIPZMl6meR6T6mfFXQXGJDBVVhZ0Ev9imIyT6OfaBAS36yhrB1EF2UwerruOzS0zDffAq9_NgUgdD8hE8P9Pkr8Fg5g0mK9zuf3J4dQx3BLjXn5AzX4qk9xIMhQIPymbj4t3ugNnvlwOZt_ibquw1ljDNGRsdKJ4HSyALZ-RvGynsoe0r5k9e6FsuFh8Q-EIeyp1XHMBfE5I9Sz7AjUJUeGGPTMxMg"/>
</div>
<span class="font-body-sm text-body-sm text-on-surface">Minh Nguyen</span>
</div>
</td>
<td class="px-md py-4">
<span class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">Cloud</span>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-1.5 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">visibility</span>
<span class="font-code-md text-code-md">1.2k</span>
</div>
</td>
<td class="px-md py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/20">
                                            Đã xuất bản
                                        </span>
</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Xóa">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-surface-variant">
<img class="w-full h-full object-cover" data-alt="A conceptual illustration of a glowing shield over a wireframe globe, representing cybersecurity, dark blue and neon accents, clean tech style, 40x40 thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOWRh3zzd-oSA0M-XgAlp9neL0gl5mc3QEhPsnZx4sGvwmNV8bhV8R8vKFwzlBL7kn7EzTnTLW0eN_iohi-u2qfxtMy6DIaYR8GifbOsqarCRYl8S_csTyxVvxikp2O8QJdW5E6UZ4Za69wDHcCBPcfhgKoOBAGXrqbrrcygFSXS2S7Jh_i-BRPvBC7Z7sP3FMCcw3AYNqT62pp9rx9gPs6Qs3fWPLaDoUvz_Px0w0zi3S08sIdA"/>
</div>
<span class="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary cursor-pointer transition-colors max-w-[300px] truncate">7 cách bảo vệ website khỏi tấn công DDoS</span>
</div>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="A professional headshot avatar of an asian female security analyst, wearing glasses, neutral background, soft studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADkA9AdOvPADTVp_vrUcQZyg7tli4ED6hzwkS3FEB2IeJq9a69Z22baTff7XO5IuPwSUfUEvjHtWMtIKhnKod9YIAgLieV5n-FshHmKZasXIHDAzg-RDea5m4rkJ1XnXNs55xPylpIQRNo7hgG5qruhAbgcHtHLjXc2g78q91EdNMlqAmkyPOzE7Ibn7XGxR-d0YDYaZUV_c4bj-vWntPs6K5eeb_CRTcbXBL6eetIaTQtfjyDxg"/>
</div>
<span class="font-body-sm text-body-sm text-on-surface">Lan Anh</span>
</div>
</td>
<td class="px-md py-4">
<span class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">Security</span>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-1.5 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">visibility</span>
<span class="font-code-md text-code-md">850</span>
</div>
</td>
<td class="px-md py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/20">
                                            Đã xuất bản
                                        </span>
</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Xóa">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="px-md py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-outline">image</span>
</div>
<span class="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary cursor-pointer transition-colors max-w-[300px] truncate">Cấu hình Nginx cho Next.js App</span>
</div>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
                                                HN
                                            </div>
<span class="font-body-sm text-body-sm text-on-surface">Hoang Nam</span>
</div>
</td>
<td class="px-md py-4">
<span class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">Tutorial</span>
</td>
<td class="px-md py-4">
<div class="flex items-center gap-1.5 text-outline">
<span class="material-symbols-outlined text-[16px]">visibility</span>
<span class="font-code-md text-code-md">0</span>
</div>
</td>
<td class="px-md py-4">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                                            Bản nháp
                                        </span>
</td>
<td class="px-md py-4 text-right">
<div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
<span class="material-symbols-outlined text-[20px]">edit</span>
</button>
<button class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Xóa">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer / Stats -->
<div class="bg-surface border-t border-outline-variant px-md py-3 flex items-center justify-between">
<span class="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 3 of 42 entries</span>
<!-- Pagination -->
<div class="flex items-center gap-1">
<button class="px-3 py-1.5 font-body-sm text-body-sm border border-outline-variant rounded hover:bg-surface-container-low text-on-surface-variant transition-colors disabled:opacity-50" disabled>Trang trước</button>
<button class="w-8 h-8 flex items-center justify-center font-body-sm text-body-sm rounded bg-primary-container text-on-primary-container font-medium">1</button>
<button class="w-8 h-8 flex items-center justify-center font-body-sm text-body-sm rounded hover:bg-surface-container-low text-on-surface transition-colors">2</button>
<button class="w-8 h-8 flex items-center justify-center font-body-sm text-body-sm rounded hover:bg-surface-container-low text-on-surface transition-colors">3</button>
<span class="px-1 text-on-surface-variant">...</span>
<button class="w-8 h-8 flex items-center justify-center font-body-sm text-body-sm rounded hover:bg-surface-container-low text-on-surface transition-colors">14</button>
<button class="px-3 py-1.5 font-body-sm text-body-sm border border-outline-variant rounded hover:bg-surface-container-low text-on-surface transition-colors">Trang sau</button>
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

export default function EditorPage() {
    return (
        <div className="bg-background text-on-surface font-body-md antialiased overflow-hidden h-screen flex">
            ${reactCode}
        </div>
    );
}
`;

fs.mkdirSync('src/app/editor', { recursive: true });
fs.writeFileSync('src/app/editor/page.tsx', pageContent);
console.log('Editor page generated');
