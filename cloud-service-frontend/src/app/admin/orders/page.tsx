"use client";

import React, { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Detail Modal state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/Orders/all?PageNumber=1&PageSize=50", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setOrders(data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleExportOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/Orders/export", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) {
                alert("Không thể xuất danh sách đơn hàng.");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối khi xuất danh sách đơn hàng.");
        }
        };

    const openDetailModal = (order: any) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };


    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này? Thao tác không thể hoàn tác!")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/Orders/${orderId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Xóa đơn hàng thành công!");
                fetchOrders();
            } else {
                const err = await res.json();
                alert(`Lỗi: ${err.message || 'Không thể xóa đơn hàng'}`);
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối.");
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const isCompleted = o.status === 2 || o.status === 'Completed';
        const isPending = o.status === 0 || o.status === 'Pending';
        const mappedStatus = isCompleted ? 'COMPLETED' : isPending ? 'PENDING' : 'PROCESSING';
        const matchesFilter = statusFilter === 'ALL' || mappedStatus === statusFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div>Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-xl">
                <h1 className="font-display-sm text-display-sm text-on-surface">Quản lý Đơn hàng</h1>
                <div className="flex gap-sm">
                    <button
                        onClick={handleExportOrders}
                        className="px-md py-sm bg-surface-container border border-outline-variant text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
                        Xuất CSV
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-md mb-lg">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo Mã đơn hàng hoặc Khách hàng..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-surface rounded-xl border border-outline-variant px-md py-sm focus:border-primary outline-none"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full bg-surface rounded-xl border border-outline-variant px-md py-sm focus:border-primary outline-none"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                        <option value="PROCESSING">Đang xử lý</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-outline-variant">
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">STT</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">ID</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">Ngày tạo</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">Khách hàng</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">Tổng tiền</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">Trạng thái</th>
                                <th className="p-md font-medium text-on-surface-variant text-[14px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-xl text-center text-on-surface-variant">Không tìm thấy đơn hàng nào</td>
                                </tr>
                            ) : filteredOrders.map((order, index) => {
                                const isCompleted = order.status === 2 || order.status === 'Completed';
                                const isPending = order.status === 0 || order.status === 'Pending';
                                
                                return (
                                <tr key={order.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                                    <td className="p-md text-[14px] text-on-surface-variant font-medium">{index + 1}</td>
                                    <td className="p-md text-[14px] text-on-surface font-code-sm">{order.id.split('-')[0]}</td>
                                    <td className="p-md text-[14px] text-on-surface">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                    <td className="p-md text-[14px] text-on-surface">{order.userId.split('-')[0]}</td>
                                    <td className="p-md text-[14px] text-on-surface font-medium">{order.totalAmount.toLocaleString('vi-VN')} đ</td>
                                    <td className="p-md">
                                        <span className={`px-2 py-1 rounded-full text-[12px] font-bold uppercase ${
                                            isCompleted ? 'bg-green-100 text-green-700' : 
                                            isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-surface-container text-on-surface-variant'
                                        }`}>
                                            {isCompleted ? 'ĐÃ HOÀN THÀNH' : isPending ? 'CHỜ XỬ LÝ' : 'ĐANG XỬ LÝ'}
                                        </span>
                                    </td>
                                    <td className="p-md">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openDetailModal(order)}
                                                className="px-sm py-xs bg-surface-container text-on-surface-variant rounded text-[13px] font-medium hover:bg-surface-variant transition-colors"
                                            >
                                                Chi tiết
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="px-sm py-xs bg-error/10 text-error rounded text-[13px] font-medium hover:bg-error/20 transition-colors ml-auto"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Xem chi tiết */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-scrim/50 z-50 flex items-center justify-center p-md">
                    <div className="bg-surface rounded-2xl p-xl w-full max-w-[600px] shadow-lg border border-outline-variant">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Chi tiết đơn hàng</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-xl text-[14px]">
                            <div>
                                <span className="text-on-surface-variant block mb-1">Mã đơn hàng:</span>
                                <span className="font-medium text-on-surface">{selectedOrder.id}</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant block mb-1">Ngày tạo:</span>
                                <span className="font-medium text-on-surface">{new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant block mb-1">Khách hàng ID:</span>
                                <span className="font-medium text-on-surface">{selectedOrder.userId}</span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant block mb-1">Tổng tiền:</span>
                                <span className="font-medium text-on-surface">{selectedOrder.totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>
                            {selectedOrder.adminNotes && (
                                <div className="col-span-2 mt-2">
                                    <span className="text-on-surface-variant block mb-1">Ghi chú từ admin:</span>
                                    <div className="bg-surface-container p-sm rounded-lg text-on-surface-variant">{selectedOrder.adminNotes}</div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={() => setIsDetailModalOpen(false)} className="px-md py-sm bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
