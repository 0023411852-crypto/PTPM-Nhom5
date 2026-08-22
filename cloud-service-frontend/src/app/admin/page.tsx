"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5154/api/Admin/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-2xl">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-xl">
            <h1 className="font-display-sm text-display-sm text-on-surface">Tổng quan hệ thống</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                    <div className="flex justify-between items-start mb-md">
                        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
                        </div>
                    </div>
                    <p className="text-on-surface-variant text-[14px] font-medium mb-1">Tổng Doanh thu</p>
                    <h3 className="font-display-sm text-display-sm text-on-surface">
                        {stats?.totalRevenue?.toLocaleString('vi-VN')} đ
                    </h3>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                    <div className="flex justify-between items-start mb-md">
                        <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-success text-[24px]">shopping_cart</span>
                        </div>
                    </div>
                    <p className="text-on-surface-variant text-[14px] font-medium mb-1">Tổng Đơn hàng</p>
                    <h3 className="font-display-sm text-display-sm text-on-surface">{stats?.totalOrders || 0}</h3>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                    <div className="flex justify-between items-start mb-md">
                        <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-warning text-[24px]">pending_actions</span>
                        </div>
                    </div>
                    <p className="text-on-surface-variant text-[14px] font-medium mb-1">Đơn chờ duyệt</p>
                    <h3 className="font-display-sm text-display-sm text-on-surface">{stats?.pendingOrders || 0}</h3>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                    <div className="flex justify-between items-start mb-md">
                        <div className="w-12 h-12 rounded-xl bg-error/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-error text-[24px]">support_agent</span>
                        </div>
                    </div>
                    <p className="text-on-surface-variant text-[14px] font-medium mb-1">Ticket cần hỗ trợ</p>
                    <h3 className="font-display-sm text-display-sm text-on-surface">{stats?.openTickets || 0}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <div className="bg-surface rounded-2xl border border-outline-variant p-lg shadow-sm">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Lối tắt thao tác</h2>
                    <div className="space-y-sm">
                        <Link href="/admin/orders" className="flex items-center gap-md p-md rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant">
                            <span className="material-symbols-outlined text-secondary">receipt_long</span>
                            <div>
                                <h4 className="font-medium text-on-surface">Duyệt Đơn hàng mới</h4>
                                <p className="text-[14px] text-on-surface-variant">Cấp phát IP, Tài khoản cho VPS</p>
                            </div>
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-md p-md rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant">
                            <span className="material-symbols-outlined text-secondary">group</span>
                            <div>
                                <h4 className="font-medium text-on-surface">Quản lý Người dùng</h4>
                                <p className="text-[14px] text-on-surface-variant">Khóa/Mở khóa, Phân quyền Admin</p>
                            </div>
                        </Link>
                        <Link href="/admin/tickets" className="flex items-center gap-md p-md rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant">
                            <span className="material-symbols-outlined text-secondary">forum</span>
                            <div>
                                <h4 className="font-medium text-on-surface">Trả lời Hỗ trợ (Tickets)</h4>
                                <p className="text-[14px] text-on-surface-variant">Hỗ trợ kỹ thuật cho Khách hàng</p>
                            </div>
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-md p-md rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant">
                            <span className="material-symbols-outlined text-secondary">settings</span>
                            <div>
                                <h4 className="font-medium text-on-surface">Cấu hình Website</h4>
                                <p className="text-[14px] text-on-surface-variant">Sửa Tên, Slogan, Link liên hệ</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
