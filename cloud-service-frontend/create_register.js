const fs = require('fs');

const rawHtml = `
<!-- Ambient Background Gradients -->
<div class="absolute inset-0 bg-grid-pattern z-0"></div>
<div class="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-20 blur-[120px] pointer-events-none z-0"></div>
<div class="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-tertiary-container opacity-15 blur-[100px] pointer-events-none z-0"></div>
<!-- Registration Card Container -->
<div class="w-full max-w-[480px] p-gutter relative z-10">
<!-- Logo Area -->
<div class="flex flex-col items-center mb-xl">
<img alt="CloudNova Logo" class="w-16 h-16 rounded-xl shadow-sm mb-md object-cover bg-white p-2 border border-outline-variant" src="https://lh3.googleusercontent.com/aida/AP1WRLtXpLDCeAkzHKEgrwo4KPsZwWLDhm6abHZmi0-63wgmcnnWA1PmhjYqXGDhDI6g3xWscRm1KZJJLeTAH840G6Ux4ZyqagCFWyQ1uDksYzXkG8xFGx2lESwNOYECwW184tV1FBAHNTlrK3PBQ9nWkxTLX1_5WLj6Z24ycfOruijLeA1yAkbcJZFokdebB9Ilgg8x2F4baW8kY36UwLCEIfCwS9-HK5K-kcvW6RMQi7MXoUE-JYvp9rdz"/>
<h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center">Tạo tài khoản mới</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-sm text-center">Trải nghiệm nền tảng hạ tầng đám mây cao cấp</p>
</div>
<!-- Glass Form Card -->
<div class="glass-panel rounded-xl p-lg md:p-xl">
<form action="#" class="space-y-lg" method="POST">
<!-- Họ và tên -->
<div class="space-y-xs">
<label class="block font-label-caps text-label-caps text-on-surface" for="fullname">Họ và tên</label>
<div class="relative input-glow rounded-lg transition-all duration-200">
<div class="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-[20px]">person</span>
</div>
<input class="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none" id="fullname" name="fullname" placeholder="Nguyễn Văn A" required type="text"/>
</div>
</div>
<!-- Email -->
<div class="space-y-xs">
<label class="block font-label-caps text-label-caps text-on-surface" for="email">Email</label>
<div class="relative input-glow rounded-lg transition-all duration-200">
<div class="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-[20px]">mail</span>
</div>
<input class="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none" id="email" name="email" placeholder="developer@example.com" required type="email"/>
</div>
</div>
<!-- Mật khẩu -->
<div class="space-y-xs">
<label class="block font-label-caps text-label-caps text-on-surface" for="password">Mật khẩu</label>
<div class="relative input-glow rounded-lg transition-all duration-200">
<div class="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-[20px]">lock</span>
</div>
<input class="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none font-code-md text-code-md tracking-widest" id="password" name="password" placeholder="••••••••" required type="password"/>
</div>
</div>
<!-- Xác nhận Mật khẩu -->
<div class="space-y-xs">
<label class="block font-label-caps text-label-caps text-on-surface" for="confirm_password">Xác nhận mật khẩu</label>
<div class="relative input-glow rounded-lg transition-all duration-200">
<div class="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-[20px]">lock_reset</span>
</div>
<input class="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none font-code-md text-code-md tracking-widest" id="confirm_password" name="confirm_password" placeholder="••••••••" required type="password"/>
</div>
</div>
<!-- Terms Checkbox -->
<div class="flex items-start">
<div class="flex items-center h-5">
<input class="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary focus:ring-2 focus:ring-offset-2" id="terms" name="terms" required type="checkbox"/>
</div>
<div class="ml-3 text-sm">
<label class="font-body-sm text-body-sm text-on-surface-variant" for="terms">Tôi đồng ý với <a class="text-primary hover:text-on-primary-fixed-variant hover:underline font-semibold transition-colors" href="#">Điều khoản dịch vụ</a> và <a class="text-primary hover:text-on-primary-fixed-variant hover:underline font-semibold transition-colors" href="#">Chính sách bảo mật</a>.</label>
</div>
</div>
<!-- Submit Button -->
<button class="w-full flex justify-center py-md px-lg border border-transparent rounded-lg shadow-sm font-label-caps text-label-caps text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98]" type="submit">
                    Đăng ký
                </button>
</form>
<!-- Divider -->
<div class="mt-lg relative">
<div aria-hidden="true" class="absolute inset-0 flex items-center">
<div class="w-full border-t border-outline-variant"></div>
</div>
<div class="relative flex justify-center">
<span class="px-sm bg-surface-container-lowest text-outline font-label-caps text-label-caps bg-opacity-80 backdrop-blur-sm rounded-full">Hoặc đăng ký bằng</span>
</div>
</div>
<!-- Social Logins -->
<div class="mt-lg grid grid-cols-1 sm:grid-cols-2 gap-md">
<button class="flex items-center justify-center w-full px-md py-sm border border-outline-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-caps text-label-caps text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="button">
<img alt="Google" class="w-5 h-5 mr-sm object-contain" data-alt="Google logo minimalist icon in modern flat style against clean white background, high resolution UI asset, crisp edges, enterprise software interface aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXHQ_CeBSW1QKfmOsX9dclSpuXV-1V9Z2Ao9b3DQrsYJGJ4MG2lqa1e7IeSeX7dRhSZLzYlpEjVNW5eA2SQKVQSR6SRTo7zXgs8Yc5NnI2xRUA7kcA8CutcrPGn0oWa1CIR49SHbTnuvCiccKDIVdwayzMYD1SbV2593KnZySjR1dT69OZym6JNWqGuQCehQ6k1jYRGtKFL8fhOkQrZGhvRSNYDxW0FUps-9YsBt7eIRK9vw5aRQ"/>
                    Google
                </button>
<button class="flex items-center justify-center w-full px-md py-sm border border-outline-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-caps text-label-caps text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="button">
<img alt="GitHub" class="w-5 h-5 mr-sm object-contain" data-alt="GitHub octocat logo minimalist monochrome icon in modern flat style against clean white background, high resolution UI asset, developer tools interface aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiomVlzL1xL9w85r_Ukh6ms4nuhN2SarySQSUUo1hsFfpRnpP0hdfk2_akH4WxInxtzRewJRuP9yRChfJ-oQEUHbDzxYaRfqh4YbypCz5uz-MdUinp5qjPuXon7d5lLUN_u7Is8VcX-JmnKLRbPbfD6rvg9qwf0qVWSghIzzYBZAFYnZPgDpgW7ZydgjZfH2ikiC_3cvkpvAwt8bPVHo_p0nDPjZMrOd45lQBMpmu_MXLA0t7IQw"/>
                    GitHub
                </button>
</div>
</div>
<!-- Login Link -->
<p class="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
            Đã có tài khoản? <Link class="font-semibold text-primary hover:text-on-primary-fixed-variant hover:underline transition-colors" href="/login">Đăng nhập</Link>
</p>
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

export default function RegisterPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body-md text-on-surface pt-24">
            ${reactCode}
        </div>
    );
}
`;

fs.mkdirSync('src/app/register', { recursive: true });
fs.writeFileSync('src/app/register/page.tsx', pageContent);
console.log('Register page generated');
