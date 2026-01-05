
import React, { useEffect } from 'react';

interface NotificationToastProps {
    message: string;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className="fixed top-24 right-5 bg-brand-green text-white py-3 px-6 rounded-lg shadow-2xl z-50 animate-fade-in-down flex items-center">
            <span className="text-xl mr-3">🛍️</span>
            <p className="font-semibold">{message}</p>
        </div>
    );
};

export default NotificationToast;
