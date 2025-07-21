import { Injectable, OnModuleInit, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import { TimeSlot } from '@scheduler/core'; // Assuming core logic is in a parent folder

@Injectable()
export class SchedulerService {
    constructor(private prisma: PrismaProvider) {}

    async createEventType(name: string, durationInMinutes: number, ownerId: string) {
        // Prisma's `@@unique` constraint handles the check, but we can provide a friendlier error.
        const existing = await this.prisma.eventType.findUnique({
            where: { name_ownerId: { name, ownerId } },
        });
        if (existing) {
            throw new ConflictException(`Event type with name "${name}" already exists for this owner.`);
        }
        return this.prisma.eventType.create({
            data: { name, durationInMinutes, ownerId },
        });
    }

    async getAllEventTypes() {
        return this.prisma.eventType.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }

    async getEventTypesByOwner(ownerId: string) {
        return this.prisma.eventType.findMany({
            where: { ownerId },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async addAvailability(eventTypeId: string, startTime: Date, endTime: Date) {
        const eventType = await this.prisma.eventType.findUnique({ where: { id: eventTypeId } });
        if (!eventType) {
            throw new NotFoundException('Event type not found.');
        }

        // Check for overlapping availability for the same owner
        const ownerEventTypes = await this.prisma.eventType.findMany({ where: { ownerId: eventType.ownerId } });
        const ownerEventTypeIds = ownerEventTypes.map(et => et.id);

        const conflictingAvailability = await this.prisma.availability.findFirst({
            where: {
                eventTypeId: { in: ownerEventTypeIds },
                OR: [
                    { startTime: { lt: endTime }, endTime: { gt: startTime } }, // Overlap check
                ],
            },
        });

        if (conflictingAvailability) {
            throw new ConflictException('Availability slot overlaps with an existing one for this owner.');
        }

        return this.prisma.availability.create({
            data: { eventTypeId, startTime, endTime },
        });
    }

    async getAvailableSlots(eventTypeId: string) {
        const eventType = await this.prisma.eventType.findUnique({ where: { id: eventTypeId } });
        if (!eventType) {
            throw new NotFoundException('Event type not found.');
        }

        const availabilities = await this.prisma.availability.findMany({ where: { eventTypeId } });
        const bookings = await this.prisma.booking.findMany({ where: { eventTypeId } });

        const availableSlots: TimeSlot[] = [];

        for (const avail of availabilities) {
            let currentStartTime = new Date(avail.startTime.getTime());
            while (true) {
                const slotEndTime = new Date(currentStartTime.getTime() + eventType.durationInMinutes * 60 * 1000);
                if (slotEndTime > avail.endTime) break;

                const potentialSlot = new TimeSlot(currentStartTime, slotEndTime);
                const isBooked = bookings.some(booking => potentialSlot.overlaps(new TimeSlot(booking.startTime, booking.endTime)));

                if (!isBooked) {
                    availableSlots.push(potentialSlot);
                }
                currentStartTime = slotEndTime;
            }
        }
        return availableSlots;
    }

    async bookSlot(bookerId: string, eventTypeId: string, startTime: Date, endTime: Date) {
        const slotToBook = new TimeSlot(startTime, endTime);

        // Using a transaction to ensure all checks and the creation are atomic
        return this.prisma.$transaction(async (tx) => {
            const eventType = await tx.eventType.findUnique({ where: { id: eventTypeId } });
            if (!eventType) throw new NotFoundException('Event type not found.');
            if (bookerId === eventType.ownerId) throw new BadRequestException('Owner cannot book their own event.');

            // 1. Check if the slot is within a valid availability window
            const parentAvailability = await tx.availability.findFirst({
                where: { eventTypeId, startTime: { lte: startTime }, endTime: { gte: endTime } },
            });
            if (!parentAvailability) throw new BadRequestException('The requested time slot is not within any available period.');

            // 2. Check for conflicts with the booker's existing bookings
            const bookerConflict = await tx.booking.findFirst({
                where: { bookerId, startTime: { lt: endTime }, endTime: { gt: startTime } },
            });
            if (bookerConflict) throw new ConflictException("The requested time slot conflicts with an existing booking for the booker.");

            // 3. Check for conflicts with the owner's existing bookings
            const ownerConflict = await tx.booking.findFirst({
                where: { eventType: { ownerId: eventType.ownerId }, startTime: { lt: endTime }, endTime: { gt: startTime } },
            });
            if (ownerConflict) throw new ConflictException("The requested time slot conflicts with an existing event for the owner.");

            // 4. Final check: ensure the specific slot isn't already taken (double-check)
            const slotConflict = await tx.booking.findFirst({
                where: { eventTypeId, startTime: { lt: endTime }, endTime: { gt: startTime } },
            });
            if (slotConflict) throw new ConflictException("This time slot is no longer available.");

            // 5. Create the booking
            return tx.booking.create({
                data: { bookerId, eventTypeId, startTime, endTime },
            });
        });
    }
    
    async getAllUserBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: {
                OR: [
                    { bookerId: userId },
                    { eventType: { ownerId: userId } },
                ],
            },
            include: {
                eventType: true, // Include event type details in the response
            },
        });
    }
}