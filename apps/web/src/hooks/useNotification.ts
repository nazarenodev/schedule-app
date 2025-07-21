import { useState, useEffect } from 'react';

export interface NotificationState {
    message: string;
    type: 'success' | 'error' | '';
}

export const useNotification = (timeout: number = 5000) => {
    const [notification, setNotification] = useState<NotificationState>({ message: '', type: '' });

    useEffect(() => {
        if (notification.message && notification.type === 'success') {
            const timer = setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [notification, timeout]);

    return { notification, setNotification };
};