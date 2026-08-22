"use client";

import React, { useState, useEffect } from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface ServiceBreakdown {
    name: string;
    percentage: number;
    colorClass: string;
}

interface RevenueReport {
    revenue: string;
    revenueGrowth: string;
    transactions: string;
    transactionsGrowth: string;
    aov: string;
    aovGrowth: string;
    newUsers: string;
    newUsersGrowth: string;
    barChartData: ChartData[];
    serviceBreakdown: ServiceBreakdown[];
}

const colorMap: Record<string, string> = {
    'bg-primary': 'var(--color-primary)',
    'bg-tertiary-container': 'var(--color-tertiary-container)',
    'bg-error-container': 'var(--color-error-container)',
    'bg-warning': 'var(--color-warning)'
};

export default function AdminReportsPage() {
    const [period, setPeriod] = useState('Tháng này');
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<RevenueReport | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5154/api/Admin/revenue-report?period=${encodeURIComponent(period)}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReport(data);
                }
            } catch (e) {
                console.error("Failed to fetch revenue report", e);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [period]);

    const handleExport = () => {
        alert(`Đang xuất báo cáo cho thời gian: ${period}...`);
    };

    if (loading || !report) {
        return (
            <div className="max-w-container-max mx-auto p-lg flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const maxChartVal = Math.max(...report.barChartData.map(d => d.value), 1);

    let gradientStr = "";
    let currentPerc = 0;
    report.serviceBreakdown.forEach((item, index) => {
        let start = currentPerc;
        let end = currentPerc + item.percentage;
        if (index === report.serviceBreakdown.length - 1) end = 100; // ensure fills up to 100
        let color = colorMap[item.colorClass] || 'var(--color-primary)';
        gradientStr += `${color} ${start}% ${end}%, `;
        currentPerc = end;
    });
    if (gradientStr) gradientStr = gradientStr.slice(0, -2);
    else gradientStr = 'var(--color-surface-variant) 0% 100%'; // fallback

    return (
        <div className="max-w-container-max mx-auto space-y-lg pb-xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Báo cáo doanh thu</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Thống kê và phân tích tài chính hệ thống</p>
                </div>
                <div className="flex gap-sm">
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-md py-sm bg-surface-container border border-outline-variant rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-variant transition-colors outline-none cursor-pointer text-on-surface"
                    >
                        <option>Tháng này</option>
                        <option>Quý này</option>
                        <option>Năm nay</option>
                    </select>
                    <button onClick={handleExport} className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <h3 className="font-body-sm text-body-sm text-on-surface-variant">Doanh thu thuần</h3>
                        <span className="material-symbols-outlined text-outline">payments</span>
                    </div>
                    <p className="font-headline-lg text-[28px] text-on-surface font-semibold">{report.revenue} đ</p>
                    <div className={`flex items-center gap-1 mt-2 font-body-sm text-body-sm ${report.revenueGrowth.startsWith('+') ? 'text-tertiary-container' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {report.revenueGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{report.revenueGrowth} so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <h3 className="font-body-sm text-body-sm text-on-surface-variant">Lượt giao dịch</h3>
                        <span className="material-symbols-outlined text-outline">receipt_long</span>
                    </div>
                    <p className="font-headline-lg text-[28px] text-on-surface font-semibold">{report.transactions}</p>
                    <div className={`flex items-center gap-1 mt-2 font-body-sm text-body-sm ${report.transactionsGrowth.startsWith('+') ? 'text-tertiary-container' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {report.transactionsGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{report.transactionsGrowth} so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <h3 className="font-body-sm text-body-sm text-on-surface-variant">Giá trị TB/Đơn (AOV)</h3>
                        <span className="material-symbols-outlined text-outline">analytics</span>
                    </div>
                    <p className="font-headline-lg text-[28px] text-on-surface font-semibold">{report.aov} đ</p>
                    <div className={`flex items-center gap-1 mt-2 font-body-sm text-body-sm ${report.aovGrowth.startsWith('+') ? 'text-tertiary-container' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {report.aovGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{report.aovGrowth} so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <h3 className="font-body-sm text-body-sm text-on-surface-variant">Khách hàng mới</h3>
                        <span className="material-symbols-outlined text-outline">person_add</span>
                    </div>
                    <p className="font-headline-lg text-[28px] text-on-surface font-semibold">{report.newUsers}</p>
                    <div className={`flex items-center gap-1 mt-2 font-body-sm text-body-sm ${report.newUsersGrowth.startsWith('+') ? 'text-tertiary-container' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                            {report.newUsersGrowth.startsWith('+') ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{report.newUsersGrowth} so với kỳ trước</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg min-h-[400px] flex flex-col">
                    <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-lg">Biểu đồ tăng trưởng</h3>
                    <div className="flex-1 flex items-end justify-between border-b border-outline-variant pt-8 pb-2">
                        {report.barChartData.map((data, index) => (
                            <div key={index} className="flex flex-col items-center justify-end h-full gap-2 group w-full">
                                <div className="w-12 bg-primary rounded-t-sm transition-all duration-500 ease-in-out group-hover:bg-primary-container relative" 
                                     style={{ height: `${(data.value / maxChartVal) * 100}%`, minHeight: '10px' }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[12px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        {data.value.toFixed(1)}M
                                    </div>
                                </div>
                                <span className="font-label-md text-label-md text-on-surface-variant shrink-0">{data.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg min-h-[400px] flex flex-col">
                    <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-lg">Tỷ trọng dịch vụ</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        {/* CSS Pie Chart */}
                        <div className="w-64 h-64 rounded-full relative shadow-sm" 
                             style={{ 
                                 background: `conic-gradient(${gradientStr})` 
                             }}>
                            {/* Inner circle for Donut effect */}
                            <div className="absolute inset-8 bg-surface rounded-full flex items-center justify-center flex-col shadow-inner">
                                <span className="font-headline-lg text-[24px] font-bold text-on-surface">{report.transactions}</span>
                                <span className="text-[12px] text-on-surface-variant">Tổng đơn</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-md flex justify-center gap-lg flex-wrap">
                        {report.serviceBreakdown.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.colorClass}`}></div>
                                <span className="text-sm">{item.name} ({item.percentage}%)</span>
                            </div>
                        ))}
                        {report.serviceBreakdown.length === 0 && (
                            <div className="text-on-surface-variant text-sm">Chưa có dữ liệu giao dịch</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
