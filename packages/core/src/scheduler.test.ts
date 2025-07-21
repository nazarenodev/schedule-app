/*
================================================================================
File: packages/core/src/scheduler.test.ts
Description: Unit tests for the core business logic classes.
================================================================================
*/
import { describe, it, expect, beforeEach } from 'vitest';
import { TimeSlot, EventType, Booking, Availability } from './index'; // Assuming classes are exported from index.ts

describe('TimeSlot', () => {
    it('should create a valid TimeSlot', () => {
        const startTime = new Date('2025-01-01T10:00:00.000Z');
        const endTime = new Date('2025-01-01T11:00:00.000Z');
        const timeSlot = new TimeSlot(startTime, endTime);
        expect(timeSlot.startTime).toEqual(startTime);
        expect(timeSlot.endTime).toEqual(endTime);
    });

    it('should throw an error if start time is after end time', () => {
        const startTime = new Date('2025-01-01T11:00:00.000Z');
        const endTime = new Date('2025-01-01T10:00:00.000Z');
        expect(() => new TimeSlot(startTime, endTime)).toThrow('Start time must be before end time.');
    });

    it('should throw an error if start time is equal to end time', () => {
        const startTime = new Date('2025-01-01T10:00:00.000Z');
        const endTime = new Date('2025-01-01T10:00:00.000Z');
        expect(() => new TimeSlot(startTime, endTime)).toThrow('Start time must be before end time.');
    });
});

describe('EventType', () => {
    it('should create a valid EventType', () => {
        const eventType = new EventType('event-type-id', '30 Min Meeting', 30, 'owner-id');
        expect(eventType.id).toBe('event-type-id');
        expect(eventType.name).toBe('30 Min Meeting');
        expect(eventType.durationInMinutes).toBe(30);
        expect(eventType.ownerId).toBe('owner-id');
    });
});

describe('Booking', () => {
    it('should create a valid Booking with an associated EventType', () => {
        const timeSlot = new TimeSlot('2025-01-01T10:00:00Z', '2025-01-01T10:30:00Z');
        const eventType = new EventType('event-type-id', '30 Min Meeting', 30, 'owner-id');
        const booking = new Booking('booking-id', 'booker-id', 'event-type-id', timeSlot, eventType);

        expect(booking.id).toBe('booking-id');
        expect(booking.bookerId).toBe('booker-id');
        expect(booking.timeSlot).toBe(timeSlot);
        expect(booking.eventType).toBe(eventType);
        expect(booking.eventType?.name).toBe('30 Min Meeting');
    });
});

describe('Availability', () => {
    it('should create a valid Availability', () => {
        const timeSlot = new TimeSlot('2025-01-01T09:00:00Z', '2025-01-01T17:00:00Z');
        const availability = new Availability('avail-id', 'event-type-id', timeSlot);

        expect(availability.id).toBe('avail-id');
        expect(availability.eventTypeId).toBe('event-type-id');
        expect(availability.timeSlot).toBe(timeSlot);
    });
});
