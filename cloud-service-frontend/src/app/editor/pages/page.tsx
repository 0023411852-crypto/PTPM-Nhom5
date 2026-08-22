"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type StaticPage = {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    updatedAt?: string;
    createdAt: string;
};

export default function EditorStaticPagesPage() {
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const res = await fetch('http://localhost:5154/api/StaticPages?PageNumber=1&PageSize=50');
            if (res.ok) {
                const data = await res.json();
                setPages(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa trang này?')) return;
        
        try {
            const res = await fetch(`http://localhost:5154/api/StaticPages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                fetchPages();
            } else {
                alert('Có lỗi xảy ra khi xóa trang.');
            }
        } catch (error) {
            console.error('Lỗi mạng khi xóa:', error);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Trang tĩnh</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý nội dung các trang cố định như Giới thiệu, Điều khoản, Chính sách bảo mật.</p>
                </div>
                <Link href={`${basePath}/pages/create`} className="bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto">
                    <span className="material-symbols-outlined">add</span>
                    Tạo trang mới
                </Link>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                            <tr>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Tiêu đề trang</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Đường dẫn (URL)</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Lần cập nhật cuối</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Trạng thái</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-md py-4 text-center">Đang tải...</td></tr>
                            ) : pages.length === 0 ? (
                                <tr><td colSpan={5} className="px-md py-4 text-center">Chưa có trang tĩnh nào.</td></tr>
                            ) : (
                                pages.map(page => (
                                    <tr key={page.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                        <td className="px-md py-4">
                                            <span className="font-body-md text-body-md font-medium text-on-surface">{page.title}</span>
                                        </td>
                                        <td className="px-md py-4">
                                            <Link href={`/${page.slug}`} target="_blank" className="font-body-sm text-primary hover:underline">/{page.slug}</Link>
                                        </td>
                                        <td className="px-md py-4">
                                            <span className="font-body-sm text-on-surface-variant">
                                                {new Date(page.updatedAt || page.createdAt).toLocaleString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="px-md py-4">
                                            {page.isPublished ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/20">
                                                    Đã xuất bản
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                                                    Bản nháp
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-md py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`${basePath}/pages/create?id=${page.id}`} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button onClick={() => handleDelete(page.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Xóa">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
