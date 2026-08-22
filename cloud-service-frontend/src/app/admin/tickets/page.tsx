"use client";

import React, { useEffect, useState } from 'react';

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5154/api/SupportTickets/all?PageNumber=1&PageSize=50", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setTickets(data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTicket = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/SupportTickets/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSelectedTicket(data);
                setReplyMessage('');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !replyMessage.trim()) return;

        setIsReplying(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5154/api/SupportTickets/${selectedTicket.id}/reply`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ message: replyMessage })
            });

            if (res.ok) {
                await handleSelectTicket(selectedTicket.id); // Reload replies
                setReplyMessage('');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsReplying(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!selectedTicket) return;
        
        if (confirm("Bạn có chắc muốn đóng yêu cầu này?")) {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5154/api/SupportTickets/${selectedTicket.id}/close`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    alert("Đã đóng Ticket!");
                    fetchTickets();
                    setSelectedTicket(null);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-lg h-[calc(100vh-120px)]">
            {/* Ticket List */}
            <div className="w-full lg:w-1/3 bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                <div className="p-md border-b border-outline-variant bg-surface-container-lowest">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Danh sách Yêu cầu</h2>
                </div>
                <div className="overflow-y-auto flex-grow p-sm space-y-sm">
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            onClick={() => handleSelectTicket(ticket.id)}
                            className={`p-md rounded-xl cursor-pointer border transition-colors ${selectedTicket?.id === ticket.id ? 'bg-primary-container border-primary text-primary-on-container' : 'bg-surface border-outline-variant hover:bg-surface-container'}`}
                        >
                            <div className="flex justify-between mb-xs">
                                <h4 className="font-medium text-[15px] truncate pr-2">{ticket.title}</h4>
                                <span className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${ticket.status === 'Open' ? 'bg-warning text-on-warning' : 'bg-success text-on-success'}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-[13px] opacity-80 line-clamp-1">{ticket.description}</p>
                            <p className="text-[11px] opacity-60 mt-2">{new Date(ticket.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Detail & Chat */}
            <div className="w-full lg:w-2/3 bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                {selectedTicket ? (
                    <>
                        <div className="p-lg border-b border-outline-variant bg-surface-container-lowest flex justify-between items-start">
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">{selectedTicket.title}</h2>
                                <p className="text-[14px] text-on-surface-variant">Ticket ID: {selectedTicket.id}</p>
                            </div>
                            {selectedTicket.status === 'Open' && (
                                <button onClick={handleCloseTicket} className="px-sm py-xs bg-error/10 text-error rounded font-medium text-[13px] hover:bg-error/20 transition-colors">
                                    Đóng Ticket
                                </button>
                            )}
                        </div>

                        <div className="flex-grow overflow-y-auto p-lg space-y-md bg-surface-container-lowest/50">
                            {/* Original Message */}
                            <div className="bg-surface border border-outline-variant p-md rounded-xl rounded-tl-none self-start max-w-[80%]">
                                <div className="text-[12px] text-secondary font-medium mb-1">Khách hàng</div>
                                <p className="text-[14px] text-on-surface whitespace-pre-wrap">{selectedTicket.description}</p>
                            </div>

                            {/* Replies */}
                            {selectedTicket.replies?.map((reply: any) => {
                                const isAdminReply = reply.userId !== selectedTicket.customerId;
                                return (
                                <div key={reply.id} className={`p-md rounded-xl max-w-[80%] ${isAdminReply ? 'bg-primary text-on-primary rounded-tr-none self-end ml-auto' : 'bg-surface border border-outline-variant rounded-tl-none self-start'}`}>
                                    <div className={`text-[12px] font-medium mb-1 ${isAdminReply ? 'text-primary-container' : 'text-secondary'}`}>
                                        {isAdminReply ? 'Bạn (Admin)' : 'Khách hàng'}
                                    </div>
                                    <p className="text-[14px] whitespace-pre-wrap">{reply.message}</p>
                                </div>
                                );
                            })}
                        </div>

                        {selectedTicket.status === 'Open' ? (
                            <form onSubmit={handleReply} className="p-md border-t border-outline-variant bg-surface flex gap-sm">
                                <input 
                                    type="text" 
                                    value={replyMessage}
                                    onChange={e => setReplyMessage(e.target.value)}
                                    placeholder="Nhập câu trả lời của bạn..." 
                                    className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-lg p-sm focus:border-primary outline-none"
                                />
                                <button type="submit" disabled={isReplying} className="px-lg py-sm bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50">
                                    Gửi
                                </button>
                            </form>
                        ) : (
                            <div className="p-md border-t border-outline-variant bg-surface-container text-center text-on-surface-variant text-[14px]">
                                Ticket này đã được đóng và không thể trả lời thêm.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-secondary">
                        <p>Chọn một Ticket bên trái để xem và trả lời.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
