"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/components/admin/Modal';
import { useRouter } from 'next/navigation';

type Category = {
    id: string;
    name: string;
};

type Price = {
    id?: string;
    billingCycle: string;
    price: number;
    setupFee: number;
    isActive: boolean;
};

type ServicePlan = {
    id: string;
    name: string;
    description: string;
    specifications: string;
    isActive: boolean;
    category: Category;
    prices: Price[];
};

export default function AdminServicesPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<ServicePlan[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Data states
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);

    // Message Modal state
    const [messageModal, setMessageModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        isError: false
    });

    const showMessage = (title: string, message: string, isError = false) => {
        setMessageModal({ isOpen: true, title, message, isError });
    };

    // Form inputs
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        cpu: '',
        ram: '',
        ssd: '',
        priceMonthly: '',
        priceYearly: '',
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [plansRes, catsRes] = await Promise.all([
                fetch('http://localhost:5154/api/ServicePlans?PageNumber=1&PageSize=100'),
                fetch('http://localhost:5154/api/ServiceCategories?PageNumber=1&PageSize=100')
            ]);
            
            const plansData = await plansRes.json();
            const catsData = await catsRes.json();
            
            if (plansData.data) setPlans(plansData.data);
            if (catsData.data) setCategories(catsData.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to parse specs safely
    const parseSpecs = (specsStr: string) => {
        try { return JSON.parse(specsStr); } catch { return {}; }
    };

    const handleOpenAdd = () => {
        setEditingPlanId(null);
        setFormData({ 
            name: '', 
            categoryId: categories.length > 0 ? categories[0].id : '', 
            description: '',
            cpu: '', 
            ram: '', 
            ssd: '', 
            priceMonthly: '', 
            priceYearly: '',
            isActive: true 
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (plan: ServicePlan) => {
        setEditingPlanId(plan.id);
        const specs = parseSpecs(plan.specifications);
        const priceMonthly = plan.prices?.find(p => p.billingCycle === '1')?.price || '';
        const priceYearly = plan.prices?.find(p => p.billingCycle === '12')?.price || '';

        setFormData({
            name: plan.name,
            categoryId: plan.category?.id || '',
            description: plan.description || '',
            cpu: specs['CPU'] || '',
            ram: specs['RAM'] || '',
            ssd: specs['SSD'] || '',
            priceMonthly: priceMonthly.toString(),
            priceYearly: priceYearly.toString(),
            isActive: plan.isActive
        });
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (id: string) => {
        setPlanToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.categoryId || !formData.priceMonthly) {
            showMessage('Thiếu thông tin', 'Vui lòng điền Tên, Danh mục và Giá tháng!', true);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            showMessage('Lỗi xác thực', 'Vui lòng đăng nhập lại!', true);
            return;
        }

        const prices = [];
        if (formData.priceMonthly) {
            prices.push({ billingCycle: "1", price: parseFloat(formData.priceMonthly) });
        }
        if (formData.priceYearly) {
            prices.push({ billingCycle: "12", price: parseFloat(formData.priceYearly) });
        }

        const payload = {
            name: formData.name,
            categoryId: formData.categoryId,
            description: formData.description,
            specifications: JSON.stringify({
                CPU: formData.cpu,
                RAM: formData.ram,
                SSD: formData.ssd
            }),
            isActive: formData.isActive,
            prices: prices
        };

        try {
            const url = editingPlanId 
                ? `http://localhost:5154/api/ServicePlans/${editingPlanId}`
                : `http://localhost:5154/api/ServicePlans`;
                
            const method = editingPlanId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showMessage('Thành công', 'Lưu thành công!');
                setIsFormModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                showMessage('Đã có lỗi xảy ra', data.message || "Đã có lỗi xảy ra!", true);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            showMessage('Lỗi', 'Lỗi kết nối máy chủ!', true);
        }
    };

    const handleDelete = async () => {
        if (!planToDelete) return;
        
        const token = localStorage.getItem("token");
        
        try {
            const res = await fetch(`http://localhost:5154/api/ServicePlans/${planToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setIsDeleteModalOpen(false);
                setPlanToDelete(null);
                showMessage('Thành công', 'Đã xóa dịch vụ thành công!');
                fetchData();
            } else {
                showMessage('Lỗi', 'Không thể xóa dịch vụ này!', true);
            }
        } catch (error) {
            showMessage('Lỗi', 'Lỗi kết nối máy chủ!', true);
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg pb-xl">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Quản lý Dịch vụ & Máy chủ</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">Cấu hình các gói VPS, Cloud Server và bảng giá</p>
                </div>
                <div className="flex gap-sm">
                    <button 
                        onClick={handleOpenAdd}
                        className="px-md py-sm bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Thêm gói mới
                    </button>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant text-outline font-label-caps text-label-caps bg-surface-container-low/50">
                                <th className="py-sm px-md font-semibold">Tên dịch vụ</th>
                                <th className="py-sm px-md font-semibold">Danh mục</th>
                                <th className="py-sm px-md font-semibold">Cấu hình</th>
                                <th className="py-sm px-md font-semibold text-right">Giá gốc (Tháng)</th>
                                <th className="py-sm px-md font-semibold">Trạng thái</th>
                                <th className="py-sm px-md font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-lg text-center text-on-surface-variant font-body-sm">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : plans.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-lg text-center text-on-surface-variant font-body-sm">
                                        Không có dịch vụ nào.
                                    </td>
                                </tr>
                            ) : (
                                plans.map((plan) => {
                                    const specs = parseSpecs(plan.specifications);
                                    const priceObj = plan.prices?.find(p => p.billingCycle === '1');
                                    const price = priceObj ? priceObj.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ';
                                    
                                    return (
                                        <tr key={plan.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                                            <td className="py-md px-md">
                                                <p className="font-body-md text-body-md text-on-surface font-medium">{plan.name}</p>
                                            </td>
                                            <td className="py-md px-md">
                                                <span className="font-label-caps text-[10px] bg-primary-container/20 text-primary px-unit py-[2px] rounded uppercase">
                                                    {plan.category?.name || 'Chưa phân loại'}
                                                </span>
                                            </td>
                                            <td className="py-md px-md">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">memory</span> CPU: {specs['CPU'] || '-'}</span>
                                                    <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">memory_alt</span> RAM: {specs['RAM'] || '-'}</span>
                                                    <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">hard_drive</span> SSD: {specs['SSD'] || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-md px-md text-right">
                                                <p className="font-code-md text-body-md text-on-surface font-medium">{price}</p>
                                            </td>
                                            <td className="py-md px-md">
                                                <span className={`font-body-sm text-body-sm flex items-center gap-xs ${
                                                    plan.isActive ? 'text-primary' : 'text-error'
                                                }`}>
                                                    <span className="w-2 h-2 rounded-full currentColor bg-current block"></span>
                                                    {plan.isActive ? 'Đang bán' : 'Tạm ngưng'}
                                                </span>
                                            </td>
                                            <td className="py-md px-md text-right space-x-2">
                                                <button 
                                                    onClick={() => handleOpenEdit(plan)}
                                                    className="p-1 text-on-surface-variant hover:text-primary transition-colors tooltip" 
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDelete(plan.id)}
                                                    className="p-1 text-on-surface-variant hover:text-error transition-colors tooltip" 
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal (Add/Edit) */}
            <Modal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                title={editingPlanId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                footer={
                    <>
                        <button 
                            onClick={() => setIsFormModalOpen(false)}
                            className="px-md py-sm rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-md py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm"
                        >
                            Lưu thông tin
                        </button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-md font-body-sm">
                    <div className="col-span-2">
                        <label className="block text-on-surface-variant mb-1">Tên dịch vụ *</label>
                        <input 
                            type="text" 
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-on-surface-variant mb-1">Mô tả hiển thị</label>
                        <input 
                            type="text" 
                            placeholder="VD: Gói Cloud VPS phổ biến..."
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">Danh mục *</label>
                        <select 
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">Trạng thái</label>
                        <select 
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                            value={formData.isActive ? "true" : "false"}
                            onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})}
                        >
                            <option value="true">Đang bán</option>
                            <option value="false">Tạm ngưng</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">CPU</label>
                        <input 
                            type="text" 
                            placeholder="VD: 2 Core"
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                            value={formData.cpu}
                            onChange={(e) => setFormData({...formData, cpu: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">RAM</label>
                        <input 
                            type="text" 
                            placeholder="VD: 2GB"
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                            value={formData.ram}
                            onChange={(e) => setFormData({...formData, ram: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">SSD / Lưu trữ</label>
                        <input 
                            type="text" 
                            placeholder="VD: 40GB"
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                            value={formData.ssd}
                            onChange={(e) => setFormData({...formData, ssd: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-on-surface-variant mb-1">Giá (VNĐ/Tháng) *</label>
                        <input 
                            type="number" 
                            placeholder="VD: 199000"
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                            value={formData.priceMonthly}
                            onChange={(e) => setFormData({...formData, priceMonthly: e.target.value})}
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-on-surface-variant mb-1">Giá (VNĐ/Năm) (Tùy chọn, giảm 20%)</label>
                        <input 
                            type="number" 
                            placeholder="VD: 1990000"
                            className="w-full bg-surface border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                            value={formData.priceYearly}
                            onChange={(e) => setFormData({...formData, priceYearly: e.target.value})}
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)}
                title="Xác nhận xóa"
                footer={
                    <>
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-md py-sm rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="px-md py-sm bg-error text-on-error rounded-lg font-medium hover:bg-error/90 transition-colors shadow-sm flex items-center gap-xs"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Xóa vĩnh viễn
                        </button>
                    </>
                }
            >
                <div className="flex gap-md items-start text-on-surface">
                    <div className="bg-error-container text-error rounded-full p-2 flex-shrink-0">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                        <p className="font-body-md mb-2">Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
                        <p className="font-body-sm text-on-surface-variant">Hành động này không thể hoàn tác. Dịch vụ sẽ bị xóa hoàn toàn khỏi hệ thống.</p>
                    </div>
                </div>
            </Modal>

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
