import React, { useState, useEffect } from 'react';
import { getEventTypesByOwner, addAvailability } from '../api/schedulerApi';
import { EventType } from '@scheduler/core';
import { useNotification } from '../hooks/useNotification';
import { Notification } from '../components/common/Notification';

export const AddAvailabilityPage: React.FC<{ ownerId: string }> = ({ ownerId }) => {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [selectedEventTypeId, setSelectedEventTypeId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { notification, setNotification } = useNotification();

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const ownerEventTypes = await getEventTypesByOwner(ownerId);
                setEventTypes(ownerEventTypes);
                if (ownerEventTypes.length > 0) setSelectedEventTypeId(ownerEventTypes[0].id);
            } catch (err: any) {
                setNotification({ message: `Failed to load event types: ${err.message}`, type: 'error' });
            }
        };
        fetchEventTypes();
    }, [ownerId, setNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEventTypeId) { setNotification({ message: 'Please select an event type.', type: 'error' }); return; }
        setIsLoading(true);
        try {
            await addAvailability({ eventTypeId: selectedEventTypeId, startTime, endTime });
            setNotification({ message: `Successfully added availability.`, type: 'success' });
            setStartTime(''); setEndTime('');
        } catch (err: any) {
            setNotification({ message: `Error: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Availability</h2>
            <Notification notification={notification} />
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="eventTypeSelect" className="block text-sm font-medium text-gray-700">For Event Type</label>
                        <select id="eventTypeSelect" value={selectedEventTypeId} onChange={e => setSelectedEventTypeId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                            <option value="" disabled>-- Select an Event --</option>
                            {eventTypes.length > 0 ? eventTypes.map(et => (<option key={et.id} value={et.id}>{et.name}</option>)) : <option disabled>No event types found.</option>}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="datetime-local" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="datetime-local" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading || eventTypes.length === 0} className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isLoading ? 'Adding...' : 'Add Availability'}
                    </button>
                </div>
            </form>
        </div>
    );
};