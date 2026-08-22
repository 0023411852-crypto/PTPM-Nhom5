"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Giả lập API gửi email khôi phục
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    return (
        <div className="bg-background text-on-background w-full min-h-screen flex flex-col items-center justify-center bg-grid-pattern p-[16px] sm:p-[24px] pt-24 relative overflow-hidden">
            
            <div className="w-full max-w-[448px]">

                <div className="flex justify-center mb-[24px]">
                    <img alt="CloudNova Logo" className="w-[48px] h-[48px] object-contain rounded-xl shadow-sm bg-white p-2 border border-outline-variant" src="https://lh3.googleusercontent.com/aida/AP1WRLtXpLDCeAkzHKEgrwo4KPsZwWLDhm6abHZmi0-63wgmcnnWA1PmhjYqXGDhDI6g3xWscRm1KZJJLeTAH840G6Ux4ZyqagCFWyQ1uDksYzXkG8xFGx2lESwNOYECwW184tV1FBAHNTlrK3PBQ9nWkxTLX1_5WLj6Z24ycfOruijLeA1yAkbcJZFokdebB9Ilgg8x2F4baW8kY36UwLCEIfCwS9-HK5K-kcvW6RMQi7MXoUE-JYvp9rdz"/>
                </div>

                <div className="glass-panel rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-[32px] relative overflow-hidden">
                    
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-[32px]">
                            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-[8px]">
                                Quên mật khẩu?
                            </h1>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
                            </p>
                        </div>
                        
                        {success ? (
                            <div className="text-center space-y-[24px]">
                                <div className="w-16 h-16 bg-primary-container/20 text-primary mx-auto rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                                </div>
                                <div>
                                    <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Đã gửi liên kết!</h3>
                                    <p className="font-body-sm text-on-surface-variant">
                                        Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
                                    </p>
                                </div>
                                <Link href="/login" className="block w-full bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase py-[16px] rounded-lg shadow-sm hover:bg-surface-container transition-all active:scale-[0.98]">
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        ) : (
                            <form className="space-y-[24px]" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-[8px] uppercase" htmlFor="email">Email đã đăng ký</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-[8px] top-1/2 -translate-y-1/2 text-outline">mail</span>
                                        <input className="w-full pl-[48px] pr-[8px] py-[8px] bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" id="email" name="email" placeholder="name@company.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                    </div>
                                </div>

                                <button className="w-full bg-primary text-on-primary font-label-caps text-label-caps uppercase py-[16px] rounded-lg shadow-sm hover:bg-on-primary-fixed-variant hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-[8px] disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading || !email}>
                                    {loading ? "Đang xử lý..." : "Gửi liên kết khôi phục"}
                                </button>
                            </form>
                        )}
                        
                        {!success && (
                            <p className="mt-[32px] text-center font-body-sm text-body-sm text-on-surface-variant">
                                Quay lại <Link className="text-primary font-bold hover:underline" href="/login">Đăng nhập</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
