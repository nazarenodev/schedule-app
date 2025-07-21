import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:4000';

// Mock data that simulates our backend response
const mockEventTypes = [
  { id: 'evt1', name: '30 Minute Stand-up', durationInMinutes: 30, ownerId: 'user_john_doe' },
  { id: 'evt2', name: '1 Hour Consultation', durationInMinutes: 60, ownerId: 'user_john_doe' },
];

const mockSlots = {
  'evt1': [ // Slots for the 30 min event
    { startTime: new Date('2025-07-22T10:00:00Z').toISOString(), endTime: new Date('2025-07-22T10:30:00Z').toISOString() },
    { startTime: new Date('2025-07-22T10:30:00Z').toISOString(), endTime: new Date('2025-07-22T11:00:00Z').toISOString() },
  ],
  'evt2': [], // No slots for the 1 hour event
};

export const handlers = [
  // Mock for GET /scheduler/event-types
  http.get(`${API_BASE_URL}/scheduler/event-types`, () => {
    return HttpResponse.json(mockEventTypes);
  }),

  // Mock for GET /scheduler/availability/slots/:eventTypeId
  http.get(`${API_BASE_URL}/scheduler/availability/slots/:eventTypeId`, ({ params }) => {
    const { eventTypeId } = params;
    const slotsForEvent = mockSlots[eventTypeId as keyof typeof mockSlots] || [];
    return HttpResponse.json(slotsForEvent);
  }),
];