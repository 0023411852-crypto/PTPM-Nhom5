"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CheckoutForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Đọc thông số từ URL
    const planName = searchParams.get('plan') || 'VPS STARTER';
    const priceStr = searchParams.get('price') || '99000';
    const cycle = searchParams.get('cycle') || 'monthly';
    const planId = searchParams.get('planId') || '';
    const priceId = searchParams.get('priceId') || '';
    
    const basePrice = parseInt(priceStr, 10);
    const months = cycle === 'yearly' ? 12 : 1;
    const subtotal = basePrice * months;

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Thông tin khách hàng auto-fill
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setToken(null);
        } else {
            setToken(storedToken);
            setFullName(localStorage.getItem("fullName") || "");
            setEmail(localStorage.getItem("email") || ""); // Giả sử login có trả về email
        }
    }, []);

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'WELCOME20') {
            setDiscount(subtotal * 0.2); // 20% off
            alert("Áp dụng mã thành công: Giảm 20%!");
        } else {
            setDiscount(0);
            alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        }
    };

    const total = subtotal - discount;

    const [qrCodeData, setQrCodeData] = useState<{qrCode: string, paymentString: string} | null>(null);

    const fetchQRCode = async (orderId: string, amount: number) => {
        try {
            const res = await fetch(`http://localhost:5154/api/Orders/${orderId}/payment-qr?amount=${amount}`);
            const data = await res.json();
            if (res.ok) setQrCodeData(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!planId || !priceId) {
            setErrorMsg("Dữ liệu gói dịch vụ không hợp lệ. Vui lòng chọn lại từ trang Bảng giá.");
            return;
        }

        if (!token) {
            setErrorMsg("Bạn phải đăng nhập để thực hiện thanh toán.");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const res = await fetch("http://localhost:5154/api/Orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    servicePlanId: planId,
                    planPriceId: priceId,
                    customerNotes: customerNotes,
                    promotionId: null 
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Fetch QR code
                await fetchQRCode(data.id, total * 1.1);
                setIsSuccess(true);
            } else {
                setErrorMsg(data.message || "Tạo đơn hàng thất bại.");
            }
        } catch (err) {
            setErrorMsg("Lỗi kết nối đến máy chủ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="max-w-[768px] mx-auto bg-surface rounded-2xl shadow-sm border border-outline-variant p-2xl text-center">
                <div className="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-lg">
                    <span className="material-symbols-outlined text-[40px]">lock</span>
                </div>
                <h1 className="font-display-sm text-display-sm text-on-surface mb-sm">Yêu cầu Đăng nhập</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
                    Để đảm bảo an toàn và quản lý dịch vụ tốt nhất, bạn cần đăng nhập trước khi thanh toán.
                </p>
                <div className="flex gap-md justify-center">
                    <Link href="/login" className="px-lg py-md bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">Đăng nhập ngay</Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="max-w-[768px] mx-auto bg-surface rounded-2xl shadow-sm border border-outline-variant p-2xl text-center">
                <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-lg">
                    <span className="material-symbols-outlined text-[40px]">check_circle</span>
                </div>
                <h1 className="font-display-sm text-display-sm text-on-surface mb-sm">Đặt hàng thành công!</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
                    Vui lòng quét mã QR dưới đây để thanh toán. Chúng tôi sẽ duyệt đơn hàng ngay khi nhận được thanh toán của bạn.
                </p>
                
                {qrCodeData && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg inline-block mb-xl mx-auto">
                        <img src={`data:image/png;base64,${qrCodeData.qrCode}`} alt="Payment QR" className="w-64 h-64 object-contain mx-auto mb-md" />
                        <div className="text-left bg-surface-container p-md rounded-lg">
                            <p className="text-[14px] text-on-surface-variant">Ngân hàng: <strong className="text-on-surface">Vietcombank</strong></p>
                            <p className="text-[14px] text-on-surface-variant">Số TK: <strong className="text-on-surface">0123456789</strong></p>
                            <p className="text-[14px] text-on-surface-variant">Chủ TK: <strong className="text-on-surface">CONG TY CLOUDNOVA</strong></p>
                            <p className="text-[14px] text-on-surface-variant mt-sm">Nội dung: <strong className="text-primary">{qrCodeData.paymentString}</strong></p>
                        </div>
                    </div>
                )}

                <div className="flex gap-md justify-center">
                    <Link href="/client" className="px-lg py-md bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">Tôi đã thanh toán (Vào Quản trị)</Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left Column: Billing Info */}
            <div className="lg:col-span-8 space-y-xl">
                {errorMsg && (
                    <div className="p-md bg-error-container text-on-error-container rounded-lg">
                        {errorMsg}
                    </div>
                )}
                <div className="bg-surface rounded-2xl border border-outline-variant p-lg md:p-xl shadow-sm">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-lg border-b border-outline-variant pb-md">Thông tin Khách hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg font-body-md">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-on-surface-variant mb-2">Họ và tên *</label>
                            <input type="text" readOnly value={fullName} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md outline-none text-on-surface-variant bg-slate-50 cursor-not-allowed" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-on-surface-variant mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                            <textarea 
                                rows={3} 
                                value={customerNotes}
                                onChange={(e) => setCustomerNotes(e.target.value)}
                                placeholder="VD: Yêu cầu cài đặt OS Ubuntu 22.04 đặc biệt..." 
                                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-lg md:p-xl shadow-sm">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-lg border-b border-outline-variant pb-md">Phương thức thanh toán</h2>
                    <div className="space-y-sm">
                        <label className="flex items-center gap-md p-md border border-primary bg-primary/5 rounded-xl cursor-pointer">
                            <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-primary" />
                            <div>
                                <p className="font-medium text-on-surface">Chuyển khoản Ngân hàng (Thủ công)</p>
                                <p className="text-[13px] text-on-surface-variant">Hệ thống sẽ duyệt đơn sau khi nhận được tiền.</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
                <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-lg sticky top-24">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Tóm tắt Đơn hàng</h3>
                    
                    <div className="flex justify-between items-start mb-md">
                        <div>
                            <p className="font-medium text-on-surface text-[18px]">{planName}</p>
                            <p className="text-[13px] text-on-surface-variant mt-1">Chu kỳ: {cycle === 'yearly' ? '1 Năm' : '1 Tháng'}</p>
                        </div>
                        <p className="font-code-md text-on-surface font-medium">{subtotal.toLocaleString('vi-VN')}đ</p>
                    </div>

                    <div className="border-t border-outline-variant border-dashed my-lg"></div>

                    <div className="mb-lg">
                        <label className="block text-[13px] text-on-surface-variant mb-2">Mã giảm giá</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Nhập mã (VD: WELCOME20)" 
                                className="w-full bg-surface border border-outline-variant rounded-lg px-sm py-2 text-[14px] focus:border-primary outline-none" 
                            />
                            <button 
                                type="button" 
                                onClick={handleApplyPromo}
                                className="px-md py-2 bg-secondary text-on-secondary rounded-lg font-medium text-[14px] hover:bg-secondary-container transition-colors whitespace-nowrap"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant border-dashed my-lg"></div>

                    <div className="space-y-sm mb-lg">
                        <div className="flex justify-between text-[14px]">
                            <span className="text-on-surface-variant">Tạm tính:</span>
                            <span className="text-on-surface font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[14px] text-primary">
                                <span>Giảm giá:</span>
                                <span>-{discount.toLocaleString('vi-VN')}đ</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[14px]">
                            <span className="text-on-surface-variant">VAT (10%):</span>
                            <span className="text-on-surface font-medium">{(total * 0.1).toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant my-lg"></div>
                    
                    <div className="flex justify-between items-center mb-xl">
                        <span className="font-medium text-on-surface">Tổng cộng</span>
                        <span className="font-display-sm text-[24px] font-bold text-primary">{(total * 1.1).toLocaleString('vi-VN')}đ</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary text-on-primary py-md rounded-xl font-medium text-[16px] hover:bg-primary-container transition-colors flex items-center justify-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                Đang xử lý...
                            </>
                        ) : (
                            'Hoàn tất Đặt hàng'
                        )}
                    </button>
                    <p className="text-[12px] text-center text-on-surface-variant mt-sm">
                        Bằng việc đặt hàng, bạn đồng ý với Điều khoản Dịch vụ của chúng tôi.
                    </p>
                </div>
            </div>
        </form>
    );
}

export default function CheckoutPage() {
    return (
        <main className="flex-grow pt-24 pb-3xl bg-surface-container-lowest min-h-screen">
            <div className="max-w-container-max mx-auto px-gutter">
                <div className="mb-xl">
                    <h1 className="font-display-md text-display-md text-on-background mb-unit">Thanh toán Đơn hàng</h1>
                    <p className="text-on-surface-variant">Hoàn tất thông tin bên dưới để khởi tạo dịch vụ của bạn.</p>
                </div>

                <Suspense fallback={<div className="text-center py-2xl">Đang tải giỏ hàng...</div>}>
                    <CheckoutForm />
                </Suspense>
            </div>
        </main>
    );
}
