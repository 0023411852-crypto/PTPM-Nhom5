'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/admin/Modal';

type ServiceFeature = {
  id?: string;
  name: string;
  isActive: boolean;
  displayOrder: number;
  isDeleted?: boolean;
};

type Category = {
  id: string;
  name: string;
  description?: string;
  detailTitle?: string;
  icon?: string;
  featuresJson?: string;
  serviceFeatures?: ServiceFeature[];
  isActive: boolean;
};

type ServicePlan = {
  id: string;
  name: string;
  isActive: boolean;
  category?: { id: string };
};

type CategoryForm = {
  name: string;
  description: string;
  detailTitle: string;
  icon: string;
  featuresJson: string;
  serviceFeatures: ServiceFeature[];
  isActive: boolean;
};

const API_BASE_URL = '/api/ServiceCategories';
const EMPTY_FORM: CategoryForm = { name: '', description: '', detailTitle: '', icon: 'dns', featuresJson: '[]', serviceFeatures: [], isActive: true };

export default function AdminServiceCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getToken = () => localStorage.getItem('token');

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const [categoriesRes, plansRes] = await Promise.all([
        fetch(`${API_BASE_URL}?PageNumber=1&PageSize=100`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch('/api/ServicePlans?PageNumber=1&PageSize=100', { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);
      if (!categoriesRes.ok) throw new Error('Không thể tải danh mục dịch vụ.');
      const categoriesResult = await categoriesRes.json();
      setCategories(Array.isArray(categoriesResult) ? categoriesResult : (categoriesResult.data ?? []));
      
      if (plansRes.ok) {
          const plansResult = await plansRes.json();
          setPlans(Array.isArray(plansResult) ? plansResult : (plansResult.data ?? []));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh mục dịch vụ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    let features: ServiceFeature[] = [];
    if (category.serviceFeatures && category.serviceFeatures.length > 0) {
        features = category.serviceFeatures.map(f => ({ ...f, isDeleted: false }));
    } else {
        try {
            const parsed = JSON.parse(category.featuresJson || "[]");
            if (Array.isArray(parsed)) {
                features = parsed.map((name, idx) => ({
                    name: String(name),
                    isActive: true,
                    displayOrder: idx,
                    isDeleted: false
                }));
            }
        } catch {}
    }

    setForm({
      name: category.name,
      description: category.description ?? '',
      detailTitle: category.detailTitle ?? '',
      icon: category.icon ?? 'dns',
      featuresJson: category.featuresJson ?? '[]',
      serviceFeatures: features.sort((a, b) => a.displayOrder - b.displayOrder),
      isActive: category.isActive,
    });
    setError('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Tên danh mục là bắt buộc.');
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          detailTitle: form.detailTitle.trim(),
          icon: form.icon.trim() || 'dns',
          featuresJson: form.featuresJson.trim() || '[]',
          isActive: form.isActive,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Không thể lưu danh mục.');

      const categoryId = editingId || result?.id;
      
      if (categoryId) {
          const promises = form.serviceFeatures.map((feature, idx) => {
            const currentOrder = feature.displayOrder || idx;
            if (feature.isDeleted && feature.id) {
              return fetch(`/api/ServiceFeatures/${feature.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            } else if (!feature.isDeleted) {
              const payload = {
                serviceCategoryId: categoryId,
                name: feature.name,
                isActive: feature.isActive,
                displayOrder: currentOrder
              };
              if (feature.id) {
                return fetch(`/api/ServiceFeatures/${feature.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(payload)
                });
              } else {
                return fetch(`/api/ServiceFeatures`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(payload)
                });
              }
            }
            return Promise.resolve();
          });
          await Promise.all(promises);
      }

      setIsFormOpen(false);
      setMessage(editingId ? 'Đã cập nhật danh mục.' : 'Đã tạo danh mục.');
      await loadCategories();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu danh mục.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const token = getToken();
    if (!token) {
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Không thể xóa danh mục.');

      setIsDeleteOpen(false);
      setDeletingId(null);
      setMessage('Đã xóa danh mục.');
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Không thể xóa danh mục.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-container-max space-y-lg pb-xl">
      <div className="flex flex-col justify-between gap-md sm:flex-row sm:items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Danh mục dịch vụ</h2>
          <p className="mt-unit font-body-sm text-body-sm text-on-surface-variant">Quản lý nhóm dịch vụ dùng cho các gói VPS, Hosting và Cloud.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-sm rounded-lg bg-primary px-md py-sm font-body-sm font-medium text-on-primary shadow-sm hover:bg-primary-container">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm danh mục
        </button>
      </div>

      {message && (
        <div className="flex items-center justify-between rounded-lg border border-tertiary-container/30 bg-tertiary-container/10 px-md py-sm font-body-sm text-tertiary-container">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage('')} aria-label="Đóng thông báo" className="text-lg">×</button>
        </div>
      )}
      {error && !isFormOpen && (
        <div className="flex items-center justify-between rounded-lg border border-error/30 bg-error-container/20 px-md py-sm font-body-sm text-error">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Đóng lỗi" className="text-lg">×</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/50 font-label-caps text-label-caps text-outline">
                <th className="px-md py-sm font-semibold">Tên danh mục</th>
                <th className="px-md py-sm font-semibold">Mô tả</th>
                <th className="px-md py-sm font-semibold">Trạng thái</th>
                <th className="px-md py-sm text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-2xl text-center font-body-sm text-on-surface-variant">Đang tải danh mục...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="py-2xl text-center font-body-sm text-on-surface-variant">Chưa có danh mục nào.</td></tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low">
                  <td className="px-md py-md font-body-md font-medium text-on-surface">{category.name}</td>
                  <td className="max-w-[34rem] px-md py-md font-body-sm text-on-surface-variant">{category.description || '—'}</td>
                  <td className="px-md py-md">
                    <span className={`inline-flex items-center gap-xs font-body-sm ${category.isActive ? 'text-primary' : 'text-error'}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {category.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="space-x-sm px-md py-md text-right">
                    <button type="button" onClick={() => openEdit(category)} className="p-1 text-on-surface-variant hover:text-primary" title="Chỉnh sửa">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button type="button" onClick={() => { setDeletingId(category.id); setIsDeleteOpen(true); }} className="p-1 text-on-surface-variant hover:text-error" title="Xóa">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'} footer={null}>
        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label htmlFor="category-name" className="mb-1 block font-body-sm text-on-surface-variant">Tên danh mục *</label>
            <input id="category-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface p-sm outline-none focus:border-primary" maxLength={100} required />
          </div>
          <div>
            <label htmlFor="category-description" className="mb-1 block font-body-sm text-on-surface-variant">Mô tả</label>
            <textarea id="category-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 w-full rounded-lg border border-outline-variant bg-surface p-sm outline-none focus:border-primary" maxLength={500} />
          </div>
          <div>
            <label htmlFor="category-detail-title" className="mb-1 block font-body-sm text-on-surface-variant">Tiêu đề trang chi tiết</label>
            <input id="category-detail-title" value={form.detailTitle} onChange={(event) => setForm({ ...form, detailTitle: event.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface p-sm outline-none focus:border-primary" maxLength={200} placeholder="Ví dụ: Web Hosting ổn định, dễ quản lý" />
          </div>
          <div>
            <label htmlFor="category-icon" className="mb-1 block font-body-sm text-on-surface-variant">Material icon</label>
            <input id="category-icon" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} className="w-full rounded-lg border border-outline-variant bg-surface p-sm outline-none focus:border-primary" maxLength={50} placeholder="web, dns, mail..." />
          </div>
          
          <div>
            <label className="mb-1 block font-body-sm text-on-surface-variant">Tính năng nổi bật (Service Features)</label>
            <div className="space-y-sm">
              {form.serviceFeatures.filter(f => !f.isDeleted).map((feature) => {
                const actualIndex = form.serviceFeatures.indexOf(feature);
                return (
                  <div key={actualIndex} className="flex items-center gap-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant">
                    <span className="material-symbols-outlined text-outline cursor-move">drag_indicator</span>
                    <input 
                      type="text" 
                      value={feature.name} 
                      onChange={(e) => {
                        const newFeatures = [...form.serviceFeatures];
                        newFeatures[actualIndex].name = e.target.value;
                        setForm({...form, serviceFeatures: newFeatures});
                      }}
                      className="flex-grow rounded bg-surface p-xs outline-none border border-outline-variant focus:border-primary text-sm"
                      placeholder="Tên tính năng..."
                      required
                    />
                    <label className="flex items-center gap-xs text-sm">
                      <input 
                        type="checkbox" 
                        checked={feature.isActive}
                        onChange={(e) => {
                          const newFeatures = [...form.serviceFeatures];
                          newFeatures[actualIndex].isActive = e.target.checked;
                          setForm({...form, serviceFeatures: newFeatures});
                        }}
                      />
                      Hiện
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newFeatures = [...form.serviceFeatures];
                        if (newFeatures[actualIndex].id) {
                           newFeatures[actualIndex].isDeleted = true;
                        } else {
                           newFeatures.splice(actualIndex, 1);
                        }
                        setForm({...form, serviceFeatures: newFeatures});
                      }} 
                      className="text-error hover:bg-error-container p-xs rounded"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
            <button 
              type="button"
              onClick={() => {
                setForm({
                  ...form, 
                  serviceFeatures: [...form.serviceFeatures, { name: '', isActive: true, displayOrder: form.serviceFeatures.length }]
                });
              }}
              className="mt-sm text-sm text-primary flex items-center gap-xs hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm tính năng
            </button>
          </div>

          <label className="flex items-center gap-sm font-body-sm text-on-surface">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
            Đang hoạt động
          </label>

          {editingId && (
            <div className="mt-lg border-t border-outline-variant pt-4">
              <label className="mb-2 block font-body-sm text-on-surface-variant font-semibold">Các gói dịch vụ thuộc danh mục này</label>
              <div className="bg-surface-container-low rounded-lg border border-outline-variant p-3 max-h-40 overflow-y-auto">
                {plans.filter(p => p.category?.id === editingId).length > 0 ? (
                  <ul className="space-y-2">
                    {plans.filter(p => p.category?.id === editingId).map(plan => (
                      <li key={plan.id} className="flex justify-between items-center text-sm bg-surface p-2 rounded border border-outline-variant">
                        <span className="font-medium">{plan.name}</span>
                        <span className={`text-[12px] ${plan.isActive ? 'text-primary' : 'text-error'}`}>{plan.isActive ? 'Đang bán' : 'Tạm ngưng'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-on-surface-variant text-center py-2">Chưa có gói dịch vụ nào.</p>
                )}
              </div>
              <p className="text-[12px] text-on-surface-variant mt-2 italic">
                * Lưu ý: Để thêm, sửa, hoặc xóa gói dịch vụ khỏi danh mục này, vui lòng truy cập menu <a href="/admin/services" className="text-primary hover:underline font-medium">Gói Dịch Vụ</a> ở menu bên trái.
              </p>
            </div>
          )}

          {error && <p className="font-body-sm text-error">{error}</p>}
          <div className="flex justify-end gap-sm border-t border-outline-variant pt-md">
            <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg px-md py-sm font-medium text-on-surface hover:bg-surface-container">Hủy</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-md py-sm font-medium text-on-primary disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu danh mục'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Xóa danh mục" footer={null}>
        <div className="space-y-lg">
          <p className="font-body-md text-on-surface">Bạn có chắc muốn xóa danh mục này không? Nếu danh mục đang được gói dịch vụ sử dụng, API sẽ từ chối thao tác.</p>
          {error && <p className="font-body-sm text-error">{error}</p>}
          <div className="flex justify-end gap-sm border-t border-outline-variant pt-md">
            <button type="button" onClick={() => setIsDeleteOpen(false)} className="rounded-lg px-md py-sm font-medium text-on-surface hover:bg-surface-container">Hủy</button>
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-lg bg-error px-md py-sm font-medium text-on-error disabled:opacity-50">{saving ? 'Đang xóa...' : 'Xóa danh mục'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
