"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClientPortalPage() {
    const [activeTab, setActiveTab] = useState<'services' | 'support' | 'profile'>('services');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');

    // Services state
    const [services, setServices] = useState<any[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    // Tickets state
    const [tickets, setTickets] = useState<any[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    
    // New Ticket state
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketDesc, setTicketDesc] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            window.location.href = '/login';
            return;
        }
        setToken(storedToken);
        setFullName(localStorage.getItem("fullName") || "Khách hàng");
        
        fetchServices(storedToken);
        fetchTickets(storedToken);
    }, []);

    const fetchServices = async (tokenStr: string) => {
        setLoadingServices(true);
        try {
            const res = await fetch("http://localhost:5154/api/CustomerServices/my-services?PageNumber=1&PageSize=50", {
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
            const res = await fetch("http://localhost:5154/api/SupportTickets/my-tickets?PageNumber=1&PageSize=50", {
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
            const res = await fetch("http://localhost:5154/api/SupportTickets", {
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
            const res = await fetch('http://localhost:5154/api/Users/me/password', {
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
                                <span className="material-symbols-outlined text-[20px]">dns</span>
                                Dịch vụ của tôi
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
                            <div className="bg-surface rounded-2xl border border-outline-variant p-xl shadow-sm">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">VPS Đang hoạt động</h2>
                                
                                {loadingServices ? (
                                    <div className="text-center py-xl text-secondary">Đang tải dữ liệu...</div>
                                ) : services.length === 0 ? (
                                    <div className="text-center py-2xl">
                                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                                            <span className="material-symbols-outlined text-[32px] text-secondary">cloud_off</span>
                                        </div>
                                        <p className="text-on-surface-variant mb-md">Bạn chưa có dịch vụ nào đang hoạt động hoặc đơn hàng đang chờ duyệt.</p>
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
                                                <button onClick={() => window.open(`http://${svc.vpsIP}`, '_blank')} className="px-md py-sm bg-surface-container text-primary font-medium rounded-lg hover:bg-surface-variant transition-colors whitespace-nowrap">
                                                    Truy cập Control Panel
                                                </button>
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
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Thông tin cá nhân</h2>
                                    <form className="space-y-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                            <div>
                                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Họ và tên</label>
                                                <input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" defaultValue={fullName} />
                                            </div>
                                            <div>
                                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Số điện thoại</label>
                                                <input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" placeholder="Chưa cập nhật" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-md">
                                            <button type="button" className="px-lg py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm">
                                                Lưu thay đổi
                                            </button>
                                        </div>
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
        </main>
    );
}
