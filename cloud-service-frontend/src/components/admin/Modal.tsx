import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-[32rem]' }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-sm p-gutter animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className={`bg-surface w-full ${maxWidth} rounded-xl shadow-lg border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-md border-b border-outline-variant">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-md overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-md border-t border-outline-variant bg-surface-container-lowest/50 flex justify-end gap-sm">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
