import React, { useState } from 'react';
import { createEventType } from '../api/schedulerApi';
import { useNotification } from '../hooks/useNotification';
import { Notification } from '../components/common/Notification';

export const CreateEventTypePage: React.FC<{ ownerId: string }> = ({ ownerId }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const { notification, setNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newEventType = await createEventType({ name, durationInMinutes: duration, ownerId });
            setNotification({ message: `Successfully created event: "${newEventType.name}"`, type: 'success' });
            setName(''); setDuration(30);
        } catch (err: any) {
            setNotification({ message: `Error: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Event Type</h2>
            <Notification notification={notification} />
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" id="eventName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                        <input type="number" id="duration" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isLoading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};