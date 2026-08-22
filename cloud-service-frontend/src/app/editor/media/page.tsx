"use client";

import React, { useState, useEffect, useRef } from 'react';

type MediaFile = {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: string;
    fileType: string;
    createdAt: string;
};

export default function EditorMediaPage() {
    const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
    const [fileType, setFileType] = useState('Loại tệp: Tất cả');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async (pageNum: number, type: string, searchTerm: string, append = false) => {
        try {
            const queryParams = new URLSearchParams({
                PageNumber: pageNum.toString(),
                PageSize: '12',
            });
            if (type !== 'Loại tệp: Tất cả' && type !== 'Tất cả') {
                queryParams.append('fileType', type);
            }
            if (searchTerm) {
                queryParams.append('search', searchTerm);
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5154/api/Upload?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (append) {
                    setMediaItems(prev => [...prev, ...data.data]);
                } else {
                    setMediaItems(data.data);
                }
                
                if (data.data.length < 12) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchMedia(1, fileType, search, false);
    }, [fileType, search]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMedia(nextPage, fileType, search, true);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            setIsUploading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5154/api/Upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (res.ok) {
                    // Tải lên thành công, tải lại danh sách
                    setPage(1);
                    fetchMedia(1, fileType, search, false);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Tải file thất bại');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Có lỗi xảy ra khi tải file.');
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa file này?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5154/api/Upload/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMediaItems(prev => prev.filter(m => m.id !== id));
            } else {
                alert('Xóa thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const renderPreview = (item: MediaFile) => {
        if (item.fileType === 'Hình ảnh') {
            return (
                <img 
                    src={item.fileUrl.startsWith('http') ? item.fileUrl : `http://localhost:5154${item.fileUrl}`} 
                    alt={item.fileName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
            );
        } else if (item.fileType === 'Video') {
            return (
                <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">smart_display</span>
                </div>
            );
        } else {
            return (
                <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">description</span>
                </div>
            );
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-lg pb-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Thư viện Media</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý hình ảnh, video và các tệp đính kèm.</p>
                </div>
                <div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <button 
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`bg-primary-container text-on-primary-container font-body-md text-body-md px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap self-start sm:self-auto ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="material-symbols-outlined">{isUploading ? 'hourglass_empty' : 'upload'}</span>
                        {isUploading ? 'Đang tải lên...' : 'Tải lên'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                <div className="relative flex-1 min-w-[200px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-md pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all" 
                        placeholder="Tìm kiếm tệp..." 
                        type="text"
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="relative min-w-[160px]">
                        <select 
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            className="w-full bg-surface border border-outline-variant rounded-md pl-4 pr-10 py-2.5 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                        >
                            <option value="Tất cả">Loại tệp: Tất cả</option>
                            <option value="Hình ảnh">Hình ảnh</option>
                            <option value="Video">Video</option>
                            <option value="Tài liệu">Tài liệu</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-md">
                {mediaItems.map((item) => (
                    <div key={item.id} className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden group hover:border-primary transition-all">
                        <div className="aspect-square w-full relative overflow-hidden bg-surface-container-low flex items-center justify-center">
                            {renderPreview(item)}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <a 
                                    href={item.fileUrl.startsWith('http') ? item.fileUrl : `http://localhost:5154${item.fileUrl}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-surface text-on-surface flex items-center justify-center hover:text-primary transition-colors tooltip" 
                                    title="Xem trước"
                                >
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                </a>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center hover:opacity-90 transition-opacity tooltip" 
                                    title="Xóa"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="font-body-sm text-[12px] font-medium text-on-surface truncate" title={item.fileName}>{item.fileName}</p>
                            <p className="font-body-sm text-[10px] text-on-surface-variant mt-1">{item.fileSize}</p>
                        </div>
                    </div>
                ))}
                
                {mediaItems.length === 0 && (
                    <div className="col-span-full py-10 text-center font-body-md text-on-surface-variant">
                        Không có tệp nào được tìm thấy.
                    </div>
                )}
            </div>
            
            {hasMore && mediaItems.length > 0 && (
                <div className="flex justify-center mt-xl">
                    <button 
                        onClick={handleLoadMore}
                        className="px-6 py-2 border border-outline-variant rounded-full text-on-surface font-body-sm font-medium hover:bg-surface-container-low transition-colors"
                    >
                        Tải thêm
                    </button>
                </div>
            )}
        </div>
    );
}
