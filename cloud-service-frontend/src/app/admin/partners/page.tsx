"use client";

import React, { useEffect, useState } from 'react';
import Modal from '@/components/admin/Modal';

interface Partner {
    id: string;
    name: string;
    email: string;
    website: string;
    method: string;
    status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
    date: string;
}

export default function AdminPartnersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPartner, setNewPartner] = useState({
        name: '', email: '', website: '', method: '', status: 'Đã duyệt' as Partner['status'], otherMethod: ''
    });

    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchPartners();
    }, [pageNumber]);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/AffiliateApplications?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mappedPartners: Partner[] = data.data.map((p: any) => ({
                    id: p.id,
                    name: p.fullName,
                    email: p.email,
                    website: p.websiteUrl,
                    method: p.promotionalMethods,
                    status: p.status === 0 ? 'Chờ duyệt' : p.status === 1 ? 'Đã duyệt' : 'Từ chối',
                    date: new Date(p.createdAt).toLocaleDateString('vi-VN')
                }));
                setPartners(mappedPartners);
                setTotalPages(data.totalPages);
            }
        } catch (e) {
            console.error("Failed to fetch partners", e);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatusStr: Partner['status']) => {
        if (!window.confirm(`Bạn muốn chuyển trạng thái đối tác thành "${newStatusStr}"?`)) return;

        let statusCode = 0;
        if (newStatusStr === 'Đã duyệt') statusCode = 1;
        if (newStatusStr === 'Từ chối') statusCode = 2;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/AffiliateApplications/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: statusCode })
            });

            if (res.ok) {
                fetchPartners();
                if (selectedPartner && selectedPartner.id === id) {
                    setSelectedPartner({ ...selectedPartner, status: newStatusStr });
                }
            } else {
                alert("Lỗi cập nhật trạng thái");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleViewDetails = (partner: Partner) => {
        setSelectedPartner(partner);
        setIsDetailsModalOpen(true);
    };

    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalMethod = newPartner.method === 'other' && newPartner.otherMethod ? newPartner.otherMethod : newPartner.method;

        let statusCode = 0;
        if (newPartner.status === 'Đã duyệt') statusCode = 1;
        if (newPartner.status === 'Từ chối') statusCode = 2;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/AffiliateApplications/admin-create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: newPartner.name,
                    email: newPartner.email,
                    websiteUrl: newPartner.website,
                    promotionalMethods: finalMethod,
                    status: statusCode
                })
            });

            if (res.ok) {
                alert("Thêm đối tác thành công!");
                setIsAddModalOpen(false);
                setNewPartner({ name: '', email: '', website: '', method: '', status: 'Đã duyệt', otherMethod: '' });
                fetchPartners();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi tạo đối tác");
            }
        } catch (e) {
            console.error(e);
            alert("Đã xảy ra lỗi.");
        }
    };

    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.website.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getMethodLabel = (method: string) => {
        switch (method) {
            case 'blog': return 'Viết Blog / Review';
            case 'social': return 'Mạng xã hội';
            case 'agency': return 'Agency / SI';
            case 'other': return 'Khác';
            default: return method || 'Khác';
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg pb-xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Quản lý Đối tác</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Xét duyệt và quản lý danh sách đối tác / Affiliate</p>
                </div>
                <div className="flex gap-sm">
                    <button onClick={() => setIsAddModalOpen(true)} className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                        Thêm đối tác
                    </button>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                <div className="flex justify-between items-center mb-md">
                    <div className="relative w-72">
                        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
                        <input
                            type="text"
                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm pl-[36px] pr-sm font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Tìm kiếm tên, email, website..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-sm">
                        <button className="p-sm text-on-surface-variant hover:text-primary transition-colors border border-outline-variant rounded-md hover:bg-surface-container-low">
                            <span className="material-symbols-outlined text-[20px]" data-icon="filter_list">filter_list</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant text-outline font-label-caps text-label-caps bg-surface-container-low/50">
                                <th className="py-sm px-md font-semibold">Tên đối tác</th>
                                <th className="py-sm px-md font-semibold">Hình thức</th>
                                <th className="py-sm px-md font-semibold">Trạng thái</th>
                                <th className="py-sm px-md font-semibold">Ngày đăng ký</th>
                                <th className="py-sm px-md font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPartners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Không tìm thấy đối tác nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                                        <td className="py-md px-md">
                                            <div className="flex items-center gap-sm">
                                                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-body-md shrink-0">
                                                    {partner.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-body-md text-body-md text-on-surface font-medium">{partner.name}</p>
                                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{partner.email}</p>
                                                    {partner.website && (
                                                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="font-body-sm text-body-sm text-primary hover:underline mt-xs inline-block text-[12px]">
                                                            {partner.website}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-md px-md">
                                            <span className="font-body-sm text-body-sm bg-surface-container px-2 py-1 rounded">
                                                {getMethodLabel(partner.method)}
                                            </span>
                                        </td>
                                        <td className="py-md px-md">
                                            <div className="relative inline-block">
                                                <select
                                                    value={partner.status}
                                                    onChange={(e) => handleStatusChange(partner.id, e.target.value as Partner['status'])}
                                                    className={`font-label-caps text-[11px] px-2 py-1 pr-6 rounded border border-transparent hover:border-outline-variant outline-none cursor-pointer appearance-none ${partner.status === 'Đã duyệt' ? 'bg-primary-container text-on-primary-container' :
                                                            partner.status === 'Từ chối' ? 'bg-error-container text-on-error-container' :
                                                                'bg-tertiary-container text-on-tertiary-container'
                                                        }`}
                                                >
                                                    <option value="Chờ duyệt" className="bg-surface text-on-surface">Chờ duyệt</option>
                                                    <option value="Đã duyệt" className="bg-surface text-on-surface">Đã duyệt</option>
                                                    <option value="Từ chối" className="bg-surface text-on-surface">Từ chối</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">expand_more</span>
                                            </div>
                                        </td>
                                        <td className="py-md px-md text-on-surface-variant font-body-sm text-body-sm">
                                            {partner.date}
                                        </td>
                                        <td className="py-md px-md text-right space-x-2 whitespace-nowrap">
                                            <button onClick={() => handleViewDetails(partner)} className="p-1 text-on-surface-variant hover:text-primary transition-colors tooltip" title="Chi tiết">
                                                <span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-lg text-on-surface-variant">
                    <span className="font-body-sm text-body-sm">Trang {pageNumber} / {totalPages} (Hiển thị {filteredPartners.length} kết quả)</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber === 1 || loading}
                            className="px-3 py-1 border border-outline-variant rounded-md hover:bg-surface-container-low transition-colors font-body-sm text-body-sm disabled:opacity-50"
                        >
                            Trang trước
                        </button>
                        <button className="px-3 py-1 bg-primary text-on-primary rounded-md font-body-sm text-body-sm">{pageNumber}</button>
                        <button
                            onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                            disabled={pageNumber === totalPages || loading}
                            className="px-3 py-1 border border-outline-variant rounded-md hover:bg-surface-container-low transition-colors font-body-sm text-body-sm disabled:opacity-50"
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>

            {/* Chi tiết Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Chi tiết Đăng ký Đối tác"
                maxWidth="max-w-[32rem]"
                footer={
                    <>
                        <button onClick={() => setIsDetailsModalOpen(false)} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium text-on-surface">Đóng</button>
                    </>
                }
            >
                {selectedPartner && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-md pb-md border-b border-outline-variant">
                            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-headline-md shrink-0">
                                {selectedPartner.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface">{selectedPartner.name}</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">{selectedPartner.email}</p>
                            </div>
                            <div className="ml-auto relative">
                                <select
                                    value={selectedPartner.status}
                                    onChange={(e) => handleStatusChange(selectedPartner.id, e.target.value as Partner['status'])}
                                    className={`font-label-caps text-label-caps px-2 py-1 pr-6 rounded border border-transparent hover:border-outline-variant outline-none cursor-pointer appearance-none ${selectedPartner.status === 'Đã duyệt' ? 'bg-primary-container text-on-primary-container' :
                                            selectedPartner.status === 'Từ chối' ? 'bg-error-container text-on-error-container' :
                                                'bg-tertiary-container text-on-tertiary-container'
                                        }`}
                                >
                                    <option value="Chờ duyệt" className="bg-surface text-on-surface">Chờ duyệt</option>
                                    <option value="Đã duyệt" className="bg-surface text-on-surface">Đã duyệt</option>
                                    <option value="Từ chối" className="bg-surface text-on-surface">Từ chối</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-y-md">
                            <div className="col-span-1 font-body-sm text-body-sm text-on-surface-variant">Ngày đăng ký:</div>
                            <div className="col-span-2 font-body-md text-body-md text-on-surface font-medium">{selectedPartner.date}</div>

                            <div className="col-span-1 font-body-sm text-body-sm text-on-surface-variant">Website:</div>
                            <div className="col-span-2 font-body-md text-body-md text-on-surface">
                                {selectedPartner.website ? (
                                    <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {selectedPartner.website}
                                    </a>
                                ) : 'Không cung cấp'}
                            </div>

                            <div className="col-span-1 font-body-sm text-body-sm text-on-surface-variant">Hình thức QC:</div>
                            <div className="col-span-2 font-body-md text-body-md text-on-surface">
                                {getMethodLabel(selectedPartner.method)}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Thêm Đối tác Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm Đối tác mới"
                maxWidth="max-w-[32rem]"
                footer={
                    <>
                        <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium text-on-surface">Hủy</button>
                        <button onClick={(e) => {
                            const form = document.getElementById('add-partner-form') as HTMLFormElement;
                            if (form.checkValidity()) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            else form.reportValidity();
                        }} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm">
                            Thêm đối tác
                        </button>
                    </>
                }
            >
                <form id="add-partner-form" onSubmit={handleAddPartner} className="space-y-4">
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Tên đối tác *</label>
                        <input type="text" required value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Nhập tên đối tác..." />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Email *</label>
                        <input type="email" required value={newPartner.email} onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="contact@example.com" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Website</label>
                        <input type="url" value={newPartner.website} onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="https://" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Hình thức QC *</label>
                            <select required value={newPartner.method} onChange={(e) => setNewPartner({ ...newPartner, method: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                                <option value="">Chọn hình thức</option>
                                <option value="blog">Viết Blog / Review</option>
                                <option value="social">Mạng xã hội</option>
                                <option value="agency">Agency / SI</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Trạng thái *</label>
                            <select required value={newPartner.status} onChange={(e) => setNewPartner({ ...newPartner, status: e.target.value as Partner['status'] })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                                <option value="Đã duyệt">Đã duyệt</option>
                                <option value="Chờ duyệt">Chờ duyệt</option>
                                <option value="Từ chối">Từ chối</option>
                            </select>
                        </div>
                    </div>
                    {newPartner.method === 'other' && (
                        <div className="animate-fade-in mt-4">
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Vui lòng mô tả rõ hơn *</label>
                            <input type="text" required value={newPartner.otherMethod} onChange={(e) => setNewPartner({ ...newPartner, otherMethod: e.target.value })} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Nhập hình thức quảng bá..." />
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}
