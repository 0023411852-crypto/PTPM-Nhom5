const fs = require('fs');

const rawHtml = `
<div class="w-full max-w-md">
<!-- Logo -->
<div class="flex justify-center mb-lg">
<img alt="CloudNova Logo" class="w-2xl h-2xl object-contain rounded-xl shadow-sm bg-white p-2 border border-outline-variant" src="https://lh3.googleusercontent.com/aida/AP1WRLtXpLDCeAkzHKEgrwo4KPsZwWLDhm6abHZmi0-63wgmcnnWA1PmhjYqXGDhDI6g3xWscRm1KZJJLeTAH840G6Ux4ZyqagCFWyQ1uDksYzXkG8xFGx2lESwNOYECwW184tV1FBAHNTlrK3PBQ9nWkxTLX1_5WLj6Z24ycfOruijLeA1yAkbcJZFokdebB9Ilgg8x2F4baW8kY36UwLCEIfCwS9-HK5K-kcvW6RMQi7MXoUE-JYvp9rdz"/>
</div>
<!-- Login Card -->
<div class="glass-panel rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-xl relative overflow-hidden">
<!-- Decorative Glow -->
<div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
<div class="relative z-10">
<h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-center text-on-background mb-xl">
                    Đăng nhập CloudNova
                </h1>
<form class="space-y-lg">
<!-- Email Input -->
<div>
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase" for="email">Email</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">mail</span>
<input class="w-full pl-2xl pr-sm py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" id="email" name="email" placeholder="name@company.com" required type="email"/>
</div>
</div>
<!-- Password Input -->
<div>
<div class="flex justify-between items-center mb-sm">
<label class="block font-label-caps text-label-caps text-on-surface-variant uppercase" for="password">Mật khẩu</label>
<a class="font-body-sm text-body-sm text-primary hover:text-primary-fixed-variant transition-colors" href="#">Quên mật khẩu?</a>
</div>
<div class="relative">
<span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
<input class="w-full pl-2xl pr-sm py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" id="password" name="password" placeholder="••••••••" required type="password"/>
</div>
</div>
<!-- Remember Me -->
<div class="flex items-center">
<input class="w-4 h-4 text-primary bg-white border-outline-variant rounded focus:ring-primary focus:ring-2" id="remember" name="remember" type="checkbox"/>
<label class="ml-sm font-body-sm text-body-sm text-on-surface-variant cursor-pointer" for="remember">Ghi nhớ đăng nhập</label>
</div>
<!-- Submit Button -->
<button class="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-md rounded-lg shadow-sm hover:bg-on-primary-fixed-variant hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-sm" type="submit">
                        Đăng nhập
                        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</form>
<!-- Divider -->
<div class="flex items-center my-lg">
<div class="flex-grow border-t border-outline-variant/50"></div>
<span class="px-md font-body-sm text-body-sm text-outline">Hoặc</span>
<div class="flex-grow border-t border-outline-variant/50"></div>
</div>
<!-- Social Login -->
<div class="space-y-sm">
<button class="w-full flex items-center justify-center gap-md bg-white border border-outline-variant py-sm rounded-lg hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface shadow-sm">
<img class="w-5 h-5 object-contain" data-alt="A clean, minimalist vector illustration of the Google 'G' logo icon, isolated on a transparent background, suitable for a modern UI light-mode login screen button. High resolution, crisp edges, recognizable brand colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGrDZf-KdENalvu4c714nGkZPF2t0v1-BAeC3Rmkbu5KUhYqWC7CLO6f5uSwA7M8hlq7yHLAYED8RXRJzI0_bseYQfLuw_JRfsPaNh-w5k3nYzMFKiCNbie_yXcGmDR-3xX80Pwjj7FQjI0ncrqx4iACUNUVKWiBn7cU1hQfzt2zqvLSwMNuJ3nAuifm3PAWb5_an4O-CwUdega7Yd6P_JIc6RR56xuMB2RiK6859IfSyb7pu3VA"/>
                        Tiếp tục với Google
                    </button>
<button class="w-full flex items-center justify-center gap-md bg-white border border-outline-variant py-sm rounded-lg hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface shadow-sm">
<img class="w-5 h-5 object-contain" data-alt="A clean, minimalist vector illustration of the GitHub Octocat logo icon in dark gray or black, isolated on a transparent background, suitable for a modern UI light-mode login screen button. High resolution, crisp edges." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0RJ4opuYX3fkhBJ9UiacRjFh95DNKfdrtibbg540CAEq9KWc17-3DX9Y702t2Z5LldnaPs0LTAnVxYvuNTkaY-cZEa8eUJZPZZioRlFaGVBuRuNE4kMtGQ36PF19uiPiCsqaaveg3hc8KitR2Nu_mVVC6eups-QId5giQ5nWFPuH9iDHDSkDl2MstMebdCdSkOp3nuZNgIvyoDIsECOGaQm-QsWFlu_OksPl15qJiX_ujVvha3A"/>
                        Tiếp tục với Github
                    </button>
</div>
<!-- Register Link -->
<p class="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                    Chưa có tài khoản? 
                    <a class="text-primary font-bold hover:underline" href="#">Đăng ký ngay</a>
</p>
</div>
</div>
<!-- Footer info -->
<div class="mt-lg text-center">
<p class="font-body-sm text-body-sm text-outline">
                Bằng việc đăng nhập, bạn đồng ý với <a class="text-primary hover:underline" href="#">Điều khoản dịch vụ</a> và <a class="text-primary hover:underline" href="#">Chính sách bảo mật</a> của chúng tôi.
            </p>
</div>
</div>
`;

let reactCode = rawHtml.replace(/class=/g, 'className=');
reactCode = reactCode.replace(/<!--(.*?)-->/g, ''); 

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

export default function LoginPage() {
    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center bg-grid-pattern p-md sm:p-lg pt-24 relative overflow-hidden">
            ${reactCode}
        </div>
    );
}
`;

fs.mkdirSync('src/app/login', { recursive: true });
fs.writeFileSync('src/app/login/page.tsx', pageContent);
console.log('Login page generated');
