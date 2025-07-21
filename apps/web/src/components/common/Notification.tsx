import React from 'react';
import type { NotificationState } from '../../hooks/useNotification';

interface NotificationProps {
    notification: NotificationState;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
    if (!notification.message) {
        return null;
    }

    const baseClasses = 'p-4 rounded mb-4';
    const typeClasses = notification.type === 'success'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {notification.message}
        </div>
    );
};