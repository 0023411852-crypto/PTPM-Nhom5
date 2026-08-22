"use client";

import React, { useEffect, useState } from 'react';
import Modal from '@/components/admin/Modal';

export default function AdminPartnerRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [actionNotes, setActionNotes] = useState('');
    const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Pending' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        fullName: '',
        email: '',
        websiteUrl: '',
        promotionMethod: '',
        promotionDetails: ''
    });

    useEffect(() => {
        fetchRequests();
    }, [pageNumber, searchKeyword, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/PartnerRequests?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURIComponent(searchKeyword)}&status=${encodeURIComponent(statusFilter)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (e) {
            console.error("Failed to fetch partner requests", e);
        } finally {
            setLoading(false);
        }
    };

    const openActionModal = (req: any, type: 'Approve' | 'Reject' | 'Pending') => {
        setSelectedRequest(req);
        setActionType(type);
        setActionNotes(req.notes || '');
        setIsActionModalOpen(true);
    };

    const handleActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest || !actionType) return;
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            let targetStatus = 'Pending';
            if (actionType === 'Approve') targetStatus = 'Approved';
            if (actionType === 'Reject') targetStatus = 'Rejected';

            const res = await fetch(`http://localhost:5154/api/PartnerRequests/${selectedRequest.id}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    status: targetStatus,
                    notes: actionNotes
                })
            });

            if (res.ok) {
                setIsActionModalOpen(false);
                fetchRequests();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi cập nhật trạng thái.");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối đến server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/PartnerRequests`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(addForm)
            });

            if (res.ok) {
                setIsAddModalOpen(false);
                setAddForm({ fullName: '', email: '', websiteUrl: '', promotionMethod: '', promotionDetails: '' });
                fetchRequests();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi thêm đối tác.");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối đến server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Approved': return 'Đã duyệt';
            case 'Rejected': return 'Từ chối';
            case 'Pending': return 'Chờ duyệt';
            default: return status;
        }
    };

    const getPromotionMethod = (method: string) => {
        switch(method) {
            case 'blog': return 'Viết Blog / Review';
            case 'social': return 'Mạng xã hội';
            case 'agency': return 'Agency / System Integrator';
            case 'other': return 'Khác';
            default: return method;
        }
    };

    if (loading && requests.length === 0) return <div className="p-8 text-center text-secondary">Đang tải dữ liệu...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">Yêu cầu Đối tác</h1>
                    <p className="text-secondary mt-1">Quản lý các yêu cầu đăng ký làm đối tác từ người dùng.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Thêm Đối tác
                </button>
            </div>

            {/* Filters */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, email, website..." 
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none min-w-[150px]"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Pending">Chờ duyệt (Pending)</option>
                    <option value="Approved">Đã duyệt (Approved)</option>
                    <option value="Rejected">Từ chối (Rejected)</option>
                </select>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-4 font-semibold text-on-surface">Người đăng ký</th>
                                <th className="p-4 font-semibold text-on-surface">Trang web</th>
                                <th className="p-4 font-semibold text-on-surface">Hình thức</th>
                                <th className="p-4 font-semibold text-on-surface">Ngày gửi</th>
                                <th className="p-4 font-semibold text-on-surface">Trạng thái</th>
                                <th className="p-4 font-semibold text-on-surface text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {requests.map(req => (
                                <tr key={req.id} className="hover:bg-surface-container-low/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-on-surface">{req.fullName}</div>
                                        <div className="text-sm text-secondary">{req.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-secondary">
                                        {req.websiteUrl ? (
                                            <a href={req.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">link</span>
                                                Truy cập
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium">{getPromotionMethod(req.promotionMethod)}</div>
                                        {req.promotionDetails && <div className="text-xs text-secondary mt-1">{req.promotionDetails}</div>}
                                    </td>
                                    <td className="p-4 text-sm text-secondary">
                                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                            {getStatusText(req.status)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <button 
                                                onClick={() => openActionModal(req, 'Approve')}
                                                disabled={req.status === 'Approved'}
                                                className={`p-1.5 rounded-lg transition-colors ${req.status === 'Approved' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                title="Duyệt"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                            </button>
                                            
                                            <button 
                                                onClick={() => openActionModal(req, 'Reject')}
                                                disabled={req.status === 'Rejected'}
                                                className={`p-1.5 rounded-lg transition-colors ${req.status === 'Rejected' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                title="Từ chối"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                            </button>
                                            
                                            <button 
                                                onClick={() => openActionModal(req, 'Pending')}
                                                disabled={req.status === 'Pending'}
                                                className={`p-1.5 rounded-lg transition-colors ${req.status === 'Pending' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
                                                title="Chuyển về Chờ duyệt"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">schedule</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-secondary">Chưa có yêu cầu đăng ký đối tác nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low/30">
                        <span className="text-sm text-secondary">Trang {pageNumber} / {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                disabled={pageNumber === 1}
                                className="px-3 py-1.5 bg-surface border border-outline-variant rounded-md text-sm hover:bg-surface-container-low disabled:opacity-50 transition-colors"
                            >
                                Trước
                            </button>
                            <button 
                                onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                                disabled={pageNumber === totalPages}
                                className="px-3 py-1.5 bg-surface border border-outline-variant rounded-md text-sm hover:bg-surface-container-low disabled:opacity-50 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => !isSubmitting && setIsActionModalOpen(false)}
                title={actionType === 'Approve' ? 'Duyệt yêu cầu Đối tác' : (actionType === 'Reject' ? 'Từ chối yêu cầu Đối tác' : 'Chuyển trạng thái Chờ duyệt')}
                maxWidth="max-w-[32rem]"
                footer={
                    <>
                        <button onClick={() => setIsActionModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium text-on-surface">Hủy</button>
                        <button onClick={(e) => {
                            const form = document.getElementById('action-form') as HTMLFormElement;
                            if (form.checkValidity()) {
                                document.getElementById('hidden-action-submit')?.click();
                            } else {
                                form.reportValidity();
                            }
                        }} disabled={isSubmitting} className={`px-4 py-2 text-white rounded-lg font-medium shadow-sm disabled:opacity-70 ${actionType === 'Approve' ? 'bg-green-600 hover:bg-green-700' : (actionType === 'Reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700')}`}>
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </>
                }
            >
                <form id="action-form" onSubmit={handleActionSubmit} className="space-y-4">
                    <button type="submit" id="hidden-action-submit" className="hidden"></button>
                    <div className="bg-surface-container p-3 rounded-lg text-sm mb-4">
                        <div><span className="text-secondary">Người đăng ký:</span> <span className="font-medium text-on-surface">{selectedRequest?.fullName}</span></div>
                        <div><span className="text-secondary">Email:</span> {selectedRequest?.email}</div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Ghi chú (Tùy chọn)
                        </label>
                        <textarea 
                            value={actionNotes}
                            onChange={e => setActionNotes(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary outline-none min-h-[100px]"
                            placeholder="Ghi chú về quyết định này..."
                        ></textarea>
                    </div>
                </form>
            </Modal>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => !isSubmitting && setIsAddModalOpen(false)}
                title="Thêm Đối tác Mới"
                maxWidth="max-w-[40rem]"
                footer={
                    <>
                        <button onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 hover:bg-surface-container rounded-lg font-medium text-on-surface">Hủy</button>
                        <button onClick={() => document.getElementById('hidden-add-submit')?.click()} disabled={isSubmitting} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm disabled:opacity-70">
                            {isSubmitting ? 'Đang thêm...' : 'Thêm đối tác'}
                        </button>
                    </>
                }
            >
                <form id="add-form" onSubmit={handleAddSubmit} className="space-y-4">
                    <button type="submit" id="hidden-add-submit" className="hidden"></button>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Họ và tên / Tên doanh nghiệp</label>
                        <input type="text" required value={addForm.fullName} onChange={e => setAddForm({...addForm, fullName: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Email liên hệ</label>
                        <input type="email" required value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Website (Nếu có)</label>
                        <input type="url" value={addForm.websiteUrl} onChange={e => setAddForm({...addForm, websiteUrl: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Hình thức quảng bá</label>
                        <select 
                            required 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={addForm.promotionMethod}
                            onChange={e => setAddForm({...addForm, promotionMethod: e.target.value})}
                        >
                            <option value="">Chọn hình thức quảng bá</option>
                            <option value="blog">Viết Blog / Review</option>
                            <option value="social">Mạng xã hội (Facebook, YouTube...)</option>
                            <option value="agency">Agency / System Integrator</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    {addForm.promotionMethod === 'other' && (
                        <div className="animate-fade-in">
                            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Chi tiết hình thức</label>
                            <input type="text" required value={addForm.promotionDetails} onChange={e => setAddForm({...addForm, promotionDetails: e.target.value})} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                    )}
                </form>
            </Modal>
        </div>
    );
}
