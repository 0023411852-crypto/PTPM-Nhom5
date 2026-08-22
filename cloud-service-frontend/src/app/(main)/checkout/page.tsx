"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
    planId: string;
    planName: string;
    priceId: string;
    price: number;
    cycle: string;
    qty: number;
}

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [customerNotes, setCustomerNotes] = useState('');
    const [qrCodeData, setQrCodeData] = useState<{qrCode: string, paymentString: string} | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);

        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const subtotal = cart.reduce((acc, item) => {
        const months = item.cycle === 'yearly' ? 12 : 1;
        return acc + (item.price * months * item.qty);
    }, 0);

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

    const fetchQRCode = async (orderId: string, amount: number) => {
        try {
            const res = await fetch(`http://localhost:5154/api/Orders/${orderId}/payment-qr?amount=${amount}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                setQrCodeData(data);
            } else {
                console.error("Lỗi khi lấy mã QR:", res.status);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (cart.length === 0) {
            setErrorMsg("Giỏ hàng của bạn đang trống.");
            return;
        }

        if (!token) {
            setErrorMsg("Bạn phải đăng nhập để thực hiện thanh toán.");
            return;
        }

        setIsSubmitting(true);
        
        try {
            let firstOrderId = "";
            // Gửi từng đơn hàng trong giỏ
            for (let i = 0; i < cart.length; i++) {
                const item = cart[i];
                for (let q = 0; q < item.qty; q++) {
                    const res = await fetch("http://localhost:5154/api/Orders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            servicePlanId: item.planId,
                            planPriceId: item.priceId,
                            customerNotes: customerNotes,
                            promotionId: null 
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (firstOrderId === "") firstOrderId = data.id;
                    }
                }
            }

            if (firstOrderId) {
                // Fetch 1 mã QR dùng chung tổng tiền
                await fetchQRCode(firstOrderId, total * 1.1); // Cộng VAT
                setIsSuccess(true);
                // Clear cart
                setCart([]);
                localStorage.setItem("cart", "[]");
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                setErrorMsg("Tạo đơn hàng thất bại.");
            }
        } catch (err) {
            setErrorMsg("Lỗi kết nối đến máy chủ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    if (!token) {
        return (
            <div className="pt-32 pb-2xl min-h-screen px-gutter">
                <div className="max-w-[768px] mx-auto bg-surface rounded-2xl shadow-sm border border-outline-variant p-2xl text-center">
                    <div className="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-lg">
                        <span className="material-symbols-outlined text-[40px]">lock</span>
                    </div>
                    <h1 className="font-display-sm text-display-sm text-on-surface mb-sm">Yêu cầu Đăng nhập</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
                        Để đảm bảo an toàn và quản lý dịch vụ tốt nhất, bạn cần đăng nhập trước khi xem giỏ hàng và thanh toán.
                    </p>
                    <div className="flex gap-md justify-center">
                        <Link href="/login" className="px-lg py-md bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">Đăng nhập ngay</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="pt-32 pb-2xl min-h-screen px-gutter">
                <div className="max-w-[768px] mx-auto bg-surface rounded-2xl shadow-sm border border-outline-variant p-2xl text-center">
                    <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-lg">
                        <span className="material-symbols-outlined text-[40px]">check_circle</span>
                    </div>
                    <h1 className="font-display-sm text-display-sm text-on-surface mb-sm">Đặt hàng thành công!</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
                        Vui lòng quét mã QR dưới đây để thanh toán tổng đơn hàng. Chúng tôi sẽ duyệt toàn bộ dịch vụ ngay khi nhận được thanh toán.
                    </p>
                    
                    {qrCodeData && (
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg inline-block mb-xl mx-auto">
                            <img src={`data:image/png;base64,${qrCodeData.qrCode}`} alt="Payment QR" className="w-64 h-64 object-contain mx-auto mb-md" />
                            <div className="text-left bg-surface-container p-md rounded-lg">
                                <p className="text-[14px] text-on-surface-variant">Ngân hàng: <strong className="text-on-surface">Vietcombank</strong></p>
                                <p className="text-[14px] text-on-surface-variant">Số TK: <strong className="text-on-surface">0123456789</strong></p>
                                <p className="text-[14px] text-on-surface-variant">Chủ TK: <strong className="text-on-surface">CONG TY CLOUDNOVA</strong></p>
                                <p className="text-[14px] text-on-surface-variant">Nội dung: <strong className="text-on-surface break-all">{qrCodeData.paymentString}</strong></p>
                                <p className="text-[14px] text-error mt-2">Tổng tiền (đã gồm VAT): <strong className="text-error">{formatCurrency(total * 1.1)}</strong></p>
                            </div>
                        </div>
                    )}
                    <div>
                        <Link href="/client" className="px-lg py-md bg-surface text-primary border border-primary rounded-lg font-medium hover:bg-surface-variant transition-colors">Vào trang Quản lý</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-grow pt-24 pb-3xl bg-surface-container-lowest min-h-screen">
            <div className="max-w-container-max mx-auto px-gutter">
                <div className="mb-xl">
                    <Link href="/pricing" className="inline-flex items-center gap-xs font-label-caps text-label-caps text-primary hover:text-primary-fixed-variant transition-colors mb-sm">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Tiếp tục chọn gói
                    </Link>
                    <h1 className="font-display-md text-display-md text-on-background">Giỏ hàng của bạn</h1>
                </div>

                {errorMsg && (
                    <div className="mb-lg p-md bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm flex items-center gap-sm">
                        <span className="material-symbols-outlined">error</span>
                        {errorMsg}
                    </div>
                )}

                {cart.length === 0 ? (
                    <div className="text-center py-2xl bg-surface rounded-2xl border border-outline-variant">
                        <span className="material-symbols-outlined text-[64px] text-outline mb-md">shopping_cart</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Giỏ hàng trống</h2>
                        <p className="text-on-surface-variant mb-lg">Bạn chưa thêm dịch vụ nào vào giỏ hàng.</p>
                        <Link href="/pricing" className="inline-block px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container">Xem Bảng giá</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
                        {/* Cột Chi tiết Giỏ hàng */}
                        <div className="lg:col-span-2 space-y-md">
                            <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
                                <div className="p-lg border-b border-outline-variant bg-surface-container-lowest">
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Danh sách dịch vụ ({cart.length})</h2>
                                </div>
                                <div className="divide-y divide-outline-variant">
                                    {cart.map((item, index) => {
                                        const months = item.cycle === 'yearly' ? 12 : 1;
                                        return (
                                            <div key={index} className="p-lg flex flex-col md:flex-row gap-md justify-between items-start md:items-center hover:bg-surface-container-lowest transition-colors">
                                                <div>
                                                    <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">{item.planName}</h3>
                                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Chu kỳ: {item.cycle === 'yearly' ? '1 Năm' : '1 Tháng'}</p>
                                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Số lượng: {item.qty}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="font-headline-sm text-headline-sm text-on-background">
                                                        {formatCurrency(item.price * months * item.qty)}
                                                    </div>
                                                    <button onClick={() => removeFromCart(index)} className="text-error font-body-sm flex items-center gap-1 hover:underline">
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Ghi chú đơn hàng</h2>
                                <textarea 
                                    className="w-full h-24 px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow resize-none"
                                    placeholder="Ví dụ: Cài sẵn WordPress giúp mình, Hệ điều hành Ubuntu 22.04..."
                                    value={customerNotes}
                                    onChange={(e) => setCustomerNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Cột Tóm tắt thanh toán */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm sticky top-24">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Tổng hóa đơn</h2>
                                
                                <div className="space-y-sm mb-lg">
                                    <div className="flex justify-between items-center text-on-surface-variant">
                                        <span>Tạm tính ({cart.length} dịch vụ)</span>
                                        <span className="font-medium text-on-background">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-on-surface-variant">
                                        <span>Phí cài đặt ban đầu</span>
                                        <span className="font-medium text-on-background">Miễn phí</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-error">
                                            <span>Giảm giá</span>
                                            <span className="font-medium">-{formatCurrency(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-outline-variant pt-md mb-lg">
                                    <div className="flex justify-between items-center mb-xs">
                                        <span className="font-headline-sm text-headline-sm text-on-surface">Tổng cộng</span>
                                        <span className="font-display-sm text-display-sm text-primary">{formatCurrency(total)}</span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant text-right">Chưa bao gồm 10% VAT</p>
                                </div>
                                
                                <div className="border-t border-outline-variant pt-md mb-lg">
                                    <div className="flex justify-between items-center mb-xs">
                                        <span className="font-headline-sm text-headline-sm text-on-surface">Thanh toán (Gồm VAT)</span>
                                        <span className="font-display-sm text-display-sm text-error">{formatCurrency(total * 1.1)}</span>
                                    </div>
                                </div>

                                <form className="flex gap-sm mb-xl" onSubmit={(e) => { e.preventDefault(); handleApplyPromo(); }}>
                                    <input 
                                        type="text" 
                                        placeholder="Mã giảm giá (WELCOME20)" 
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-grow h-11 px-4 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow uppercase"
                                    />
                                    <button type="submit" className="h-11 px-4 bg-surface-container text-on-surface font-medium rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant">
                                        Áp dụng
                                    </button>
                                </form>

                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center gap-sm bg-primary text-on-primary font-label-caps text-label-caps uppercase py-4 rounded-xl shadow-sm hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Tiến hành Thanh toán'}
                                    {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
                                </button>
                                
                                <p className="font-body-sm text-body-sm text-outline mt-md text-center">
                                    Bằng việc thanh toán, bạn đồng ý với Điều khoản và Chính sách của chúng tôi.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
