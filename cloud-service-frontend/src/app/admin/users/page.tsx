"use client";

import React, { useEffect, useState } from 'react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        fullName: '',
        password: '',
        roleName: 'Customer'
    });

    const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
    const [selectedUserActivities, setSelectedUserActivities] = useState<any[]>([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [loadingActivities, setLoadingActivities] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [pageNumber]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Bạn có chắc muốn ${currentStatus ? 'Khóa' : 'Mở khóa'} tài khoản này?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users/${userId}/status`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi cập nhật trạng thái.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleScheduleDelete = async (userId: string) => {
        if (!confirm('Bạn có chắc muốn xóa tài khoản này? (Tài khoản sẽ bị xóa hoàn toàn sau 3 ngày)')) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi xóa tài khoản.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancelDelete = async (userId: string) => {
        if (!confirm('Bạn muốn hủy yêu cầu xóa tài khoản này?')) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users/${userId}/cancel-delete`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi hủy xóa tài khoản.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAssignRole = async (userId: string, newRole: string) => {
        if (!confirm(`Xác nhận đổi quyền thành ${newRole}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users/${userId}/role`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(newRole)
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi cấp quyền.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(newUser)
            });

            if (res.ok) {
                alert("Tạo người dùng thành công!");
                setIsModalOpen(false);
                setNewUser({ email: '', fullName: '', password: '', roleName: 'Customer' });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.message || "Lỗi tạo người dùng.");
            }
        } catch (e) {
            alert("Đã xảy ra lỗi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewActivities = async (userId: string, userName: string) => {
        setSelectedUserName(userName);
        setIsActivitiesModalOpen(true);
        setLoadingActivities(true);
        setSelectedUserActivities([]);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/Users/${userId}/activities`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedUserActivities(data);
            } else {
                alert('Không thể tải nhật ký hoạt động.');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối.');
        } finally {
            setLoadingActivities(false);
        }
    };

    const formatActivity = (action: string) => {
        if (!action) return 'Hoạt động không xác định';
        if (action.includes('LOGIN')) return 'Đăng nhập hệ thống';
        if (action.includes('LOGOUT')) return 'Đăng xuất hệ thống';
        if (action.includes('PASSWORD_CHANGED')) return 'Đổi mật khẩu';
        if (action.includes('ADMIN_LOCK')) return 'Cập nhật trạng thái tài khoản';
        if (action.includes('REGISTER')) return 'Đăng ký tài khoản';
        if (action.includes('ORDER_PLACED')) return 'Khởi tạo đơn hàng';
        if (action.includes('TICKET_CREATED')) return 'Gửi yêu cầu hỗ trợ';
        return action;
    };

    const formatIcon = (action: string) => {
        if (!action) return 'info';
        if (action.includes('LOGIN')) return 'login';
        if (action.includes('LOGOUT')) return 'logout';
        if (action.includes('PASSWORD_CHANGED')) return 'key';
        if (action.includes('ADMIN_LOCK')) return 'lock';
        if (action.includes('REGISTER')) return 'person_add';
        if (action.includes('ORDER_PLACED')) return 'shopping_cart';
        if (action.includes('TICKET_CREATED')) return 'support_agent';
        return 'edit';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-xl">
                <div>
                    <h1 className="font-display-sm text-display-sm text-on-surface mb-xs">Quản lý Người dùng</h1>
                    <p className="text-on-surface-variant text-[14px]">Phân quyền và quản lý trạng thái tài khoản hệ thống.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-sm bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-container transition-colors font-medium text-[14px]"
                >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Thêm người dùng
                </button>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-md font-medium text-on-surface text-[14px]">Tên / Email</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Quyền (Role)</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Trạng thái</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Ngày tạo</th>
                                <th className="p-md font-medium text-on-surface text-[14px] text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-xl text-center text-on-surface-variant">Đang tải...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-xl text-center text-on-surface-variant">Không có dữ liệu.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="p-md">
                                            <div className="font-medium text-on-surface">{user.fullName}</div>
                                            <div className="text-[13px] text-on-surface-variant">{user.email}</div>
                                        </td>
                                        <td className="p-md">
                                            <select 
                                                value={user.roleName || "Customer"} 
                                                onChange={(e) => handleAssignRole(user.id, e.target.value)}
                                                className={`text-[13px] font-medium px-2 py-1 rounded-md outline-none border ${
                                                    user.roleName === 'Admin' ? 'bg-primary-container text-on-primary-container border-transparent' : 
                                                    user.roleName === 'Editor' ? 'bg-tertiary-container text-on-tertiary-container border-transparent' :
                                                    'bg-surface-container text-on-surface border-outline-variant'
                                                }`}
                                            >
                                                <option value="Customer">Customer</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-md">
                                            {user.pendingDeletionAt ? (
                                                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#f57c00] bg-[#f57c00]/10 px-2 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00]"></span> Chờ xóa
                                                </span>
                                            ) : user.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#00c853] bg-[#00c853]/10 px-2 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c853]"></span> Hoạt động
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-error bg-error-container px-2 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Đã khóa
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-md text-[14px] text-on-surface-variant">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="p-md text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {user.pendingDeletionAt ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[12px] text-error font-medium">
                                                            Sẽ xóa sau {Math.max(0, 3 - Math.floor((new Date().getTime() - new Date(user.pendingDeletionAt).getTime()) / (1000 * 3600 * 24)))} ngày
                                                        </span>
                                                        <button 
                                                            onClick={() => handleCancelDelete(user.id)}
                                                            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors text-primary bg-primary-container hover:bg-primary/20"
                                                        >
                                                            Hủy xóa
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleViewActivities(user.id, user.fullName)}
                                                            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors text-secondary hover:bg-secondary-container flex items-center gap-1"
                                                            title="Xem hoạt động"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">history</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                            className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                                                user.isActive 
                                                                    ? 'text-on-surface-variant hover:bg-surface-container' 
                                                                    : 'text-primary hover:bg-primary-container'
                                                            }`}
                                                        >
                                                            {user.isActive ? 'Khóa TK' : 'Mở Khóa'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleScheduleDelete(user.id)}
                                                            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors text-error hover:bg-error-container"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-md border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <span className="text-[14px] text-on-surface-variant">Trang {pageNumber} / {totalPages}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber === 1 || loading}
                            className="px-3 py-1 bg-surface border border-outline-variant rounded-md text-[14px] font-medium hover:bg-surface-container disabled:opacity-50 transition-colors"
                        >
                            Trang trước
                        </button>
                        <button 
                            onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                            disabled={pageNumber === totalPages || loading}
                            className="px-3 py-1 bg-surface border border-outline-variant rounded-md text-[14px] font-medium hover:bg-surface-container disabled:opacity-50 transition-colors"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Thêm người dùng */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-surface rounded-2xl w-full max-w-[500px] shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center p-md border-b border-outline-variant">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">Thêm người dùng mới</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-md space-y-md">
                            <div>
                                <label className="block text-[14px] font-medium text-on-surface mb-1">Email *</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-on-surface mb-1">Họ và tên *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newUser.fullName}
                                    onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                                    className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-on-surface mb-1">Mật khẩu *</label>
                                <input 
                                    type="password" 
                                    required 
                                    minLength={6}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-medium text-on-surface mb-1">Quyền (Role)</label>
                                <select 
                                    value={newUser.roleName}
                                    onChange={(e) => setNewUser({...newUser, roleName: e.target.value})}
                                    className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none"
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-sm mt-lg">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-medium hover:bg-surface-container"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Xem hoạt động */}
            {isActivitiesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-surface rounded-2xl w-full max-w-[600px] shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-md border-b border-outline-variant shrink-0">
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">Nhật ký hoạt động</h2>
                                <p className="text-[14px] text-on-surface-variant">Tài khoản: <span className="font-medium text-on-surface">{selectedUserName}</span></p>
                            </div>
                            <button onClick={() => setIsActivitiesModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-md overflow-y-auto custom-scrollbar flex-grow">
                            {loadingActivities ? (
                                <div className="text-center py-xl text-on-surface-variant">Đang tải nhật ký...</div>
                            ) : selectedUserActivities.length === 0 ? (
                                <div className="text-center py-xl text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">history_toggle_off</span>
                                    Không có hoạt động nào được ghi nhận.
                                </div>
                            ) : (
                                <div className="space-y-md relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-outline-variant/50 ml-2">
                                    {selectedUserActivities.map((act: any, idx: number) => (
                                        <div key={act.id || idx} className="flex gap-md relative">
                                            <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 z-10 ring-4 ring-surface">
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {formatIcon(act.action)}
                                                </span>
                                            </div>
                                            <div className="overflow-hidden bg-surface-container-lowest border border-outline-variant rounded-xl p-3 w-full shadow-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-medium text-[14px] text-on-surface">{formatActivity(act.action)}</p>
                                                    <p className="text-[12px] text-on-surface-variant whitespace-nowrap ml-2">
                                                        {new Date(act.timestamp).toLocaleString('vi-VN')}
                                                    </p>
                                                </div>
                                                <p className="text-[13px] text-on-surface-variant font-code-sm truncate" title={act.details}>
                                                    {act.details || act.action}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
