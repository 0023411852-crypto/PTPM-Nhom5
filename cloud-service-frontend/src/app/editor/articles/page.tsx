"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Modal from '@/components/admin/Modal';

export type Article = {
    id: string;
    title: string;
    content?: string;
    authorName: string;
    category: string;
    viewCount: number;
    isPublished: boolean;
    createdAt: string;
    thumbnailUrl?: string;
};

export default function EditorArticlesPage() {
    const pathname = usePathname();
    const basePath = pathname.startsWith('/admin') ? '/admin' : '/editor';
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('Tất cả');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            // Lấy tất cả bài viết
            const res = await fetch(`http://localhost:5154/api/NewsArticles?PageNumber=1&PageSize=100&onlyPublished=false`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setArticles(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const handleDelete = async () => {
        if (articleToDelete) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5154/api/NewsArticles/${articleToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    setArticles(prev => prev.filter(a => a.id !== articleToDelete));
                } else {
                    alert('Xóa bài viết thất bại');
                }
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
            } finally {
                setIsDeleteModalOpen(false);
                setArticleToDelete(null);
            }
        }
    };

    const confirmDelete = (id: string) => {
        setArticleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const filteredArticles = articles.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === 'Tất cả' || a.category === categoryFilter;
        const statusStr = a.isPublished ? 'Đã xuất bản' : 'Bản nháp';
        const matchStatus = statusFilter === 'Tất cả' || statusStr === statusFilter;
        return matchSearch && matchCategory && matchStatus;
    });

    const formatNumber = (num: number) => {
        if (num === 0) return '-';
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    if (!isLoaded) return null;

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Danh sách bài viết</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý, chỉnh sửa và xuất bản nội dung của bạn.</p>
                </div>
                <Link href={`${basePath}/articles/create`} className="bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto">
                    <span className="material-symbols-outlined">edit_note</span>
                    Viết bài mới
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-lg p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                <div className="relative flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input 
                        className="w-full bg-surface border border-outline-variant rounded-md pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all" 
                        placeholder="Tìm kiếm bài viết..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="relative min-w-[160px]">
                        <select 
                            className="w-full bg-surface border border-outline-variant rounded-md pl-4 pr-10 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="Tất cả">Chuyên mục: Tất cả</option>
                            <option value="Cloud">Cloud</option>
                            <option value="VPS">VPS</option>
                            <option value="Bảo mật">Bảo mật</option>
                            <option value="Kỹ thuật">Kỹ thuật</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                    <div className="relative min-w-[160px]">
                        <select 
                            className="w-full bg-surface border border-outline-variant rounded-md pl-4 pr-10 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="Tất cả">Trạng thái: Tất cả</option>
                            <option value="Đã xuất bản">Đã xuất bản</option>
                            <option value="Bản nháp">Bản nháp</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                            <tr>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Tiêu đề</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Tác giả</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Chuyên mục</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Lượt xem</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider">Trạng thái</th>
                                <th className="font-label-caps text-label-caps text-on-surface-variant px-md py-3 font-semibold uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/50">
                            {filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-md py-10 text-center text-on-surface-variant">Không tìm thấy bài viết nào.</td>
                                </tr>
                            ) : (
                                filteredArticles.map(article => (
                                    <tr key={article.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                        <td className="px-md py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-surface-variant text-on-surface flex items-center justify-center font-bold">
                                                    {article.thumbnailUrl ? (
                                                        <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        article.title.charAt(0)
                                                    )}
                                                </div>
                                                <span className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary cursor-pointer transition-colors max-w-[300px] truncate">
                                                    {article.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-md py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-body-sm text-body-sm text-on-surface">{article.authorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-md py-4">
                                            <span className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">{article.category}</span>
                                        </td>
                                        <td className="px-md py-4">
                                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                <span className="font-code-md text-code-md">{formatNumber(article.viewCount)}</span>
                                            </div>
                                        </td>
                                        <td className="px-md py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-medium ${
                                                article.isPublished ? 'bg-tertiary-container/20 text-tertiary border border-tertiary/20' : 'bg-surface-variant text-on-surface-variant border border-outline-variant'
                                            }`}>
                                                {article.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </td>
                                        <td className="px-md py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`${basePath}/articles/create?id=${article.id}`} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button onClick={() => confirmDelete(article.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors" title="Xóa">
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

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Xác nhận xóa bài viết"
                footer={
                    <>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium">Hủy</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-error text-on-error rounded-lg font-medium flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Xóa bài viết
                        </button>
                    </>
                }
            >
                <div className="flex gap-md items-start text-on-surface">
                    <div className="bg-error-container text-error rounded-full p-2 flex-shrink-0">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                        <p className="font-body-md mb-2">Bạn có chắc chắn muốn xóa bài viết này?</p>
                        <p className="font-body-sm text-on-surface-variant">Thao tác này không thể hoàn tác.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
