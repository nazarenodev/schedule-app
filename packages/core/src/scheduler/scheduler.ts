// core/scheduler.ts

export class TimeSlot {
    public readonly startTime: Date;
    public readonly endTime: Date;
    constructor(startTime: string | Date, endTime: string | Date) {
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        if (this.startTime >= this.endTime) throw new Error("Start time must be before end time.");
    }
    overlaps(other: TimeSlot): boolean {
        return this.startTime < other.endTime && this.endTime > other.startTime;
    }
}

export class EventType {
    public readonly id: string;
    public readonly name: string;
    public readonly durationInMinutes: number;
    public readonly ownerId: string;
    constructor(id: string, name: string, durationInMinutes: number, ownerId: string) {
        this.id = id; this.name = name; this.durationInMinutes = durationInMinutes; this.ownerId = ownerId;
        if (durationInMinutes <= 0) {
            throw new Error("Duration must be positive.");
        }
    }
}

export class Booking {
    public readonly id: string;
    public readonly bookerId: string;
    public readonly eventTypeId: string;
    public readonly timeSlot: TimeSlot;
    public readonly eventType?: EventType;
    constructor(id: string, bookerId: string, eventTypeId: string, timeSlot: TimeSlot, eventType?: EventType) {
        this.id = id; this.bookerId = bookerId; this.eventTypeId = eventTypeId; this.timeSlot = timeSlot; this.eventType = eventType;
    }
}

export class Availability {
    public readonly id: string;
    public readonly eventTypeId: string;
    public readonly timeSlot: TimeSlot;
    constructor(id: string, eventTypeId: string, timeSlot: TimeSlot) {
        this.id = id; this.eventTypeId = eventTypeId; this.timeSlot = timeSlot;
    }
}
