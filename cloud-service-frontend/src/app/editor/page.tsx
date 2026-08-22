"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type TrendingArticle = {
    id: string;
    title: string;
    viewCount: number;
};

type DashboardStats = {
    totalViews: number;
    newArticlesCount: number;
    newTicketsCount: number;
    trendingArticles: TrendingArticle[];
};

export default function EditorDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalViews: 0,
        newArticlesCount: 0,
        newTicketsCount: 0,
        trendingArticles: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5154/api/Dashboard/editor-stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Tổng quan</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Xin chào, đây là hiệu suất nội dung của bạn trong tháng này.</p>
                </div>
                <Link href="/editor/articles/create" className="bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto">
                    <span className="material-symbols-outlined">edit_note</span>
                    Viết bài mới
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <div className="p-sm bg-primary-container/20 rounded-lg text-primary">
                            <span className="material-symbols-outlined">visibility</span>
                        </div>
                        <span className="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded uppercase">+0%</span>
                    </div>
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant">Tổng lượt xem</h3>
                    <p className="font-headline-md text-[28px] text-on-surface mt-xs font-semibold">
                        {isLoading ? '...' : formatNumber(stats.totalViews)}
                    </p>
                </div>

                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <div className="p-sm bg-secondary-container/30 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">article</span>
                        </div>
                        <span className="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded uppercase">+0</span>
                    </div>
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant">Bài viết mới</h3>
                    <p className="font-headline-md text-[28px] text-on-surface mt-xs font-semibold">
                        {isLoading ? '...' : stats.newArticlesCount}
                    </p>
                </div>

                <div className="bg-surface rounded-xl p-md border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-md">
                        <div className="p-sm bg-tertiary-container/30 rounded-lg text-tertiary">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <span className="font-label-caps text-label-caps text-tertiary-container bg-tertiary-container/10 px-unit py-[2px] rounded uppercase">+0</span>
                    </div>
                    <h3 className="font-body-sm text-body-sm text-on-surface-variant">Ticket hỗ trợ mới</h3>
                    <p className="font-headline-md text-[28px] text-on-surface mt-xs font-semibold">
                        {isLoading ? '...' : stats.newTicketsCount}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg flex flex-col min-h-[400px]">
                    <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-md">Lưu lượng truy cập nội dung</h3>
                    <div className="flex-1 border border-dashed border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant">
                        [Khu vực biểu đồ Area Chart hiển thị lượt xem theo ngày]
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg flex flex-col">
                    <div className="flex justify-between items-center mb-md">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">Bài viết thịnh hành</h3>
                        <Link href="/editor/articles" className="text-primary hover:text-primary-container font-body-sm font-medium">Xem tất cả</Link>
                    </div>
                    <div className="flex-1 flex flex-col gap-md">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-on-surface-variant">
                                Đang tải...
                            </div>
                        ) : stats.trendingArticles.length > 0 ? (
                            stats.trendingArticles.map((article, index) => (
                                <div key={article.id} className="flex items-center gap-md p-sm hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                                    <div className="font-headline-md text-outline font-bold text-[24px]">0{index + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-body-md font-medium text-on-surface truncate">{article.title}</p>
                                        <p className="font-body-sm text-on-surface-variant">{article.viewCount.toLocaleString()} lượt xem</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-on-surface-variant">
                                Chưa có bài viết nào
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
