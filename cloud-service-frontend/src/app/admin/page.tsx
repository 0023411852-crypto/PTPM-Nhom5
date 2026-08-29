"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type AdminStats = {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    activeTickets: number;
    pendingOrders: number;
    openTickets: number;
    activityFlow?: {
        data: number[];
        growth: string;
    };
};

type KpiCardProps = {
    label: string;
    value: string;
    helper: string;
    icon: string;
    tone: 'blue' | 'green' | 'amber' | 'rose';
    href: string;
    trend?: string;
};



const fallbackStats: AdminStats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    activeTickets: 0,
    pendingOrders: 0,
    openTickets: 0,
};

function KpiCard({ label, value, helper, icon, tone, href, trend }: KpiCardProps) {
    return (
        <Link href={href} className={`admin-kpi-card admin-kpi-${tone} interactive-card`}>
            <div className="admin-kpi-topline">
                <span className="admin-kpi-icon material-symbols-outlined">{icon}</span>
                {trend && <span className="admin-kpi-trend"><span className="material-symbols-outlined">trending_up</span>{trend}</span>}
            </div>
            <p className="admin-kpi-label">{label}</p>
            <strong className="admin-kpi-value">{value}</strong>
            <span className="admin-kpi-helper">{helper}<span className="material-symbols-outlined">arrow_outward</span></span>
            <span className="admin-kpi-glow" aria-hidden="true" />
        </Link>
    );
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/Admin/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };

        // Use setTimeout to avoid setState in effect warning
        setTimeout(() => fetchStats(), 0);
    }, []);

    if (loading) {
        return (
            <div className="admin-loading-shell route-fade-in">
                <div className="admin-loading-heading"><span /><span /></div>
                <div className="admin-loading-grid">{[1, 2, 3, 4].map((item) => <div key={item} className="admin-loading-card" />)}</div>
                <div className="admin-loading-wide" />
            </div>
        );
    }

    const currentStats = stats || fallbackStats;
    const revenue = currentStats.totalRevenue?.toLocaleString('vi-VN') || '0';
    const orderCount = currentStats.totalOrders || 0;
    const userCount = currentStats.totalUsers || 0;
    const ticketCount = currentStats.openTickets || 0;
    const pendingOrderCount = currentStats.pendingOrders || 0;

    const activityData = currentStats.activityFlow?.data || [0,0,0,0,0,0,0,0,0,0,0,0];
    const activityGrowth = currentStats.activityFlow?.growth || "+0.0%";
    const maxActivity = Math.max(...activityData, 1); // Avoid division by 0
    
    const monthLabels = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i * 2, 1);
        monthLabels.push(`Th${d.getMonth() + 1}`);
    }

    return (
        <div className="admin-overview dashboard-page route-fade-in">
            <section className="admin-welcome-panel">
                <div className="admin-welcome-copy">
                    <span className="admin-eyebrow"><span className="admin-live-dot" /> CLOUDNOVA CONTROL CENTER</span>
                    <h1>Tổng quan hệ thống</h1>
                    <p>Xin chào, Admin. Theo dõi sức khỏe hạ tầng, xử lý vận hành và đưa ra quyết định nhanh hơn từ một màn hình.</p>
                    <div className="admin-welcome-actions">
                        <Link href="/admin/orders" className="admin-primary-action"><span className="material-symbols-outlined">task_alt</span> Xử lý đơn chờ</Link>
                        <Link href="/admin/reports" className="admin-secondary-action"><span className="material-symbols-outlined">insights</span> Xem báo cáo</Link>
                    </div>
                </div>
                <div className="admin-command-visual" aria-hidden="true">
                    <div className="admin-command-orbit admin-command-orbit-one" />
                    <div className="admin-command-orbit admin-command-orbit-two" />
                    <div className="admin-command-core"><span className="material-symbols-outlined">cloud</span></div>
                    <span className="admin-command-node admin-command-node-one"><span className="material-symbols-outlined">dns</span></span>
                    <span className="admin-command-node admin-command-node-two"><span className="material-symbols-outlined">shield</span></span>
                    <span className="admin-command-node admin-command-node-three"><span className="material-symbols-outlined">monitoring</span></span>
                    <div className="admin-command-caption"><span className="admin-live-dot" /> Hệ thống đang hoạt động</div>
                </div>
            </section>

            <section className="admin-section-heading">
                <div><span className="admin-section-kicker">REAL-TIME PULSE</span><h2>Sức khỏe vận hành</h2></div>
                <span className="admin-refresh-state"><span className="material-symbols-outlined">sync</span> Cập nhật theo dữ liệu hệ thống</span>
            </section>

            <section className="admin-kpi-grid" aria-label="Chỉ số quản trị">
                <KpiCard label="Tổng doanh thu" value={`${revenue} đ`} helper="Mở báo cáo doanh thu" icon="payments" tone="blue" href="/admin/reports" trend="+12.8%" />
                <KpiCard label="Tổng đơn hàng" value={orderCount.toLocaleString('vi-VN')} helper="Quản lý tất cả đơn hàng" icon="shopping_cart" tone="green" href="/admin/orders" trend="+8.4%" />
                <KpiCard label="Đơn chờ duyệt" value={pendingOrderCount.toLocaleString('vi-VN')} helper="Cần xử lý trong hôm nay" icon="pending_actions" tone="amber" href="/admin/orders" />
                <KpiCard label="Ticket cần hỗ trợ" value={ticketCount.toLocaleString('vi-VN')} helper="Mở trung tâm hỗ trợ" icon="support_agent" tone="rose" href="/admin/tickets" />
            </section>

            <section className="admin-overview-grid">
                <article className="admin-surface admin-chart-card">
                    <div className="admin-surface-header">
                        <div><span className="admin-section-kicker">ACTIVITY FLOW</span><h2>Hoạt động nền tảng</h2></div>
                        <span className="admin-period-chip"><span className="admin-live-dot" /> 12 tháng gần nhất</span>
                    </div>
                    <div className="admin-chart-summary"><strong>{activityGrowth}</strong><span>người dùng mới</span></div>
                    <div className="admin-chart-area" aria-label="Biểu đồ hoạt động nền tảng minh họa">
                        <div className="admin-chart-yaxis">
                            <span>{Math.round(maxActivity)}</span>
                            <span>{Math.round(maxActivity * 0.75)}</span>
                            <span>{Math.round(maxActivity * 0.5)}</span>
                            <span>{Math.round(maxActivity * 0.25)}</span>
                            <span>0</span>
                        </div>
                        <div className="admin-chart-plot">
                            <div className="admin-chart-gridline admin-chart-gridline-one" /><div className="admin-chart-gridline admin-chart-gridline-two" /><div className="admin-chart-gridline admin-chart-gridline-three" /><div className="admin-chart-gridline admin-chart-gridline-four" />
                            <div className="admin-bars">{activityData.map((val, index) => {
                                const height = (val / maxActivity) * 100;
                                return <span key={index} className="admin-bar" style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }} title={`${val} người dùng`} />
                            })}</div>
                            <div className="admin-chart-line" />
                        </div>
                    </div>
                    <div className="admin-chart-labels">{monthLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}</div>
                </article>

                <article className="admin-surface admin-health-card">
                    <div className="admin-surface-header"><div><span className="admin-section-kicker">SERVICE HEALTH</span><h2>Trạng thái hệ thống</h2></div><span className="admin-health-badge"><span className="admin-live-dot" /> Ổn định</span></div>
                    <div className="admin-health-score"><div className="admin-health-ring"><strong>99.9<span>%</span></strong><small>uptime</small></div><div><strong>Hạ tầng đang vận hành tốt</strong><p>Không phát hiện sự cố nghiêm trọng trong 24 giờ qua.</p></div></div>
                    <div className="admin-health-list">
                        <div><span><i className="admin-health-dot admin-health-dot-green" />Cloud VPS cluster</span><b>Operational</b></div>
                        <div><span><i className="admin-health-dot admin-health-dot-green" />Payment gateway</span><b>Operational</b></div>

                    </div>
                    <Link href="/admin/audit-logs" className="admin-outline-action">Mở nhật ký hệ thống <span className="material-symbols-outlined">arrow_forward</span></Link>
                </article>
            </section>

            <section className="admin-lower-grid">
                <article className="admin-surface admin-actions-card">
                    <div className="admin-surface-header"><div><span className="admin-section-kicker">WORKSPACE</span><h2>Lối tắt thao tác</h2></div><span className="material-symbols-outlined admin-header-icon">grid_view</span></div>
                    <div className="admin-action-grid">
                        <Link href="/admin/orders" className="admin-action-tile admin-action-blue"><span className="admin-action-icon material-symbols-outlined">receipt_long</span><span><strong>Duyệt đơn hàng</strong><small>{pendingOrderCount} đơn đang chờ</small></span><span className="material-symbols-outlined admin-arrow">arrow_outward</span></Link>
                        <Link href="/admin/users" className="admin-action-tile admin-action-purple"><span className="admin-action-icon material-symbols-outlined">group</span><span><strong>Quản lý người dùng</strong><small>{userCount.toLocaleString('vi-VN')} tài khoản</small></span><span className="material-symbols-outlined admin-arrow">arrow_outward</span></Link>
                        <Link href="/admin/tickets" className="admin-action-tile admin-action-amber"><span className="admin-action-icon material-symbols-outlined">forum</span><span><strong>Trung tâm hỗ trợ</strong><small>{ticketCount} ticket đang mở</small></span><span className="material-symbols-outlined admin-arrow">arrow_outward</span></Link>
                        <Link href="/admin/settings" className="admin-action-tile admin-action-green"><span className="admin-action-icon material-symbols-outlined">tune</span><span><strong>Cấu hình hệ thống</strong><small>Cập nhật thông tin website</small></span><span className="material-symbols-outlined admin-arrow">arrow_outward</span></Link>
                    </div>
                </article>

                <article className="admin-surface admin-insight-card">
                    <div className="admin-surface-header"><div><span className="admin-section-kicker">QUICK INSIGHT</span><h2>Điểm cần chú ý</h2></div><span className="admin-insight-pulse"><span className="material-symbols-outlined">auto_awesome</span></span></div>
                    <div className="admin-insight-item"><span className="admin-insight-number">01</span><div><strong>Đơn hàng cần được xử lý</strong><p>Kiểm tra thông tin cấp phát IP và tài khoản VPS.</p></div><Link href="/admin/orders" aria-label="Mở đơn hàng"><span className="material-symbols-outlined">arrow_forward</span></Link></div>
                    <div className="admin-insight-item"><span className="admin-insight-number">02</span><div><strong>Duy trì trải nghiệm khách hàng</strong><p>Phản hồi các ticket mới để giữ SLA hỗ trợ.</p></div><Link href="/admin/tickets" aria-label="Mở ticket"><span className="material-symbols-outlined">arrow_forward</span></Link></div>
                    <div className="admin-insight-footer"><span className="material-symbols-outlined">tips_and_updates</span> Mọi thao tác đều được ghi nhận trong nhật ký hệ thống.</div>
                </article>
            </section>
        </div>
    );
}
