"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function CreatePromotionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const id = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        badgeText: '',
        description: '',
        category: 'Cloud',
        isFeatured: false,
        isActive: true,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: '',
        discountPercentage: 0,
        servicePlanIds: [] as string[]
    });

    const [plans, setPlans] = useState<{id: string, name: string}[]>([]);

    useEffect(() => {
        fetch('http://localhost:5154/api/ServicePlans?PageNumber=1&PageSize=100')
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setPlans(data.data);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPromo = async () => {
                try {
                    const res = await fetch(`http://localhost:5154/api/Promotions/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setFormData({
                            title: data.title,
                            badgeText: data.badgeText,
                            description: data.description,
                            category: data.category,
                            isFeatured: data.isFeatured,
                            isActive: data.isActive,
                            startDate: new Date(data.startDate).toISOString().slice(0, 16),
                            endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
                            discountPercentage: data.discountPercentage || 0,
                            servicePlanIds: data.servicePlanIds || []
                        });
                    }
                } catch (error) {
                    console.error("Error fetching promo:", error);
                }
            };
            fetchPromo();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const url = id 
                ? `http://localhost:5154/api/Promotions/${id}`
                : 'http://localhost:5154/api/Promotions';
            
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                servicePlanIds: formData.servicePlanIds
            };

            const res = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push(`${basePath}/promotions`);
            } else {
                const text = await res.text();
                alert(`Lỗi: ${text}`);
            }
        } catch (error) {
            console.error("Error submitting promo:", error);
            alert('Lỗi kết nối tới server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex items-center gap-4">
                <Link href={`${basePath}/promotions`} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">{id ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-outline-variant p-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="space-y-2 md:col-span-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Tiêu đề (Title)</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="VD: Mùa thu vàng CloudNova" />
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Badge Text</label>
                        <input required type="text" name="badgeText" value={formData.badgeText} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="VD: GIẢM 50% VPS" />
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Danh mục (Category)</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow">
                            <option value="Cloud">Cloud VPS</option>
                            <option value="Hosting">Hosting</option>
                            <option value="Domain">Domain</option>
                            <option value="Email">Email</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Mô tả (Description)</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="Nội dung tóm tắt khuyến mãi"></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Ngày bắt đầu</label>
                        <input required type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" />
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Ngày kết thúc (Để trống nếu ko giới hạn)</label>
                        <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" />
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">Áp dụng cho gói</label>
                        <div className="flex flex-col space-y-2 border border-outline rounded-lg p-3 bg-surface max-h-48 overflow-y-auto">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" 
                                    checked={formData.servicePlanIds.length === 0} 
                                    onChange={(e) => {
                                        if (e.target.checked) setFormData({...formData, servicePlanIds: []});
                                    }}
                                    className="rounded border-outline text-primary focus:ring-primary"
                                />
                                <span>Tất cả các gói</span>
                            </label>
                            {plans.map(plan => (
                                <label key={plan.id} className="flex items-center space-x-2">
                                    <input type="checkbox" 
                                        checked={formData.servicePlanIds.includes(plan.id)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setFormData({...formData, servicePlanIds: [...formData.servicePlanIds, plan.id]});
                                            } else {
                                                setFormData({...formData, servicePlanIds: formData.servicePlanIds.filter(id => id !== plan.id)});
                                            }
                                        }}
                                        className="rounded border-outline text-primary focus:ring-primary"
                                    />
                                    <span>{plan.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-body-md text-body-md font-medium text-on-surface">% Giảm giá (Nhập số)</label>
                        <input required type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-outline bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="VD: 50" min="0" max="100" />
                    </div>

                    <div className="space-y-2 md:col-span-2 flex gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
                            <span className="font-body-md text-on-surface">Sự kiện HOT DEAL (Nổi bật)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-outline text-primary focus:ring-primary" />
                            <span className="font-body-md text-on-surface">Kích hoạt (Hiển thị)</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
                    <Link href={`${basePath}/promotions`} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface font-body-md hover:bg-surface-container transition-colors">
                        Hủy
                    </Link>
                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-body-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isLoading && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
                        {id ? 'Cập nhật' : 'Tạo mới'}
                    </button>
                </div>
            </form>
        </div>
    );
}
