"use client";

import React, { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Approving Modal state
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [vpsIP, setVpsIP] = useState('');
    const [vpsUser, setVpsUser] = useState('root');
    const [vpsPassword, setVpsPassword] = useState('');

    // Create Order Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [servicePlans, setServicePlans] = useState<any[]>([]);
    
    // Form fields for create
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [selectedPriceId, setSelectedPriceId] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Detail Modal state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [editStatus, setEditStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5154/api/Orders/all?PageNumber=1&PageSize=50", {
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

    const fetchUsersAndPlans = async () => {
        try {
            const token = localStorage.getItem("token");
            const [usersRes, plansRes] = await Promise.all([
                fetch("http://localhost:5154/api/Users?PageNumber=1&PageSize=100", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5154/api/ServicePlans?PageNumber=1&PageSize=100", { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            
            if (usersRes.ok) {
                const uData = await usersRes.json();
                setUsers(uData.data || []);
            }
            if (plansRes.ok) {
                const pData = await plansRes.json();
                setServicePlans(pData.data || []);
            }
        } catch (e) {
            console.error("Error fetching dependencies", e);
        }
    };

    const openCreateModal = () => {
        setSelectedUserId('');
        setSelectedPlanId('');
        setSelectedPriceId('');
        setAdminNotes('');
        setIsCreateModalOpen(true);
        if (users.length === 0 || servicePlans.length === 0) {
            fetchUsersAndPlans();
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5154/api/Orders/admin-create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: selectedUserId,
                    servicePlanId: selectedPlanId,
                    planPriceId: selectedPriceId,
                    adminNotes
                })
            });

            if (res.ok) {
                alert("Tạo đơn hàng thành công!");
                setIsCreateModalOpen(false);
                fetchOrders();
            } else {
                const err = await res.json();
                alert(`Lỗi: ${err.message || 'Không thể tạo đơn hàng'}`);
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối.");
        }
    };

    const openApproveModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setVpsIP('');
        setVpsPassword('');
        setIsApproveModalOpen(true);
    };

    const openDetailModal = (order: any) => {
        setSelectedOrder(order);
        setEditStatus(order.status === 2 || order.status === 'Completed' ? 'Completed' : (order.status === 0 || order.status === 'Pending' ? 'Pending' : 'Processing'));
        setIsDetailModalOpen(true);
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Orders/${selectedOrder.id}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(editStatus)
            });

            if (res.ok) {
                alert("Cập nhật trạng thái thành công!");
                setIsDetailModalOpen(false);
                fetchOrders();
            } else {
                alert("Lỗi cập nhật.");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối.");
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này? Thao tác không thể hoàn tác!")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Orders/${orderId}`, {
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

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderId) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Orders/${selectedOrderId}/approve`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ vpsIP, vpsUser, vpsPassword })
            });

            if (res.ok) {
                alert("Duyệt đơn hàng và cấp phát VPS thành công!");
                setIsApproveModalOpen(false);
                fetchOrders();
            } else {
                alert("Lỗi duyệt đơn hàng.");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối.");
        }
    };

    const selectedPlan = servicePlans.find(p => p.id === selectedPlanId);

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
                <button 
                    onClick={openCreateModal}
                    className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                    Thêm đơn hàng
                </button>
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
                    <table className="w-full text-left border-collapse">
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
                                            {isPending && (
                                                <button 
                                                    onClick={() => openApproveModal(order.id)}
                                                    className="px-sm py-xs bg-primary text-on-primary rounded text-[13px] font-medium hover:bg-primary-container transition-colors"
                                                >
                                                    Duyệt cấp VPS
                                                </button>
                                            )}
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

            {/* Modal Xem chi tiết & Sửa */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-scrim/50 z-50 flex items-center justify-center p-md">
                    <div className="bg-surface rounded-2xl p-xl w-full max-w-[600px] shadow-lg border border-outline-variant">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Chi tiết & Cập nhật đơn hàng</h2>
                        
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

                        <form onSubmit={handleUpdateStatus}>
                            <div className="mb-xl">
                                <label className="block text-[14px] text-on-surface-variant mb-1">Cập nhật trạng thái</label>
                                <select 
                                    value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                    className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none font-medium"
                                >
                                    <option value="Pending">Chờ xử lý (Pending)</option>
                                    <option value="Processing">Đang xử lý (Processing)</option>
                                    <option value="Completed">Đã hoàn thành (Completed)</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-sm">
                                <button type="button" onClick={() => setIsDetailModalOpen(false)} className="px-md py-sm bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors">
                                    Đóng
                                </button>
                                <button type="submit" className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tạo đơn hàng */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-scrim/50 z-50 flex items-center justify-center p-md">
                    <div className="bg-surface rounded-2xl p-xl w-full max-w-[500px] shadow-lg border border-outline-variant">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Tạo Đơn hàng mới</h2>
                        <form onSubmit={handleCreateOrder}>
                            <div className="space-y-md mb-xl">
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Khách hàng *</label>
                                    <select 
                                        required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                                    >
                                        <option value="" disabled>-- Chọn khách hàng --</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Dịch vụ (Service Plan) *</label>
                                    <select 
                                        required value={selectedPlanId} 
                                        onChange={e => { setSelectedPlanId(e.target.value); setSelectedPriceId(''); }}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                                    >
                                        <option value="" disabled>-- Chọn dịch vụ --</option>
                                        {servicePlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                {selectedPlan && (
                                    <div>
                                        <label className="block text-[14px] text-on-surface-variant mb-1">Chu kỳ thanh toán (Price) *</label>
                                        <select 
                                            required value={selectedPriceId} onChange={e => setSelectedPriceId(e.target.value)}
                                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                                        >
                                            <option value="" disabled>-- Chọn mức giá --</option>
                                            {selectedPlan.prices?.map((pr: any) => (
                                                <option key={pr.id} value={pr.id}>
                                                    {pr.billingCycle} - {pr.price.toLocaleString('vi-VN')}đ (Phí cài đặt: {pr.setupFee.toLocaleString('vi-VN')}đ)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Ghi chú (Tùy chọn)</label>
                                    <textarea 
                                        value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none min-h-[80px]"
                                        placeholder="Nhập ghi chú cho đơn hàng này..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-sm">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-md py-sm bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">
                                    Lưu đơn hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cấp phát VPS */}
            {isApproveModalOpen && (
                <div className="fixed inset-0 bg-scrim/50 z-50 flex items-center justify-center p-md">
                    <div className="bg-surface rounded-2xl p-xl w-full max-w-[500px] shadow-lg border border-outline-variant">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Cấp phát VPS cho Khách</h2>
                        <form onSubmit={handleApprove}>
                            <div className="space-y-md mb-xl">
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Địa chỉ IP *</label>
                                    <input 
                                        type="text" required
                                        value={vpsIP} onChange={e => setVpsIP(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none" 
                                        placeholder="192.168.1.1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Tài khoản (Username) *</label>
                                    <input 
                                        type="text" required
                                        value={vpsUser} onChange={e => setVpsUser(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] text-on-surface-variant mb-1">Mật khẩu (Password) *</label>
                                    <input 
                                        type="text" required
                                        value={vpsPassword} onChange={e => setVpsPassword(e.target.value)}
                                        className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-sm">
                                <button type="button" onClick={() => setIsApproveModalOpen(false)} className="px-md py-sm bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors">
                                    Hủy
                                </button>
                                <button type="submit" className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors">
                                    Hoàn thành & Duyệt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
