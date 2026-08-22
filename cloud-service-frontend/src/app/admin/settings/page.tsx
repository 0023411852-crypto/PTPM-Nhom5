"use client";

import React, { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5154/api/SiteSettings", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setSettings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key: string, value: string) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            
            // Call API to update each setting sequentially
            for (const setting of settings) {
                await fetch(`http://localhost:5154/api/SiteSettings/${setting.key}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(setting.value)
                });
            }

            alert("Đã lưu Cấu hình Website thành công!");
        } catch (e) {
            console.error(e);
            alert("Đã xảy ra lỗi khi lưu cấu hình.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-xl">
                <div>
                    <h1 className="font-display-sm text-display-sm text-on-surface mb-xs">Cấu hình Hệ thống</h1>
                    <p className="text-on-surface-variant text-[14px]">Quản lý thông tin hiển thị trên Website (Tên, Slogan, Liên hệ...)</p>
                </div>
                <button 
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors flex items-center gap-sm disabled:opacity-70"
                >
                    <span className="material-symbols-outlined text-[20px]">{isSaving ? 'sync' : 'save'}</span>
                    {isSaving ? 'Đang lưu...' : 'Lưu Thay đổi'}
                </button>
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden p-xl space-y-lg">
                {settings.map(setting => (
                    <div key={setting.key} className="pb-lg border-b border-outline-variant last:border-0 last:pb-0">
                        <div className="flex flex-col md:flex-row md:items-start gap-md">
                            <div className="w-full md:w-1/3">
                                <h3 className="font-medium text-on-surface text-[15px]">{setting.key}</h3>
                                <p className="text-on-surface-variant text-[13px] mt-1">{setting.description}</p>
                            </div>
                            <div className="w-full md:w-2/3">
                                {setting.key === 'Slogan' ? (
                                    <textarea 
                                        value={setting.value}
                                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                        rows={3}
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        value={setting.value}
                                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {settings.length === 0 && (
                    <div className="text-center py-2xl text-on-surface-variant">
                        Không có dữ liệu cấu hình. Vui lòng kiểm tra lại Backend.
                    </div>
                )}
            </div>
        </div>
    );
}
