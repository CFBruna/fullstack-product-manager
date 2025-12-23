import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const baseStyles = "fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg border-l-4 transition-all transform translate-y-0 opacity-100 z-50 min-w-[300px]";
    const typeStyles = type === 'success'
        ? "bg-white border-green-500 text-gray-800"
        : "bg-white border-red-500 text-gray-800";

    return (
        <div className={`${baseStyles} ${typeStyles}`}>
            <div className="flex-shrink-0 mr-3">
                {type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                )}
            </div>
            <div className="flex-1 font-medium">{message}</div>
            <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
                <X size={18} />
            </button>
        </div>
    );
};
