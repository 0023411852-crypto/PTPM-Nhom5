"use client";

import React, { useEffect, useState } from 'react';

type AuditLog = {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    entityName: string;
    entityId: string;
    timestamp: string;
    details: string;
};

export default function AdminAuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;
    
    // Filters
    const [filterAction, setFilterAction] = useState('');
    const [filterEntity, setFilterEntity] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [pageNumber, filterAction, filterEntity]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let url = `/api/AuditLogs?page=${pageNumber}&pageSize=${pageSize}`;
            if (filterAction) url += `&action=${encodeURIComponent(filterAction)}`;
            if (filterEntity) url += `&entity=${encodeURIComponent(filterEntity)}`;
            
            const res = await fetch(url, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data.items || []);
                setTotalCount(data.totalCount || 0);
                setTotalPages(Math.ceil((data.totalCount || 0) / pageSize));
            } else if (res.status === 403) {
                alert('Bạn không có quyền truy cập nhật ký hệ thống.');
            }
        } catch (e) {
            console.error("Failed to fetch audit logs", e);
        } finally {
            setLoading(false);
        }
    };

    const formatAction = (action: string) => {
        if (!action) return 'Không xác định';
        if (action.includes('LOGIN')) return 'Đăng nhập';
        if (action.includes('LOGOUT')) return 'Đăng xuất';
        if (action.includes('PASSWORD_CHANGED')) return 'Đổi mật khẩu';
        if (action.includes('PRICE_UPDATED')) return 'Cập nhật giá';
        if (action.includes('ADMIN_LOCK')) return 'Khóa tài khoản';
        if (action.includes('REGISTER')) return 'Đăng ký';
        if (action.includes('ORDER_PLACED')) return 'Tạo đơn hàng';
        if (action.includes('TICKET_CREATED')) return 'Tạo yêu cầu hỗ trợ';
        return action;
    };

    const formatEntity = (entity: string) => {
        if (!entity) return '-';
        const entityMap: { [key: string]: string } = {
            'User': 'Người dùng',
            'ServicePlan': 'Gói dịch vụ',
            'PlanPrice': 'Bảng giá',
            'OrderRequest': 'Đơn hàng',
            'SupportTicket': 'Yêu cầu hỗ trợ',
            'Promotion': 'Khuyến mãi',
            'Article': 'Bài viết',
            'Category': 'Danh mục'
        };
        return entityMap[entity] || entity;
    };

    const getActionColor = (action: string) => {
        if (action.includes('LOGIN')) return 'text-[#00c853] bg-[#00c853]/10';
        if (action.includes('LOGOUT')) return 'text-[#ff9800] bg-[#ff9800]/10';
        if (action.includes('PASSWORD_CHANGED')) return 'text-[#2196f3] bg-[#2196f3]/10';
        if (action.includes('PRICE_UPDATED')) return 'text-[#9c27b0] bg-[#9c27b0]/10';
        if (action.includes('ADMIN_LOCK')) return 'text-error bg-error-container';
        if (action.includes('REGISTER')) return 'text-[#4caf50] bg-[#4caf50]/10';
        if (action.includes('ORDER_PLACED')) return 'text-[#e91e63] bg-[#e91e63]/10';
        if (action.includes('TICKET_CREATED')) return 'text-[#ff5722] bg-[#ff5722]/10';
        return 'text-on-surface-variant bg-surface-container';
    };

    const maskSensitiveData = (details: string) => {
        if (!details) return '-';
        // Mask passwords, tokens, secrets
        return details
            .replace(/"password":"[^"]*"/g, '"password":"***"')
            .replace(/"token":"[^"]*"/g, '"token":"***"')
            .replace(/"secret":"[^"]*"/g, '"secret":"***"')
            .replace(/"apiKey":"[^"]*"/g, '"apiKey":"***"')
            .replace(/"sshKey":"[^"]*"/g, '"sshKey":"***"')
            .replace(/Bearer [A-Za-z0-9\-._~+/]+/g, 'Bearer ***');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-xl">
                <div>
                    <h1 className="font-display-sm text-display-sm text-on-surface mb-xs">Nhật ký hệ thống</h1>
                    <p className="text-on-surface-variant text-[14px]">Theo dõi hoạt động và thay đổi trong hệ thống.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-surface rounded-xl border border-outline-variant p-md mb-lg flex gap-md items-end">
                <div className="flex-1">
                    <label className="block text-[13px] font-medium text-on-surface mb-1">Lọc theo hành động</label>
                    <select 
                        value={filterAction}
                        onChange={(e) => { setFilterAction(e.target.value); setPageNumber(1); }}
                        className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none bg-surface"
                    >
                        <option value="">Tất cả hành động</option>
                        <option value="LOGIN">Đăng nhập</option>
                        <option value="LOGOUT">Đăng xuất</option>
                        <option value="PASSWORD_CHANGED">Đổi mật khẩu</option>
                        <option value="PRICE_UPDATED">Cập nhật giá</option>
                        <option value="ADMIN_LOCK">Khóa tài khoản</option>
                        <option value="REGISTER">Đăng ký</option>
                        <option value="ORDER_PLACED">Tạo đơn hàng</option>
                        <option value="TICKET_CREATED">Tạo yêu cầu hỗ trợ</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-[13px] font-medium text-on-surface mb-1">Lọc theo đối tượng</label>
                    <select 
                        value={filterEntity}
                        onChange={(e) => { setFilterEntity(e.target.value); setPageNumber(1); }}
                        className="w-full border border-outline-variant rounded-lg p-2 text-[14px] focus:border-primary outline-none bg-surface"
                    >
                        <option value="">Tất cả đối tượng</option>
                        <option value="User">Người dùng</option>
                        <option value="ServicePlan">Gói dịch vụ</option>
                        <option value="PlanPrice">Bảng giá</option>
                        <option value="OrderRequest">Đơn hàng</option>
                        <option value="SupportTicket">Yêu cầu hỗ trợ</option>
                        <option value="Promotion">Khuyến mãi</option>
                        <option value="Article">Bài viết</option>
                        <option value="Category">Danh mục</option>
                    </select>
                </div>
                <button 
                    onClick={() => { setFilterAction(''); setFilterEntity(''); setPageNumber(1); }}
                    className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-medium hover:bg-surface-container text-[14px]"
                >
                    Xóa bộ lọc
                </button>
            </div>

            {/* Logs Table */}
            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="p-md font-medium text-on-surface text-[14px]">Thời gian</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Người dùng</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Hành động</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Đối tượng</th>
                                <th className="p-md font-medium text-on-surface text-[14px]">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-xl text-center text-on-surface-variant">Đang tải...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-xl text-center text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">history_toggle_off</span>
                                        Không có dữ liệu nhật ký.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="p-md text-[14px] text-on-surface-variant whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="p-md">
                                            <div className="font-medium text-on-surface text-[14px]">{log.userEmail}</div>
                                            <div className="text-[12px] text-on-surface-variant font-code-sm">{log.userId.slice(0, 8)}...</div>
                                        </td>
                                        <td className="p-md">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[13px] font-medium ${getActionColor(log.action)}`}>
                                                {formatAction(log.action)}
                                            </span>
                                        </td>
                                        <td className="p-md text-[14px] text-on-surface-variant">
                                            {formatEntity(log.entityName)}
                                        </td>
                                        <td className="p-md">
                                            <div className="text-[13px] text-on-surface-variant font-code-sm max-w-[300px] truncate" title={maskSensitiveData(log.details)}>
                                                {maskSensitiveData(log.details)}
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
                    <span className="text-[14px] text-on-surface-variant">
                        Tổng {totalCount} bản ghi • Trang {pageNumber} / {totalPages}
                    </span>
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
        </div>
    );
}
