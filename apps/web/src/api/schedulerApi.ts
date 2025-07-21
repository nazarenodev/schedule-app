import { Availability, Booking, EventType, TimeSlot } from "@scheduler/core";

Availability

const API_BASE_URL = 'http://localhost:4000';

// --- Interfaces for raw API data ---
interface ApiTimeSlot { startTime: string; endTime: string; }
interface ApiEventType { id: string; name: string; durationInMinutes: number; ownerId: string; }
interface ApiAvailability { id: string; eventTypeId: string; startTime: string; endTime: string; }
interface ApiBooking { id: string; bookerId: string; eventTypeId: string; startTime: string; endTime: string; eventType?: ApiEventType; }

// --- Helper for handling responses ---
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// --- Exported API Functions ---
export const getAllEventTypes = async (): Promise<EventType[]> => {
    const response = await fetch(`${API_BASE_URL}/scheduler/event-types`);
    const data: ApiEventType[] = await handleResponse(response);
    return data.map(et => new EventType(et.id, et.name, et.durationInMinutes, et.ownerId));
};

export const getAvailableSlots = async (eventTypeId: string): Promise<TimeSlot[]> => {
  const response = await fetch(`${API_BASE_URL}/scheduler/availability/slots/${eventTypeId}`);
  const data: ApiTimeSlot[] = await handleResponse(response);
  return data.map(slot => new TimeSlot(slot.startTime, slot.endTime));
};

interface BookSlotParams { eventTypeId: string; bookerId: string; timeSlot: TimeSlot; }
export const bookSlot = async ({ eventTypeId, bookerId, timeSlot }: BookSlotParams): Promise<Booking> => {
  const response = await fetch(`${API_BASE_URL}/scheduler/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventTypeId, bookerId, startTime: timeSlot.startTime.toISOString(), endTime: timeSlot.endTime.toISOString() }),
  });
  const data: ApiBooking = await handleResponse(response);
  return new Booking(data.id, data.bookerId, data.eventTypeId, new TimeSlot(data.startTime, data.endTime));
};

interface CreateEventTypeParams { name: string; durationInMinutes: number; ownerId: string; }
export const createEventType = async (params: CreateEventTypeParams): Promise<EventType> => {
    const response = await fetch(`${API_BASE_URL}/scheduler/event-types`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params),
    });
    const data: ApiEventType = await handleResponse(response);
    return new EventType(data.id, data.name, data.durationInMinutes, data.ownerId);
};

export const getEventTypesByOwner = async (ownerId: string): Promise<EventType[]> => {
    const response = await fetch(`${API_BASE_URL}/scheduler/event-types/by-owner/${ownerId}`);
    const data: ApiEventType[] = await handleResponse(response);
    return data.map(et => new EventType(et.id, et.name, et.durationInMinutes, et.ownerId));
};

interface AddAvailabilityParams { eventTypeId: string; startTime: string; endTime: string; }
export const addAvailability = async (params: AddAvailabilityParams): Promise<Availability> => {
    const response = await fetch(`${API_BASE_URL}/scheduler/availability`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params),
    });
    const data: ApiAvailability = await handleResponse(response);
    return new Availability(data.id, data.eventTypeId, new TimeSlot(data.startTime, data.endTime));
}

export const getAllUserBookings = async (userId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/scheduler/bookings/${userId}`);
    const data: ApiBooking[] = await handleResponse(response);
    return data.map(b => new Booking(
        b.id, b.bookerId, b.eventTypeId, new TimeSlot(b.startTime, b.endTime),
        b.eventType ? new EventType(b.eventType.id, b.eventType.name, b.eventType.durationInMinutes, b.eventType.ownerId) : undefined
    ));
}