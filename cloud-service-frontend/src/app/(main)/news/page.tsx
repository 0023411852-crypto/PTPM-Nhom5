
import React from 'react';
import Link from 'next/link';

export default function NewsPage() {
    return (
        <>
            
<main className="flex-grow pt-16">

<section className="relative pt-3xl pb-2xl px-gutter overflow-hidden shader-overlay border-b border-outline-variant">
<div className="max-w-container-max mx-auto relative z-10 flex flex-col items-center text-center">
<h1 className="font-display-lg text-display-lg text-on-surface mb-md">Cloud Knowledge</h1>
<p className="font-body-lg text-body-lg text-secondary max-w-[42rem] mx-auto mb-xl">Kiến thức, hướng dẫn và tin tức mới nhất về Cloud, VPS, Hosting và bảo mật.</p>
<div className="w-full max-w-[42rem] relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-body-md text-on-surface placeholder:text-outline shadow-sm" placeholder="Tìm kiếm bài viết..." type="text"/>
</div>
</div>

<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
<div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
<div className="absolute -bottom-24 -left-24 w-72 h-72 bg-tertiary-container rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
</div>
</section>

<section className="border-b border-outline-variant bg-surface-container-lowest sticky top-16 z-40">
<div className="max-w-container-max mx-auto px-gutter">
<div className="flex overflow-x-auto hide-scrollbar gap-sm py-sm">
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-body-sm font-semibold transition-colors">Tất cả</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Cloud</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">VPS</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Hosting</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Security</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Tutorial</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Khuyến mãi</button>
<button className="whitespace-nowrap px-4 py-2 rounded-full bg-transparent text-secondary hover:bg-surface-container hover:text-on-surface font-body-sm transition-colors border border-transparent hover:border-outline-variant">Thông báo</button>
</div>
</div>
</section>
<div className="max-w-container-max mx-auto px-gutter py-xl">

<section className="mb-2xl">
<div className="group flex flex-col lg:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
<div className="lg:w-7/12 relative overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover min-h-[300px] lg:min-h-full group-hover:scale-105 transition-transform duration-700" alt="A modern server room with bright glowing blue lights indicating active cloud servers. The lighting is pristine and high-contrast, suggesting advanced enterprise infrastructure. Shallow depth of field focusing on a rack." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlWtqDLDjndOfqMEPgZ7xQS8TVLfAjxDNuYfwhikWGqZhG7ysOAOazYrTjymxUQ6onsCESb7AX6izeRji6Xmfiiq3Prfy1v_5rR5-SGswmytDE5sv03TSTBzs4y1AP0qtR6QIOOXzsErjjaACNgOOJUkhS4YbTdEa0lufYL6VJ87ANSXUut1_lC-hv1c6WFd_qXb7OzdG5zlcrk_qTKJ9COZDZ7rVCScBRjUjT6QYZ7v9sXLH-2Q"/>
</div>
<div className="lg:w-5/12 p-lg lg:p-xl flex flex-col justify-center bg-surface-container-lowest">
<div className="flex items-center gap-xs mb-md">
<span className="px-2 py-1 bg-surface-variant text-primary font-label-caps text-label-caps rounded uppercase">Cloud</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-md group-hover:text-primary transition-colors">VPS là gì? Hướng dẫn lựa chọn VPS phù hợp cho doanh nghiệp</h2>
<p className="font-body-md text-body-md text-secondary mb-lg line-clamp-3">Tìm hiểu chi tiết về Virtual Private Server (VPS), cách thức hoạt động, và những tiêu chí quan trọng để chọn lựa dịch vụ VPS tối ưu cho nhu cầu kinh doanh và vận hành hệ thống của bạn.</p>
<div className="flex items-center justify-between mt-auto pt-lg border-t border-outline-variant">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" alt="A professional headshot of a technical author, a man in his 30s wearing a simple dark blue t-shirt against a clean light gray background. Well lit, approachable." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2yzf5UmcLVJl6ubcdZjLrtZRToMfXUrb47K8T79ThV5idOBG8tp-BKe8cFtgIjVF8sp_Nl7tYlDaiR9KHns-kjS0cgaywuzbwo_YgDDK57lzkRIGFkaOGpsI7NM7fi5mHx9Nfwdt1wRpSi24aE4XvAh_EQZQ8E_Vie55ir6PoqveKKrMAgEahNygS1rC0h6F3hAJ3G0gls-JaTVj4HA8i7vbYJXyfIDIi_0tyWfzUumZuP466Gw"/>
</div>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-semibold text-on-surface">Minh Nguyen</span>
<div className="flex items-center text-secondary text-xs gap-1">
<span>Oct 12, 2023</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>5 min read</span>
</div>
</div>
</div>
<button className="text-primary font-body-sm font-semibold hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1">
                                Đọc bài viết <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">

<div className="lg:col-span-8">
<h3 className="font-headline-md text-headline-md text-on-surface mb-lg">Bài viết mới nhất</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

<article className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">
<div className="relative h-48 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A side-by-side conceptual illustration showing two different server architectures. On the left, a shared hosting metaphor, on the right, an isolated secure VPS block. Clean vector style, corporate blue and gray palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIq2U5hGBOHu5Vj2jl0oNwchzvoD8wx0Pzp9NVb0_aiVWBdZbSIsYyQ5_byLxNYQYdwWYRhYHqcoYchLmKTKcsjBevimQRF-k9qfpQfNWHVTYsYAJyl5_thCYLvZsGxJ70h3gxyW3gs9N_E9GRt1DtO8pwlCMjd1qLfexh-Ngy3kmJlXSjeXmgqYrifQWdFgh-PwYGUmFuTqIIZHYpVQGnb9w_uWUAKxTnBp70O0Y3E_j-E67epA"/>
<div className="absolute top-4 left-4">
<span className="px-2 py-1 bg-surface-container-lowest/90 backdrop-blur text-secondary font-label-caps text-label-caps rounded shadow-sm border border-outline-variant">Hosting</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors text-xl">Hosting vs VPS: Nên lựa chọn giải pháp nào?</h4>
<p className="font-body-sm text-body-sm text-secondary mb-4 line-clamp-2">Phân tích ưu nhược điểm của Shared Hosting và VPS để giúp bạn đưa ra quyết định đầu tư hạ tầng chính xác.</p>
<div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
<div className="flex items-center gap-2 text-secondary font-body-sm text-xs">
<span>Oct 10</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>4 min read</span>
</div>
<a className="text-primary hover:underline font-body-sm text-sm" href="#">Read more →</a>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">
<div className="relative h-48 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A digital shield icon glowing in neon blue over a dark background representing network traffic and DDoS attacks being deflected. Technical cybersecurity theme, highly detailed." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9LRIAYQNBEsCn9_9XpfZaekQj2MM4o1UehXZvZHzcWp__3vm01l4N8U50n8R1h1WionoJ1ClYdyh0YJOTd02PU8j6Z4HCWZJ97BvElXzNCTUOQPnaMszx44tHTjx_chLJaXSIwR-f5fuvl27DCv4L2YGy7o8lWpVidRVrsMJeC-ELB9osCK0IZQvjNcW10sysYzKVKYTKpw6CLqES5Y8GHptl52TuwRwepOLcAfOzsTVI9vmtsw"/>
<div className="absolute top-4 left-4">
<span className="px-2 py-1 bg-surface-container-lowest/90 backdrop-blur text-secondary font-label-caps text-label-caps rounded shadow-sm border border-outline-variant">Security</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors text-xl">7 cách bảo vệ website khỏi tấn công DDoS</h4>
<p className="font-body-sm text-body-sm text-secondary mb-4 line-clamp-2">Các biện pháp thực tiễn từ cấu hình server đến sử dụng CDN và WAF để giảm thiểu rủi ro bị tấn công từ chối dịch vụ.</p>
<div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
<div className="flex items-center gap-2 text-secondary font-body-sm text-xs">
<span>Oct 08</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>6 min read</span>
</div>
<a className="text-primary hover:underline font-body-sm text-sm" href="#">Read more →</a>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">
<div className="relative h-48 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A stylized dashboard interface showing high performance metrics, green upward trending charts, and server optimization data. Clean UI style, light gray and blue colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-kVlYv8f2rk5C_mIe7ucq3_YR9G_oq6Er67gzQNGFiC_N-f3BnTdDgiSE4R2DyF2B9B-jW6QBRYeKHtqDT_elLlbQoEvMJu-9na_wuUJ2rSr5YIEbumNaA0VXspH1ZNwSR148oi_myGyNtbpse5EcsRTHoG5uobtRaR4CeC-16zmpnt414wAsCUIMk7W50ukOF7R3fwbNS9nnw3IxohZwfusG1IucmVseILG3JmiksQFJmpD2jg"/>
<div className="absolute top-4 left-4">
<span className="px-2 py-1 bg-surface-container-lowest/90 backdrop-blur text-secondary font-label-caps text-label-caps rounded shadow-sm border border-outline-variant">Tutorial</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors text-xl">Cách tối ưu hiệu suất website trên VPS</h4>
<p className="font-body-sm text-body-sm text-secondary mb-4 line-clamp-2">Hướng dẫn cấu hình Nginx, tinh chỉnh PHP-FPM và cài đặt Redis cache để tăng tốc độ tải trang đáng kể.</p>
<div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
<div className="flex items-center gap-2 text-secondary font-body-sm text-xs">
<span>Oct 05</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>8 min read</span>
</div>
<a className="text-primary hover:underline font-body-sm text-sm" href="#">Read more →</a>
</div>
</div>
</article>

<article className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full">
<div className="relative h-48 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="An abstract 3D rendering of cloud computing interconnected nodes floating above a sleek metallic surface. Bright, clean, corporate enterprise aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkVxNpFRueb5ZbORAoJbn3QL8iB4gdeRsllJOynMGhaUz1FEYAXS3pU83Gf9jEINMWoY17p44Sr3gCJdbLJTizeIjz0px-GrDl9apaf_9uYPTTNFkEfTuSzndRSTMm2AfWXk79yf7M-KW3zrTwHe0dFWL8eevo3VzAL2UloE0T7S8JAEyRd5G9NoCcVWc3IZK94P7KeuelMWXDdmkY58jjE6auierepLO-voCnQNOmfqs_SJ9R8w"/>
<div className="absolute top-4 left-4">
<span className="px-2 py-1 bg-surface-container-lowest/90 backdrop-blur text-secondary font-label-caps text-label-caps rounded shadow-sm border border-outline-variant">Cloud</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors text-xl">Cloud Computing là gì?</h4>
<p className="font-body-sm text-body-sm text-secondary mb-4 line-clamp-2">Tổng quan về điện toán đám mây, các mô hình IaaS, PaaS, SaaS và lý do tại sao nó là tương lai của IT.</p>
<div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
<div className="flex items-center gap-2 text-secondary font-body-sm text-xs">
<span>Sep 28</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span>5 min read</span>
</div>
<a className="text-primary hover:underline font-body-sm text-sm" href="#">Read more →</a>
</div>
</div>
</article>
</div>

<div className="mt-xl flex items-center justify-center gap-sm">
<button className="px-4 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm disabled:opacity-50" disabled>
                            ← Trước
                        </button>
<button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-body-sm font-semibold flex items-center justify-center shadow-sm">1</button>
<button className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-secondary hover:bg-surface-container transition-colors font-body-sm flex items-center justify-center">2</button>
<button className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-secondary hover:bg-surface-container transition-colors font-body-sm flex items-center justify-center">3</button>
<button className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-secondary hover:bg-surface-container transition-colors font-body-sm flex items-center justify-center">4</button>
<button className="px-4 py-2 border border-outline-variant rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors font-body-sm">
                            Sau →
                        </button>
</div>
</div>

<div className="lg:col-span-4 space-y-xl">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
<h4 className="font-headline-md text-headline-md text-on-surface mb-md border-b border-outline-variant pb-sm">Bài viết nổi bật</h4>
<div className="flex flex-col gap-md">

<a className="group flex items-start gap-md hover:bg-surface-container p-2 rounded-lg transition-colors -mx-2" href="#">
<div className="w-16 h-16 rounded bg-surface-variant flex-shrink-0 overflow-hidden border border-outline-variant/50">
<img className="w-full h-full object-cover" alt="A miniature isometric view of a secure datacenter. Tiny servers glowing. Clean design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO7hwnbeUjljJ-Po9HkHyoLmYBpoWHj9QHJxncq6PKSI-WcZBm_DbuiNatusKnvKsXqUGOSIpLYtqCEfJsR7yEGx0hEzC6baLqNaTXIyO5d3xj3TFvzvXvLzx0HBUTzs5rAChsdmsFsTCmybr5406HSFkNWjeEoCLddxTgVg6JybtOt98Svv5EkMnLjKLmwhvW7I0SFjNHm7S-0JPUk_MlN67qx29Wnk2x5XGKc3pqhoEy8hyU1g"/>
</div>
<div>
<h5 className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">Cấu hình Firewall UFW cơ bản trên Ubuntu</h5>
<span className="text-secondary text-xs font-body-sm">Oct 01, 2023</span>
</div>
</a>

<a className="group flex items-start gap-md hover:bg-surface-container p-2 rounded-lg transition-colors -mx-2" href="#">
<div className="w-16 h-16 rounded bg-surface-variant flex-shrink-0 overflow-hidden border border-outline-variant/50">
<img className="w-full h-full object-cover" alt="A stylized SSH terminal window showing green text on a dark background. Technical and geeky aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAER_cIdB6iKFJcVSaZZy2tJjuJG0QdcK_AwO7Khg8ghkbXaatNEXdoWf7S6rxdK-OCFuwEldbyKG2gVaIMiv-D7GBdzBoAG29Hctl-gTcx-DIsGwDpkfTPHc1--OGMwolx7KS5xgM7YD2XLUO4l4p_4MHOWBDvpq8O-VtsEnSFhR29JjfXii9B8LsJH6OikiIPu6c-RTAGvMxsgUOsnO0eYmIlu_gfCess1KPgNr7LQcSJd6TqcA"/>
</div>
<div>
<h5 className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">Hướng dẫn tạo và sử dụng SSH Key an toàn</h5>
<span className="text-secondary text-xs font-body-sm">Sep 15, 2023</span>
</div>
</a>

<a className="group flex items-start gap-md hover:bg-surface-container p-2 rounded-lg transition-colors -mx-2" href="#">
<div className="w-16 h-16 rounded bg-surface-variant flex-shrink-0 overflow-hidden border border-outline-variant/50">
<img className="w-full h-full object-cover" alt="A glowing padlock icon hovering over a web browser window. Security concept for SSL certificates." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7AfWlkMR4iBkPv0h46ZBQoT8gV8HmgFLCUGpQdbHQzdR2mtDxrN9a9ki6KKnvsnJ6rOVqFiR-bIzLxX0J-sEK9OohojXtShwJHfZy-8bQHFXPq1tFxa8TZia4R3zKkDcxkk97H3QcP8uYqsROxwxmpbk-TFhzG2NKtf-NEqAZ30uKgJyflQtMyx5ROw7mwFqdjGsXHHIx5Z1_oIiIYDN3o48B_yoKgd8TfqvnnLQn5d4R3T-Ung"/>
</div>
<div>
<h5 className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">Cài đặt SSL miễn phí với Let's Encrypt</h5>
<span className="text-secondary text-xs font-body-sm">Sep 10, 2023</span>
</div>
</a>

<a className="group flex items-start gap-md hover:bg-surface-container p-2 rounded-lg transition-colors -mx-2" href="#">
<div className="w-16 h-16 rounded bg-surface-variant flex-shrink-0 overflow-hidden border border-outline-variant/50">
<img className="w-full h-full object-cover" alt="A minimalist line art illustration of a database structure, nodes connecting in a hierarchy." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB209MIZRT1cMqLNr63kTs_YV4LK7gCS262_RwFZ7UFuqmdZeeyTc6pjkAbzyIvvB9nHd-iVIcli2y9MPJtkKo6PSvMuUdhtkKBUvShEExGdBMVUVaXjJP2VBVT0Tk7mmhABrTmJSu-Y6xnClAHFT6w2YY49fDdTKyyMQ9Zc8A7rAp3B8XQGNUTWOG6DcBaXO4rt-oyFtUMBVV1FiUJnUkMMhfzGHp2kk7R1dcWo0S3KfqzgdY1PQ"/>
</div>
<div>
<h5 className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">Backup Database MySQL tự động lên Cloud Storage</h5>
<span className="text-secondary text-xs font-body-sm">Sep 02, 2023</span>
</div>
</a>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
<h4 className="font-headline-md text-headline-md text-on-surface mb-md border-b border-outline-variant pb-sm">Chủ đề phổ biến</h4>
<div className="flex flex-wrap gap-2">
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#Ubuntu</a>
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#Nginx</a>
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#Docker</a>
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#MySQL</a>
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#Firewall</a>
<a className="px-3 py-1 rounded border border-outline-variant bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-body-sm transition-colors text-sm" href="#">#WordPress</a>
</div>
</div>
</div>
</div>
</div>

<section className="mt-2xl border-t border-outline-variant bg-surface-container py-2xl px-gutter relative overflow-hidden">
<div className="absolute inset-0 pointer-events-none opacity-20">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
</div>
<div className="max-w-[48rem] mx-auto relative z-10 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-md p-xl text-center">
<span className="material-symbols-outlined text-primary text-4xl mb-md">mail</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Nhận kiến thức Cloud mới nhất</h2>
<p className="font-body-md text-body-md text-secondary mb-lg">Đăng ký email để nhận hướng dẫn kỹ thuật, thông tin sản phẩm và ưu đãi mới nhất từ CloudNova.</p>
<form className="flex flex-col sm:flex-row gap-sm max-w-[32rem] mx-auto">
<input className="flex-grow px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all font-body-md text-on-surface placeholder:text-outline shadow-sm" placeholder="Email của bạn" required type="email"/>
<button className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-md font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm whitespace-nowrap" type="submit">
                        Đăng ký
                    </button>
</form>
<p className="text-xs text-secondary mt-md">Chúng tôi cam kết không spam. Bạn có thể hủy đăng ký bất cứ lúc nào.</p>
</div>
</section>
</main>

        </>
    );
}
