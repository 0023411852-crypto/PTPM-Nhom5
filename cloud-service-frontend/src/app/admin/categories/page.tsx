'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/admin/Modal';

type Category = {
  id: string;
  name: string;
  description?: string;
  detailTitle?: string;
  icon?: string;
  featuresJson?: string;
  isActive: boolean;
};

type CategoryForm = {
  name: string;
  description: string;
  detailTitle: string;
  icon: string;
  featuresJson: string;
  isActive: boolean;
};

const API_BASE_URL = '/api/ServiceCategories';
const EMPTY_FORM: CategoryForm = { name: '', description: '', detailTitle: '', icon: 'dns', featuresJson: '[]', isActive: true };

export default function AdminServiceCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
      const response = await fetch(`${API_BASE_URL}?PageNumber=1&PageSize=100`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Không thể tải danh mục dịch vụ.');
      const result = await response.json();
      setCategories(Array.isArray(result) ? result : (result.data ?? []));
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
    setForm({
      name: category.name,
      description: category.description ?? '',
      detailTitle: category.detailTitle ?? '',
      icon: category.icon ?? 'dns',
      featuresJson: category.featuresJson ?? '[]',
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
            <label htmlFor="category-features" className="mb-1 block font-body-sm text-on-surface-variant">Tính năng hiển thị (mỗi dòng một tính năng)</label>
            <textarea id="category-features" value={(() => { try { return JSON.parse(form.featuresJson).join('\\n'); } catch { return form.featuresJson; } })()} onChange={(event) => setForm({ ...form, featuresJson: JSON.stringify(event.target.value.split('\\n').map(item => item.trim()).filter(Boolean)) })} className="min-h-24 w-full rounded-lg border border-outline-variant bg-surface p-sm outline-none focus:border-primary" placeholder="SSD/NVMe Storage\\nFree SSL Certificate" />
          </div>
          <label className="flex items-center gap-sm font-body-sm text-on-surface">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
            Đang hoạt động
          </label>
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
