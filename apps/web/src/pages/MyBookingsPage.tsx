import React, { useState, useEffect } from 'react';
import { getAllUserBookings } from '../api/schedulerApi';
import { Booking } from '@scheduler/core';

export const MyBookingsPage: React.FC<{ userId: string }> = ({ userId }) => {
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [pastBookings, setPastBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const allBookings = await getAllUserBookings(userId);
                const now = new Date();
                const upcoming = allBookings.filter(b => b.timeSlot.startTime > now);
                const past = allBookings.filter(b => b.timeSlot.startTime <= now);
                setUpcomingBookings(upcoming.sort((a, b) => a.timeSlot.startTime.getTime() - b.timeSlot.startTime.getTime()));
                setPastBookings(past.sort((a, b) => b.timeSlot.startTime.getTime() - a.timeSlot.startTime.getTime()));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, [userId]);

    const formatDate = (date: Date) => date.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' });

    const renderBookingCard = (booking: Booking) => {
        const isOwner = booking.eventType?.ownerId === userId;
        const otherParty = isOwner ? booking.bookerId : booking.eventType?.ownerId;
        return (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-gray-800">{booking.eventType?.name}</h4>
                    <p className="text-sm text-gray-600">{isOwner ? `With: ${otherParty}` : `Host: ${otherParty}`}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(booking.timeSlot.startTime)}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
            {isLoading && <p>Loading bookings...</p>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded"><p>{error}</p></div>}
            {!isLoading && !error && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Upcoming</h3>
                        <div className="space-y-4">{upcomingBookings.length > 0 ? upcomingBookings.map(renderBookingCard) : <p>No upcoming bookings.</p>}</div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Past</h3>
                        <div className="space-y-4">{pastBookings.length > 0 ? pastBookings.map(renderBookingCard) : <p>No past bookings.</p>}</div>
                    </div>
                </div>
            )}
        </div>
    );
};