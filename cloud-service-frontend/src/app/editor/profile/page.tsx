"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/admin/Modal';

export default function EditorProfilePage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        role: '',
        phone: '',
        avatar: ''
    });

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [activities, setActivities] = useState<{ action: string; timestamp: string }[]>([]);

    const [messageModal, setMessageModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        isError: false
    });

    const showMessage = (title: string, message: string, isError = false) => {
        setMessageModal({ isOpen: true, title, message, isError });
    };

    const fetchMyProfile = async (token: string) => {
        try {
            const res = await fetch('/api/Users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(prev => ({
                    ...prev,
                    fullName: data.fullName || prev.fullName,
                    email: data.email || prev.email,
                    phone: data.phoneNumber || prev.phone,
                    role: data.role || prev.role,
                    avatar: data.avatarUrl || prev.avatar
                }));
                
                // Update localStorage to keep it in sync for other components
                if (data.fullName) localStorage.setItem('fullName', data.fullName);
                if (data.avatarUrl) localStorage.setItem('avatar', data.avatarUrl);
                window.dispatchEvent(new Event('profileUpdated'));
                if (data.role) localStorage.setItem('role', data.role);
            }
        } catch {
            console.error("Failed to fetch profile");
        }
    };

    const fetchActivities = async (token: string) => {
        try {
            const res = await fetch('/api/Users/me/activities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch {
            console.error("Failed to fetch activities");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Use setTimeout to avoid setState in effect warning
            setTimeout(() => {
                fetchMyProfile(token);
                fetchActivities(token);
            }, 0);
        }
    }, []);

    const formatActivity = (action: string) => {
        if (!action) return 'Hoạt động không xác định';
        if (action.includes('LOGIN')) return 'Đăng nhập hệ thống';
        if (action.includes('LOGOUT')) return 'Đăng xuất hệ thống';
        if (action.includes('PASSWORD_CHANGED')) return 'Đổi mật khẩu';
        if (action.includes('ADMIN_LOCK')) return 'Cập nhật trạng thái tài khoản';
        if (action.includes('REGISTER')) return 'Đăng ký tài khoản';
        if (action.includes('PROFILE_UPDATED')) return 'Cập nhật hồ sơ';
        return action;
    };

    const formatIcon = (action: string) => {
        if (!action) return 'info';
        if (action.includes('LOGIN')) return 'login';
        if (action.includes('LOGOUT')) return 'logout';
        if (action.includes('PASSWORD_CHANGED')) return 'key';
        if (action.includes('ADMIN_LOCK')) return 'lock';
        if (action.includes('REGISTER')) return 'person_add';
        if (action.includes('PROFILE_UPDATED')) return 'manage_accounts';
        return 'edit';
    };

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = { 
                fullName: user.fullName || '', 
                email: user.email || '', 
                phoneNumber: user.phone || '',
                avatarUrl: user.avatar || ''
            };
            
            const res = await fetch('/api/Users/me/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showMessage('Thành công', 'Cập nhật hồ sơ thành công!');
                localStorage.setItem('fullName', user.fullName);
                localStorage.setItem('avatar', user.avatar);
                window.dispatchEvent(new Event('profileUpdated'));
                fetchActivities(token);
            } else {
                const errData = await res.json().catch(() => null);
                console.error("Lỗi cập nhật:", errData);
                showMessage('Lỗi', errData?.message || 'Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại thông tin.', true);
            }
        } catch {
            showMessage('Lỗi', 'Lỗi kết nối. Vui lòng thử lại sau.', true);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showMessage('Lỗi đổi mật khẩu', 'Mật khẩu mới và xác nhận mật khẩu không khớp!', true);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('/api/Users/me/password', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });

            const data = await res.json();
            if (res.ok) {
                showMessage('Thành công', 'Đổi mật khẩu thành công!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // Fetch activities again to show the password change event
                fetchActivities(token);
            } else {
                showMessage('Lỗi đổi mật khẩu', data.message || 'Lỗi khi đổi mật khẩu.', true);
            }
        } catch {
            showMessage('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', true);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        if (!token) {
            showMessage('Lỗi', 'Vui lòng đăng nhập lại.', true);
            return;
        }

        // Tạo local preview URL ngay lập tức cho trải nghiệm nhanh
        const localPreviewUrl = URL.createObjectURL(file);
        setUser(prev => ({ ...prev, avatar: localPreviewUrl }));

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch('/api/Upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    setUser(prev => ({ ...prev, avatar: data.url }));
                }
            } else {
                showMessage('Lỗi', 'Không thể tải ảnh lên máy chủ. Vui lòng thử lại.', true);
            }
        } catch {
            showMessage('Lỗi', 'Lỗi mạng khi tải ảnh lên.', true);
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg pb-xl">
            <div className="flex justify-between items-end mb-lg">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Thông tin cá nhân</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Quản lý hồ sơ và bảo mật tài khoản quản trị viên</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                {/* Cột trái: Avatar & Tóm tắt */}
                <div className="lg:col-span-1">
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg flex flex-col items-center text-center">
                        <label className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-low mb-md relative group cursor-pointer block bg-surface-variant">
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} onClick={(e) => (e.target as HTMLInputElement).value = ''} />
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'Admin')}&background=random`} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'Admin')}&background=random`;
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20 lg:bg-black/40 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </label>
                        <h3 className="font-headline-md text-[20px] font-semibold text-on-surface">{user.fullName}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{user.email}</p>
                        <span className="mt-md px-3 py-1 bg-primary-container text-on-primary-container font-label-caps text-[12px] rounded uppercase tracking-wider">{user.role}</span>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg mt-lg">
                        <h4 className="font-body-md font-semibold text-on-surface mb-md">Hoạt động gần đây</h4>
                        <div className="space-y-md relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-outline-variant/50 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {activities.map((act: any, idx: number) => (
                                <div key={act.id || idx} className="flex gap-md relative">
                                    <div className="w-6 h-6 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 z-10 ring-4 ring-surface">
                                        <span className="material-symbols-outlined text-[14px]">
                                            {formatIcon(act.action)}
                                        </span>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-body-sm text-body-sm text-on-surface truncate" title={act.details}>{formatActivity(act.action)}</p>
                                        <p className="font-body-sm text-[12px] text-on-surface-variant">{new Date(act.timestamp).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && <p className="text-sm text-on-surface-variant pl-8">Chưa có hoạt động nào</p>}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Form cập nhật */}
                <div className="lg:col-span-2 space-y-lg">
                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-md border-b border-outline-variant pb-sm">Chỉnh sửa hồ sơ</h3>
                        <form className="space-y-md mt-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                <div>
                                    <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Họ và tên</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                        value={user.fullName || ''} 
                                        onChange={(e) => setUser({...user, fullName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Số điện thoại</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                        value={user.phone || ''} 
                                        onChange={(e) => setUser({...user, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Địa chỉ Email</label>
                                <input type="email" className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] px-[12px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" value={user.email || ''} disabled />
                                <p className="text-[12px] text-on-surface-variant mt-1">Không thể thay đổi email đăng nhập hệ thống.</p>
                            </div>
                            <div className="flex justify-end pt-sm border-t border-outline-variant mt-lg">
                                <button type="button" onClick={handleProfileUpdate} className="px-lg py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface mb-md border-b border-outline-variant pb-sm">Đổi mật khẩu</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-md mt-md">
                            <div>
                                <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Mật khẩu hiện tại</label>
                                <div className="relative">
                                    <input 
                                        type={showCurrentPassword ? "text" : "password"} 
                                        value={oldPassword}
                                        onChange={e => setOldPassword(e.target.value)}
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                        placeholder="••••••••" 
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                <div>
                                    <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Mật khẩu mới</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                            placeholder="••••••••" 
                                            required minLength={6}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label-caps text-[12px] text-on-surface-variant mb-[8px] uppercase">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-[10px] pl-[12px] pr-[40px] font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all" 
                                            placeholder="••••••••" 
                                            required minLength={6}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-sm border-t border-outline-variant mt-lg">
                                <button type="submit" className="px-lg py-sm border border-outline-variant text-on-surface rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-container-low transition-colors flex items-center gap-sm">
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Message Modal */}
            <Modal
                isOpen={messageModal.isOpen}
                onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
                title={messageModal.title}
                maxWidth="max-w-[28rem]"
                footer={
                    <button 
                        onClick={() => setMessageModal(prev => ({ ...prev, isOpen: false }))} 
                        className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                    >
                        Đóng
                    </button>
                }
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${messageModal.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        <span className="material-symbols-outlined text-[32px]">
                            {messageModal.isError ? 'error' : 'check_circle'}
                        </span>
                    </div>
                    <p className="text-on-surface font-body-md">{messageModal.message}</p>
                </div>
            </Modal>
        </div>
    );
}
