"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const router = require('next/navigation').useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5154/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, fullName: fullname }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
                router.push('/login');
            } else {
                setError(data.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-background w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-body-md text-on-surface pt-24">
            

<div className="absolute inset-0 bg-grid-pattern z-0"></div>
<div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container opacity-20 blur-[120px] pointer-events-none z-0"></div>
<div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-tertiary-container opacity-15 blur-[100px] pointer-events-none z-0"></div>

<div className="w-full max-w-[480px] p-gutter relative z-10">

<div className="flex flex-col items-center mb-xl">
<div className="w-16 h-16 flex items-center justify-center rounded-xl shadow-sm mb-md bg-primary text-white border border-outline-variant">
    <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
</div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background text-center">Tạo tài khoản mới</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-sm text-center">Trải nghiệm nền tảng hạ tầng đám mây cao cấp</p>
</div>

{error && (
    <div className="mb-[24px] p-[12px] bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm text-center">
        {error}
    </div>
)}

<div className="glass-panel rounded-xl p-lg md:p-xl">
<form onSubmit={handleSubmit} className="space-y-lg">

<div className="space-y-xs">
<label className="block font-label-caps text-label-caps text-on-surface" htmlFor="fullname">Họ và tên</label>
<div className="relative input-glow rounded-lg transition-all duration-200">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[20px]">person</span>
</div>
<input className="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none" id="fullname" name="fullname" placeholder="Nguyễn Văn A" required type="text" value={fullname} onChange={(e) => setFullname(e.target.value)}/>
</div>
</div>

<div className="space-y-xs">
<label className="block font-label-caps text-label-caps text-on-surface" htmlFor="email">Email</label>
<div className="relative input-glow rounded-lg transition-all duration-200">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[20px]">mail</span>
</div>
<input className="block w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none" id="email" name="email" placeholder="developer@example.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
</div>
</div>

<div className="space-y-xs">
<label className="block font-label-caps text-label-caps text-on-surface" htmlFor="password">Mật khẩu</label>
<div className="relative input-glow rounded-lg transition-all duration-200">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[20px]">lock</span>
</div>
<input className="block w-full pl-[40px] pr-[40px] py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none font-code-md text-code-md tracking-widest" id="password" name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer">
    <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>

<div className="space-y-xs">
<label className="block font-label-caps text-label-caps text-on-surface" htmlFor="confirm_password">Xác nhận mật khẩu</label>
<div className="relative input-glow rounded-lg transition-all duration-200">
<div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline text-[20px]">lock_reset</span>
</div>
<input className="block w-full pl-[40px] pr-[40px] py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none font-code-md text-code-md tracking-widest" id="confirm_password" name="confirm_password" placeholder="••••••••" required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer">
    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>

<div className="flex items-start">
<div className="flex items-center h-5">
<input className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary focus:ring-2 focus:ring-offset-2" id="terms" name="terms" required type="checkbox"/>
</div>
<div className="ml-3 text-sm">
<label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">Tôi đồng ý với <a className="text-primary hover:text-on-primary-fixed-variant hover:underline font-semibold transition-colors" href="#">Điều khoản dịch vụ</a> và <a className="text-primary hover:text-on-primary-fixed-variant hover:underline font-semibold transition-colors" href="#">Chính sách bảo mật</a>.</label>
</div>
</div>

<button className="w-full flex justify-center py-md px-lg border border-transparent rounded-lg shadow-sm font-label-caps text-label-caps text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
</form>

<div className="mt-lg relative">
<div aria-hidden="true" className="absolute inset-0 flex items-center">
<div className="w-full border-t border-outline-variant"></div>
</div>
<div className="relative flex justify-center">
<span className="px-sm bg-surface-container-lowest text-outline font-label-caps text-label-caps bg-opacity-80 backdrop-blur-sm rounded-full">Hoặc đăng ký bằng</span>
</div>
</div>

<div className="mt-lg grid grid-cols-1 sm:grid-cols-2 gap-md">
<button className="flex items-center justify-center w-full px-md py-sm border border-outline-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-caps text-label-caps text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="button">
<svg className="w-[24px] h-[24px] mr-sm" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
                    Google
                </button>
<button className="flex items-center justify-center w-full px-md py-sm border border-outline-variant rounded-lg shadow-sm bg-surface-container-lowest font-label-caps text-label-caps text-on-surface hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="button">
<svg className="w-[24px] h-[24px] mr-sm" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
</svg>
                    GitHub
                </button>
</div>
</div>

<p className="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
            Đã có tài khoản? <Link className="font-semibold text-primary hover:text-on-primary-fixed-variant hover:underline transition-colors" href="/login">Đăng nhập</Link>
</p>
</div>

        </div>
    );
}
