"use client";

import React, { useState } from 'react';
import Modal from '@/components/admin/Modal';

type Affiliate = {
    id: string;
    name: string;
    email: string;
    website: string;
    method: string;
    date: string;
    status: string;
};

const initialAffiliates: Affiliate[] = [
    { id: 'AF-101', name: 'Nguyễn Trần Trọng', email: 'trong.ng@example.com', website: 'https://reviewhosting.vn', method: 'Review Blog & SEO', date: '20/08/2023', status: 'Chờ duyệt' },
    { id: 'AF-102', name: 'Lê Hoàng Anh', email: 'hoanganhtech@gmail.com', website: 'Youtube Channel', method: 'Video Review, Livestream', date: '19/08/2023', status: 'Chờ duyệt' },
    { id: 'AF-103', name: 'Trần Thị Thu', email: 'thu.marketing@agency.co', website: 'https://agency.co', method: 'Chạy Ads', date: '18/08/2023', status: 'Đã duyệt' },
    { id: 'AF-104', name: 'Phạm Bảo', email: 'baopham@dev.to', website: 'https://dev.to/baopham', method: 'Viết bài kỹ thuật', date: '17/08/2023', status: 'Từ chối' },
];

export default function AdminAffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
    const [filter, setFilter] = useState('Tất cả');
    
    // Modal states
    const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Handlers
    const handleViewDetails = (aff: Affiliate) => {
        setSelectedAffiliate(aff);
        setIsDetailModalOpen(true);
    };

    const handleApprove = (id: string) => {
        setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: 'Đã duyệt' } : a));
        setIsDetailModalOpen(false);
    };

    const handleReject = (id: string) => {
        setAffiliates(affiliates.map(a => a.id === id ? { ...a, status: 'Từ chối' } : a));
        setIsDetailModalOpen(false);
    };

    const filteredAffiliates = filter === 'Tất cả' ? affiliates : affiliates.filter(a => a.status === filter);

    return (
        <div className="max-w-container-max mx-auto space-y-lg pb-xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Chương trình Đối tác (Affiliate)</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Duyệt hồ sơ đăng ký tham gia kiếm tiền cùng CloudNova</p>
                </div>
                <div className="flex gap-sm">
                    <button className="px-md py-sm bg-surface-container border border-outline-variant rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[18px]" data-icon="settings">settings</span>
                        Cấu hình Hoa hồng
                    </button>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                <div className="flex justify-between items-center mb-md gap-md flex-wrap">
                    <div className="flex items-center gap-2">
                        {['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm font-medium transition-colors ${
                                    filter === f 
                                        ? 'bg-primary-container text-on-primary-container' 
                                        : 'hover:bg-surface-container text-on-surface-variant'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-72">
                        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
                        <input 
                            type="text" 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm pl-[36px] pr-sm font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                            placeholder="Tìm kiếm đối tác..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant text-outline font-label-caps text-label-caps bg-surface-container-low/50">
                                <th className="py-sm px-md font-semibold">Mã ĐT</th>
                                <th className="py-sm px-md font-semibold">Họ tên / Email</th>
                                <th className="py-sm px-md font-semibold">Website / Nền tảng</th>
                                <th className="py-sm px-md font-semibold">Trạng thái</th>
                                <th className="py-sm px-md font-semibold">Ngày đăng ký</th>
                                <th className="py-sm px-md font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAffiliates.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-lg text-center text-on-surface-variant font-body-sm">
                                        Không tìm thấy hồ sơ nào.
                                    </td>
                                </tr>
                            )}
                            {filteredAffiliates.map((aff) => (
                                <tr key={aff.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                                    <td className="py-md px-md">
                                        <p className="font-code-md text-code-md text-on-surface font-medium">{aff.id}</p>
                                    </td>
                                    <td className="py-md px-md">
                                        <p className="font-body-md text-body-md text-on-surface font-medium">{aff.name}</p>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">{aff.email}</p>
                                    </td>
                                    <td className="py-md px-md">
                                        <p className="font-body-sm text-body-sm text-on-surface text-primary truncate max-w-[200px]">{aff.website}</p>
                                    </td>
                                    <td className="py-md px-md">
                                        <span className={`font-label-caps text-[10px] px-unit py-[2px] rounded inline-block whitespace-nowrap ${
                                            aff.status === 'Đã duyệt' ? 'bg-tertiary-container/20 text-tertiary-container' : 
                                            aff.status === 'Chờ duyệt' ? 'bg-primary-container/30 text-primary' :
                                            'bg-error-container/30 text-error'
                                        }`}>
                                            {aff.status}
                                        </span>
                                    </td>
                                    <td className="py-md px-md text-on-surface-variant font-body-sm text-body-sm">
                                        {aff.date}
                                    </td>
                                    <td className="py-md px-md text-right space-x-2 whitespace-nowrap">
                                        {(aff.status === 'Chờ duyệt') && (
                                            <button 
                                                onClick={() => handleApprove(aff.id)}
                                                className="p-1 text-on-surface-variant hover:text-primary transition-colors tooltip" 
                                                title="Duyệt hồ sơ"
                                            >
                                                <span className="material-symbols-outlined text-[20px]" data-icon="how_to_reg">how_to_reg</span>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleViewDetails(aff)}
                                            className="p-1 text-on-surface-variant hover:text-primary transition-colors tooltip" 
                                            title="Xem hồ sơ"
                                        >
                                            <span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Affiliate Details Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Chi tiết Hồ sơ Đối tác"
                footer={
                    <>
                        <button 
                            onClick={() => setIsDetailModalOpen(false)}
                            className="px-md py-sm rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors"
                        >
                            Đóng
                        </button>
                        {(selectedAffiliate?.status === 'Chờ duyệt') && (
                            <>
                                <button 
                                    onClick={() => handleReject(selectedAffiliate.id)}
                                    className="px-md py-sm border border-error text-error rounded-lg font-medium hover:bg-error-container transition-colors shadow-sm"
                                >
                                    Từ chối
                                </button>
                                <button 
                                    onClick={() => handleApprove(selectedAffiliate.id)}
                                    className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm"
                                >
                                    Chấp nhận Đối tác
                                </button>
                            </>
                        )}
                    </>
                }
            >
                {selectedAffiliate && (
                    <div className="space-y-md font-body-sm">
                        <div className="bg-surface-container-low p-md rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-on-surface-variant mb-1">Trạng thái hồ sơ</p>
                                <span className={`font-label-caps text-[12px] px-2 py-1 rounded inline-block whitespace-nowrap ${
                                    selectedAffiliate.status === 'Đã duyệt' ? 'bg-tertiary-container/20 text-tertiary-container' : 
                                    selectedAffiliate.status === 'Chờ duyệt' ? 'bg-primary-container/30 text-primary' :
                                    'bg-error-container/30 text-error'
                                }`}>
                                    {selectedAffiliate.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-on-surface-variant mb-1">Mã định danh</p>
                                <p className="font-code-md text-on-surface">{selectedAffiliate.id}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm border-b border-outline-variant pb-2">Thông tin Cá nhân</h4>
                            <div className="grid grid-cols-2 gap-y-sm">
                                <span className="text-on-surface-variant">Họ và tên:</span>
                                <span className="font-medium text-on-surface text-right">{selectedAffiliate.name}</span>
                                <span className="text-on-surface-variant">Email liên hệ:</span>
                                <span className="font-medium text-on-surface text-right">{selectedAffiliate.email}</span>
                                <span className="text-on-surface-variant">Ngày nộp hồ sơ:</span>
                                <span className="font-medium text-on-surface text-right">{selectedAffiliate.date}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-sm border-b border-outline-variant pb-2">Kế hoạch Quảng bá (Promotion Plan)</h4>
                            <div className="space-y-sm">
                                <div>
                                    <p className="text-on-surface-variant">Website / Nền tảng chính:</p>
                                    <a href="#" className="font-medium text-primary hover:underline block mt-1">{selectedAffiliate.website}</a>
                                </div>
                                <div>
                                    <p className="text-on-surface-variant">Phương thức tiếp thị:</p>
                                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-sm mt-1">
                                        {selectedAffiliate.method}
                                        <p className="text-on-surface-variant mt-2 text-[13px]">
                                            "Tôi dự định sẽ review chất lượng VPS của CloudNova trên kênh Youtube của mình và hướng dẫn khán giả cách mua hàng thông qua link Affiliate."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
