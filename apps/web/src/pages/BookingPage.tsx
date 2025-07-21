import React, { useState, useEffect } from 'react';
import { getAllEventTypes, getAvailableSlots, bookSlot } from '../api/schedulerApi';
import { EventType, TimeSlot } from '@scheduler/core';
import { useNotification } from '../hooks/useNotification';
import { Notification } from '../components/common/Notification';

type EventWithGroupedSlots = EventType & { slotsByDate: Record<string, TimeSlot[]> };

export const BookingPage: React.FC<{ bookerId: string }> = ({ bookerId }) => {
    const [eventsWithSlots, setEventsWithSlots] = useState<EventWithGroupedSlots[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { notification, setNotification } = useNotification();

    const fetchEventsAndSlots = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const eventTypes = await getAllEventTypes();
            const eventsWithSlotsData = await Promise.all(
                eventTypes.map(async (eventType) => {
                    const slots = await getAvailableSlots(eventType.id);
                    const slotsByDate = slots.reduce((acc, slot) => {
                        const dateKey = slot.startTime.toISOString().split('T')[0];
                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(slot);
                        return acc;
                    }, {} as Record<string, TimeSlot[]>);
                    return { ...eventType, slotsByDate };
                })
            );
            setEventsWithSlots(eventsWithSlotsData.filter(event => Object.keys(event.slotsByDate).length > 0));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsAndSlots();
    }, []);

    const handleBookSlot = async (eventTypeId: string, slotToBook: TimeSlot) => {
        try {
            await bookSlot({ eventTypeId, bookerId, timeSlot: slotToBook });
            setNotification({ message: 'Booking successful!', type: 'success' });
            fetchEventsAndSlots();
        } catch (err: any) {
            setNotification({ message: `Booking failed: ${err.message}`, type: 'error' });
        }
    };
    
    const formatTime = (date: Date): string => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const formatDateHeader = (dateStr: string): string => new Date(dateStr).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Book an Event</h2>
            <Notification notification={notification} />
            {isLoading && <p>Loading events...</p>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded"><p>{error}</p></div>}
            {!isLoading && !error && (
                <div className="space-y-6">
                    {eventsWithSlots.length > 0 ? eventsWithSlots.map(event => (
                        <div key={event.id} className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">with {event.ownerId} ({event.durationInMinutes} min)</p>
                            {Object.entries(event.slotsByDate).map(([date, slotsOnDate]) => (
                                <div key={date}>
                                    <h4 className="font-semibold text-gray-700 mt-4 mb-3 border-t pt-4">{formatDateHeader(date)}</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {slotsOnDate.map(slot => (
                                            <button key={slot.startTime.toISOString()} onClick={() => handleBookSlot(event.id, slot)} className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">
                                                {formatTime(slot.startTime)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )) : <p>No events with available slots found.</p>}
                </div>
            )}
        </div>
    );
};