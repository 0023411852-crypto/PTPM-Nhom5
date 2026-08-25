"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type OrderDetail = {
    id: string;
    servicePlanName: string;
    servicePlanDescription: string;
    servicePlanSpecifications: string;
    categoryName: string;
    billingCycle: number;
    price: number;
    setupFee: number;
    totalAmount: number;
    status: string;
    orderDate: string;
    customerNotes?: string | null;
    promotionCode?: string | null;
    discountPercentage?: number | null;
};

function parseOrderSpecifications(value: string) {
    try {
        const parsed = JSON.parse(value || '{}');
        return Object.entries(parsed).filter(([, item]) => item !== null && item !== undefined && item !== '');
    } catch {
        return [];
    }
}

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState<'services' | 'orders' | 'support' | 'profile'>('services');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    
    // Cart state
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Services state
    const [services, setServices] = useState<any[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
    const [orderDetailError, setOrderDetailError] = useState('');

    // Tickets state
    const [tickets, setTickets] = useState<any[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    
    // New Ticket state
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketDesc, setTicketDesc] = useState('');
    const [newTicketType, setNewTicketType] = useState('Technical');
    const [newTicketPriority, setNewTicketPriority] = useState('Normal');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Review state
    const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = "/login";
            return;
        }
        setToken(storedToken);
        
        try {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(Array.isArray(storedCart) ? storedCart : []);
        } catch {
            setCartItems([]);
        }
        
        fetchProfile(storedToken);
        fetchServices(storedToken);
        fetchTickets(storedToken);
        fetchOrders(storedToken);
    }, []);

    const fetchProfile = async (tokenStr: string) => {
        try {
            const res = await fetch("/api/Users/me", {
                headers: { "Authorization": `Bearer ${tokenStr}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFullName(data.fullName || '');
                setEmail(data.email || '');
                setAvatarUrl(data.avatarUrl || '');
                localStorage.setItem("fullName", data.fullName || '');
                localStorage.setItem("avatarUrl", data.avatarUrl || '');
                window.dispatchEvent(new Event('profileUpdated'));
            }
        } catch (e) {
            console.error("Lỗi khi tải thông tin cá nhân", e);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        if (!token) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ hỗ trợ ảnh JPG, PNG, GIF hoặc WEBP.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh quá lớn. Vui lòng chọn file dưới 5MB.');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/Upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || !data.url) {
                throw new Error(data.message || 'Tải ảnh thất bại.');
            }

            const fullUrl = data.url.startsWith('http') ? data.url : `${data.url}`;
            setAvatarUrl(fullUrl);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Tải ảnh thất bại.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsUpdatingProfile(true);
        try {
            const res = await fetch("/api/Users/me/profile", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ fullName, email, avatarUrl: avatarUrl || null })
            });

            if (res.ok) {
                alert("Cập nhật thông tin thành công!");
                fetchProfile(token); // Reload data and update local storage
            } else {
                const error = await res.json();
                alert(error.message || "Cập nhật thất bại.");
            }
        } catch (e) {
            alert("Lỗi kết nối.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const fetchOrders = async (tokenStr: string) => {
        setLoadingOrders(true);
        try {
            const res = await fetch("/api/Orders/my-orders?PageNumber=1&PageSize=50", {
                headers: { "Authorization": `Bearer ${tokenStr}` }
            });
            const data = await res.json();
            if (res.ok) setOrders(data.data || []);
        } catch (e) {
            console.error("Lỗi khi tải lịch sử đơn hàng", e);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleViewOrderDetail = async (orderId: string) => {
        if (!token) return;
        setLoadingOrderDetail(true);
        setOrderDetailError('');
        try {
            const res = await fetch(`/api/Orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message || 'Không thể tải chi tiết đơn hàng.');
            setSelectedOrder(data);
        } catch (error) {
            setOrderDetailError(error instanceof Error ? error.message : 'Không thể tải chi tiết đơn hàng.');
        } finally {
            setLoadingOrderDetail(false);
        }
    };

    const fetchServices = async (tokenStr: string) => {
        setLoadingServices(true);
        try {
            const res = await fetch("/api/CustomerServices/my-services?PageNumber=1&PageSize=50", {
                headers: { "Authorization": `Bearer ${tokenStr}` }
            });
            const data = await res.json();
            if (res.ok) setServices(data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingServices(false);
        }
    };

    const fetchTickets = async (tokenStr: string) => {
        setLoadingTickets(true);
        try {
            const res = await fetch("/api/SupportTickets/my-tickets?PageNumber=1&PageSize=50", {
                headers: { "Authorization": `Bearer ${tokenStr}` }
            });
            const data = await res.json();
            if (res.ok) setTickets(data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const res = await fetch("/api/SupportTickets", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ title: ticketTitle, description: ticketDesc })
            });

            if (res.ok) {
                alert("Gửi yêu cầu hỗ trợ thành công!");
                setTicketTitle('');
                setTicketDesc('');
                setIsCreatingTicket(false);
                fetchTickets(token); // reload
            }
        } catch (e) {
            alert("Lỗi khi gửi yêu cầu.");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        if (!token) return;

        try {
            const res = await fetch('/api/Users/me/password', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Đổi mật khẩu thành công!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.message || 'Lỗi khi đổi mật khẩu.');
            }
        } catch (e) {
            alert('Lỗi kết nối.');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !reviewOrderId) return;
        
        setSubmittingReview(true);
        try {
            const res = await fetch('/api/Users/reviews', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    orderId: reviewOrderId,
                    rating: reviewRating,
                    content: reviewContent
                })
            });

            if (res.ok) {
                alert('Cảm ơn bạn đã gửi đánh giá!');
                setReviewOrderId(null);
                setReviewRating(5);
                setReviewContent('');
                fetchOrders(token);
            } else {
                const data = await res.json();
                alert(data.message || 'Lỗi khi gửi đánh giá.');
            }
        } catch (e) {
            alert('Lỗi kết nối.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (!token) return <div className="text-center p-2xl">Đang chuyển hướng...</div>;

    return (
        <main className="flex-grow pt-24 pb-3xl bg-surface-container-lowest min-h-screen">
            <div className="max-w-container-max mx-auto px-gutter">
                
                <div className="mb-xl flex items-center justify-between">
                    <div>
                        <h1 className="font-display-md text-display-md text-on-background mb-sm">Trang Quản trị Khách hàng</h1>
                        <p className="text-on-surface-variant">Xin chào, {fullName}! Chào mừng bạn quay lại.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-xl">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface rounded-2xl border border-outline-variant p-md shadow-sm space-y-sm">
                            <button 
                                onClick={() => setActiveTab('services')}
                                className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-colors ${activeTab === 'services' ? 'bg-primary-container text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                Giỏ hàng & Quản lý dịch vụ
                            </button>
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary-container text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                Lịch sử đơn hàng
                            </button>
                            <button 
                                onClick={() => setActiveTab('support')}
                                className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-colors ${activeTab === 'support' ? 'bg-primary-container text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                                Hỗ trợ kỹ thuật
                            </button>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-primary-container text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Hồ sơ cá nhân
                            </button>
                            
                            <div className="border-t border-outline-variant my-md"></div>
                            
                            <Link href="/login" onClick={() => localStorage.clear()} className="w-full flex items-center gap-md px-md py-sm rounded-xl text-error hover:bg-error-container/50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Đăng xuất
                            </Link>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        
                        {/* Tab Dịch vụ */}
                        {activeTab === 'services' && (
                            <div className="space-y-xl">
                                {/* Giỏ hàng Section */}
                                <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Giỏ hàng của bạn</h2>
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-lg text-on-surface-variant">Giỏ hàng đang trống.</div>
                                    ) : (
                                        <div className="space-y-md">
                                            {cartItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center border border-outline-variant rounded-xl p-md">
                                                    <div>
                                                        <h3 className="font-headline-sm text-on-surface">{item.planName}</h3>
                                                        <p className="text-sm text-on-surface-variant">Chu kỳ: {item.cycle === 'yearly' ? '12 tháng' : '1 tháng'} | SL: {item.qty}</p>
                                                    </div>
                                                    <div className="font-headline-sm text-primary">
                                                        {(item.price * (item.cycle === 'yearly' ? 12 : 1) * item.qty).toLocaleString('vi-VN')}đ
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-end mt-md">
                                                <Link href="/checkout" className="px-xl py-md bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors inline-flex items-center gap-2">
                                                    Thanh toán ngay <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quản lý Dịch vụ Section */}
                                <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">VPS Đang hoạt động</h2>
                                
                                {loadingServices ? (
                                    <div className="text-center py-xl text-secondary">Đang tải dữ liệu...</div>
                                ) : services.length === 0 ? (
                                    <div className="text-center py-2xl">
                                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                                            <span className="material-symbols-outlined text-[32px] text-secondary">cloud_off</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-md">Bạn chưa có dịch vụ nào đang hoạt động. Hãy mua một gói dịch vụ để bắt đầu.</p>
                                        <Link href="/pricing" className="inline-block px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">Mua ngay VPS</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-md">
                                        {services.map(svc => (
                                            <div key={svc.id} className="border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row gap-lg justify-between items-start md:items-center hover:border-primary transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-sm mb-xs">
                                                        <h3 className="font-headline-md text-headline-md text-on-surface">{svc.serviceName}</h3>
                                                        <span className="bg-success/10 text-success font-label-sm px-2 py-1 rounded-full uppercase text-[12px] font-bold">{svc.status}</span>
                                                    </div>
                                                    <p className="text-[14px] text-on-surface-variant mb-md">Hết hạn: {new Date(svc.expiryDate).toLocaleDateString('vi-VN')}</p>
                                                    
                                                    <div className="flex flex-wrap gap-md">
                                                        <div className="bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded flex gap-sm items-center text-[13px]">
                                                            <span className="text-secondary font-medium">IP:</span> 
                                                            <span className="font-code-sm">{svc.vpsIP || 'Đang cấp phát...'}</span>
                                                        </div>
                                                        <div className="bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded flex gap-sm items-center text-[13px]">
                                                            <span className="text-secondary font-medium">User:</span> 
                                                            <span className="font-code-sm">{svc.vpsUser || 'Đang cấp phát...'}</span>
                                                        </div>
                                                        <div className="bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded flex gap-sm items-center text-[13px]">
                                                            <span className="text-secondary font-medium">Pass:</span> 
                                                            <span className="font-code-sm">{svc.vpsPassword || '***'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {svc.vpsIP === '203.0.113.10' ? (
                                                    <span className="px-md py-sm bg-warning/10 text-warning font-medium rounded-lg whitespace-nowrap">
                                                        VPS demo
                                                    </span>
                                                ) : (
                                                    <button onClick={() => window.open(`http://${svc.vpsIP}`, '_blank')} className="px-md py-sm bg-surface-container text-primary font-medium rounded-lg hover:bg-surface-variant transition-colors whitespace-nowrap">
                                                        Truy cập Control Panel
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            </div>
                        )}

                        {/* Tab Lịch sử đơn hàng */}
                        {activeTab === 'orders' && (
                            <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Lịch sử đơn hàng</h2>
                                
                                {loadingOrders ? (
                                    <div className="text-center py-xl text-secondary">Đang tải dữ liệu...</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-2xl">
                                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                                            <span className="material-symbols-outlined text-[32px] text-secondary">receipt_long</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-md">Bạn chưa có đơn hàng nào.</p>
                                        <Link href="/pricing" className="inline-block px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">Mua ngay VPS</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-md">
                                        {orders.map(order => (
                                            <div key={order.id} className="border border-outline-variant rounded-xl p-lg flex flex-col md:flex-row gap-lg justify-between items-start md:items-center hover:border-primary transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-sm mb-xs">
                                                        <h3 className="font-headline-md text-headline-md text-on-surface">Đơn hàng #{order.id.substring(0, 8)}</h3>
                                                        {order.status === 'Pending' && <span className="bg-warning/10 text-warning font-label-sm px-2 py-1 rounded-full uppercase text-[12px] font-bold">Chờ thanh toán</span>}
                                                        {order.status === 'Completed' && <span className="bg-success/10 text-success font-label-sm px-2 py-1 rounded-full uppercase text-[12px] font-bold">Hoàn thành</span>}
                                                        {order.status === 'Cancelled' && <span className="bg-error/10 text-error font-label-sm px-2 py-1 rounded-full uppercase text-[12px] font-bold">Đã huỷ</span>}
                                                    </div>
                                                    <p className="text-[14px] text-on-surface-variant mb-md">Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')} • Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ</p>
                                                    {order.customerNotes && <p className="text-[13px] text-error mt-1 italic">{order.customerNotes}</p>}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewOrderDetail(order.id)}
                                                        disabled={loadingOrderDetail}
                                                        className="px-md py-sm border border-primary text-primary font-medium rounded-lg hover:bg-primary-container transition-colors text-center whitespace-nowrap disabled:opacity-60"
                                                    >
                                                        {loadingOrderDetail ? 'Đang tải...' : 'Xem chi tiết'}
                                                    </button>
                                                    {order.status === 'Pending' && (
                                                        <Link href={`/checkout?orderId=${order.id}`} className="px-md py-sm bg-primary text-on-primary font-medium rounded-lg hover:bg-primary-container transition-colors text-center whitespace-nowrap">
                                                            Thanh toán ngay
                                                        </Link>
                                                    )}
                                                    {order.status === 'Completed' && !order.isReviewed && (
                                                        <button 
                                                            onClick={() => setReviewOrderId(order.id)}
                                                            className="px-md py-sm bg-surface-container text-primary font-medium rounded-lg hover:bg-surface-variant transition-colors whitespace-nowrap"
                                                        >
                                                            Đánh giá ngay
                                                        </button>
                                                    )}
                                                    {order.status === 'Completed' && order.isReviewed && (
                                                        <button 
                                                            disabled
                                                            className="px-md py-sm bg-surface-container-low text-on-surface-variant font-medium rounded-lg cursor-not-allowed whitespace-nowrap"
                                                        >
                                                            Đã đánh giá
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Hỗ trợ */}
                        {activeTab === 'support' && (
                            <div className="space-y-xl">
                                <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-lg">
                                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Ticket Hỗ Trợ</h2>
                                        <button 
                                            onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                                            className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors flex items-center gap-xs text-[14px]"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{isCreatingTicket ? 'close' : 'add'}</span>
                                            {isCreatingTicket ? 'Hủy' : 'Tạo Ticket mới'}
                                        </button>
                                    </div>

                                    {isCreatingTicket && (
                                        <form onSubmit={handleCreateTicket} className="mb-xl bg-surface-container-lowest p-lg rounded-xl border border-primary">
                                            <div className="mb-md">
                                                <label className="block text-[14px] text-on-surface-variant mb-1">Tiêu đề lỗi *</label>
                                                <input 
                                                    type="text" required
                                                    value={ticketTitle} onChange={e => setTicketTitle(e.target.value)}
                                                    placeholder="VD: Không thể kết nối SSH tới máy chủ" 
                                                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none" 
                                                />
                                            </div>
                                            <div className="mb-md">
                                                <label className="block text-[14px] text-on-surface-variant mb-1">Mô tả chi tiết *</label>
                                                <textarea 
                                                    rows={4} required
                                                    value={ticketDesc} onChange={e => setTicketDesc(e.target.value)}
                                                    placeholder="Mô tả lỗi bạn đang gặp phải..." 
                                                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none resize-none" 
                                                />
                                            </div>
                                            <button type="submit" className="px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">
                                                Gửi Yêu Cầu
                                            </button>
                                        </form>
                                    )}

                                    {loadingTickets ? (
                                        <div className="text-center py-xl text-secondary">Đang tải danh sách...</div>
                                    ) : tickets.length === 0 ? (
                                        <div className="text-center py-xl border border-dashed border-outline-variant rounded-xl">
                                            <p className="text-on-surface-variant">Bạn chưa tạo yêu cầu hỗ trợ nào.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-sm">
                                            {tickets.map(ticket => (
                                                <div key={ticket.id} className="border border-outline-variant rounded-xl p-md hover:bg-surface-container-lowest transition-colors cursor-pointer">
                                                    <div className="flex justify-between mb-sm">
                                                        <h4 className="font-medium text-on-surface text-[16px]">{ticket.title}</h4>
                                                        <span className={`px-2 py-1 rounded text-[12px] font-bold uppercase ${ticket.status === 'Open' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                                                            {ticket.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[14px] text-on-surface-variant line-clamp-1">{ticket.description}</p>
                                                    <div className="text-[12px] text-secondary mt-2">
                                                        Tạo lúc: {new Date(ticket.createdAt).toLocaleString('vi-VN')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Tab Hồ sơ */}
                        {activeTab === 'profile' && (
                            <div className="space-y-xl">
                                <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Thông tin cơ bản</h2>
                                <form onSubmit={handleUpdateProfile} className="space-y-md">
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Ảnh đại diện</label>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            disabled={isUploadingAvatar || isUpdatingProfile}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) void handleAvatarUpload(file);
                                                e.currentTarget.value = '';
                                            }}
                                            className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-white"
                                        />
                                        <p className="text-xs text-secondary mt-1">JPG, PNG, GIF hoặc WEBP, tối đa 5MB.</p>
                                        {isUploadingAvatar && <p className="text-sm text-primary mt-2">Đang tải ảnh lên...</p>}
                                        {avatarUrl && (
                                            <div className="mt-2">
                                                <img 
                                                    src={avatarUrl} 
                                                    alt="Avatar Preview" 
                                                    className="w-16 h-16 rounded-full object-cover border border-outline-variant" 
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null;
                                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random`;
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Họ và tên</label>
                                        <input 
                                            type="text" 
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none" 
                                        />
                                    </div>
                                    <button disabled={isUpdatingProfile} className="bg-primary text-on-primary px-lg py-sm rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-70">
                                        {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </form>
                            </div>

                                <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Đổi mật khẩu</h3>
                                    <form onSubmit={handlePasswordChange} className="space-y-md mt-md">
                                        <div>
                                            <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Mật khẩu hiện tại</label>
                                            <div className="relative">
                                                <input 
                                                    type={showCurrentPassword ? "text" : "password"} 
                                                    value={oldPassword}
                                                    onChange={e => setOldPassword(e.target.value)}
                                                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                                    placeholder="••••••••" 
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                            <div>
                                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Mật khẩu mới</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showNewPassword ? "text" : "password"} 
                                                        value={newPassword}
                                                        onChange={e => setNewPassword(e.target.value)}
                                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                                        placeholder="••••••••" 
                                                        required minLength={6}
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Xác nhận mật khẩu mới</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showConfirmPassword ? "text" : "password"} 
                                                        value={confirmPassword}
                                                        onChange={e => setConfirmPassword(e.target.value)}
                                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                                        placeholder="••••••••" 
                                                        required minLength={6}
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-sm border-t border-outline-variant mt-lg">
                                            <button type="submit" className="px-lg py-sm border border-outline-variant text-on-surface rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-container-low transition-colors flex items-center gap-sm">
                                                Đổi mật khẩu
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface shadow-xl">
                        <div className="flex items-center justify-between border-b border-outline-variant p-xl">
                            <div>
                                <p className="font-label-caps text-label-caps uppercase tracking-wider text-primary">Chi tiết đơn hàng</p>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">#{selectedOrder.id.substring(0, 8)}</h2>
                            </div>
                            <button type="button" onClick={() => { setSelectedOrder(null); setOrderDetailError(''); }} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-[24px]">close</span></button>
                        </div>
                        <div className="space-y-lg overflow-y-auto p-xl">
                            {orderDetailError && <p className="rounded-lg bg-error-container/20 p-md text-error">{orderDetailError}</p>}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                                <div className="space-y-lg">
                                    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
                                        <div className="mb-sm flex items-center justify-between gap-md"><h3 className="font-headline-sm text-headline-sm text-on-surface">{selectedOrder.servicePlanName || 'Gói dịch vụ'}</h3><span className="rounded-full bg-primary-container px-sm py-xs text-sm font-semibold text-primary">{selectedOrder.categoryName || 'Dịch vụ'}</span></div>
                                        <p className="text-sm text-on-surface-variant">{selectedOrder.servicePlanDescription || 'Không có mô tả.'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                                        {parseOrderSpecifications(selectedOrder.servicePlanSpecifications).map(([key, value]) => (
                                            <div key={key} className="rounded-lg border border-outline-variant p-md">
                                                <p className="text-xs uppercase tracking-wide text-on-surface-variant">{key}</p>
                                                <p className="mt-1 font-semibold text-on-surface">{String(value)}</p>
                                            </div>
                                        ))}
                                        <div className="rounded-lg border border-outline-variant p-md">
                                            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Chu kỳ thanh toán</p>
                                            <p className="mt-1 font-semibold text-on-surface">{selectedOrder.billingCycle ? `${selectedOrder.billingCycle} tháng` : '—'}</p>
                                        </div>
                                        <div className="rounded-lg border border-outline-variant p-md">
                                            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Trạng thái</p>
                                            <p className="mt-1 font-semibold text-primary">{selectedOrder.status}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-lg flex flex-col">
                                    <div className="space-y-sm rounded-xl border border-outline-variant p-lg text-sm bg-surface-container-lowest flex-grow flex flex-col">
                                        <h4 className="font-semibold text-base mb-2 border-b border-outline-variant pb-2">Thanh toán</h4>
                                        <div className="flex justify-between gap-md"><span className="text-on-surface-variant">Ngày đặt</span><strong>{new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</strong></div>
                                        <div className="flex justify-between gap-md"><span className="text-on-surface-variant">Giá gói</span><strong>{selectedOrder.price.toLocaleString('vi-VN')}đ</strong></div>
                                        <div className="flex justify-between gap-md"><span className="text-on-surface-variant">Phí khởi tạo</span><strong>{selectedOrder.setupFee.toLocaleString('vi-VN')}đ</strong></div>
                                        {selectedOrder.promotionCode && <div className="flex justify-between gap-md"><span className="text-on-surface-variant">Mã khuyến mãi</span><strong>{selectedOrder.promotionCode}{selectedOrder.discountPercentage ? ` (-${selectedOrder.discountPercentage}%)` : ''}</strong></div>}
                                        <div className="flex justify-between gap-md border-t border-outline-variant pt-sm mt-auto text-base"><span className="font-semibold">Tổng tiền</span><strong className="text-primary text-lg">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</strong></div>
                                    </div>
                                    {selectedOrder.customerNotes && <div className="rounded-lg bg-surface-container-low p-md text-sm mt-4"><strong>Ghi chú của bạn:</strong> {selectedOrder.customerNotes}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-outline-variant p-xl flex justify-end">
                            <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-lg bg-primary px-xl py-sm font-medium text-on-primary hover:bg-primary-container transition-colors">Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-xl border-b border-outline-variant flex justify-between items-center">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">Đánh giá đơn hàng #{reviewOrderId.substring(0, 8)}</h2>
                            <button onClick={() => setReviewOrderId(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                <span className="material-symbols-outlined text-[24px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview} className="p-xl overflow-y-auto">
                            <div className="space-y-md">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-2">Đánh giá của bạn</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button 
                                                key={star} 
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className={`text-[32px] material-symbols-outlined ${star <= reviewRating ? 'text-[#FFB800] star-filled' : 'text-outline-variant'}`}
                                            >
                                                {star <= reviewRating ? 'star' : 'star_border'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Nội dung đánh giá</label>
                                    <textarea 
                                        value={reviewContent}
                                        onChange={e => setReviewContent(e.target.value)}
                                        rows={4} 
                                        className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary outline-none resize-none" 
                                        placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-xl flex justify-end gap-md">
                                <button type="button" onClick={() => setReviewOrderId(null)} className="px-lg py-sm text-on-surface-variant hover:bg-surface-container rounded-lg font-medium transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" disabled={submittingReview} className="px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-70">
                                    {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
