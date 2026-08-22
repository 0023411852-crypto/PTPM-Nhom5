"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Promotion = {
    id: string;
    title: string;
    badgeText: string;
    description: string;
    category: string;
    isFeatured: boolean;
    startDate: string;
    endDate?: string;
    isActive: boolean;
};

export default function EditorPromotionsPage() {
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPromotions = async () => {
        try {
            const res = await fetch('http://localhost:5154/api/Promotions?PageNumber=1&PageSize=50');
            if (res.ok) {
                const data = await res.json();
                setPromotions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) return;
        
        try {
            const res = await fetch(`http://localhost:5154/api/Promotions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                fetchPromotions();
            } else {
                alert('Có lỗi xảy ra khi xóa.');
            }
        } catch (error) {
            console.error('Lỗi mạng khi xóa:', error);
        }
    };

    const isRunning = (promotion: Promotion) => {
        if (!promotion.isActive) return false;
        const now = new Date();
        const end = promotion.endDate ? new Date(promotion.endDate) : null;
        if (end && now > end) return false;
        return true;
    };

    const getGradientByCategory = (cat: string) => {
        switch (cat) {
            case 'Cloud': return 'from-blue-600 to-indigo-600';
            case 'Hosting': return 'from-teal-500 to-emerald-500';
            case 'Domain': return 'from-amber-500 to-orange-500';
            case 'Email': return 'from-purple-500 to-fuchsia-500';
            default: return 'from-slate-600 to-slate-800';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Khuyến mãi & Banner</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý các chương trình ưu đãi, mã giảm giá và banner quảng cáo trên web.</p>
                </div>
                <Link href={`${basePath}/promotions/create`} className="bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto">
                    <span className="material-symbols-outlined">add</span>
                    Tạo chiến dịch
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-on-surface-variant">Đang tải...</div>
            ) : promotions.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">Chưa có khuyến mãi nào.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                    {promotions.map(promo => {
                        const running = isRunning(promo);
                        return (
                            <div key={promo.id} className={`bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden group ${!running ? 'opacity-60' : ''}`}>
                                <div className={`h-[120px] relative overflow-hidden flex items-center justify-center ${running ? `bg-gradient-to-r ${getGradientByCategory(promo.category)}` : 'bg-surface-container-high'}`}>
                                    <span className={`font-headline-lg font-bold relative z-10 text-[28px] ${running ? 'text-white' : 'text-on-surface-variant'}`}>{promo.badgeText}</span>
                                    {running ? (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white font-label-caps text-[10px] uppercase">Đang chạy</div>
                                    ) : (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-surface-container-highest rounded text-on-surface-variant font-label-caps text-[10px] uppercase">Đã kết thúc</div>
                                    )}
                                    {promo.isFeatured && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-error text-white rounded font-label-caps text-[10px] uppercase shadow-sm">HOT DEAL</div>
                                    )}
                                </div>
                                <div className="p-md flex flex-col h-[180px]">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface line-clamp-1">{promo.title}</h3>
                                        <span className="font-label-caps text-[10px] border border-outline-variant px-1 rounded text-on-surface-variant">{promo.category}</span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-2 flex-grow">{promo.description}</p>
                                    <div className="flex items-center justify-between pt-sm border-t border-outline-variant mt-auto">
                                        <span className="font-body-sm text-on-surface-variant text-[12px]">
                                            {promo.endDate ? (
                                                <><span className="material-symbols-outlined text-[14px] align-middle mr-1">history</span>Kết thúc: {new Date(promo.endDate).toLocaleDateString('vi-VN')}</>
                                            ) : (
                                                <><span className="material-symbols-outlined text-[14px] align-middle mr-1">all_inclusive</span>Không giới hạn</>
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Link href={`${basePath}/promotions/create?id=${promo.id}`} className="text-on-surface-variant hover:text-primary transition-colors tooltip" title="Sửa">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </Link>
                                            <button onClick={() => handleDelete(promo.id)} className="text-on-surface-variant hover:text-error transition-colors tooltip" title="Xóa">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
