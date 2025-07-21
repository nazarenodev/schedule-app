import { Controller, Post, Body, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { AddAvailabilityDto } from './dto/add-availability.dto';
import { BookSlotDto } from './dto/book-slot.dto';

@Controller('scheduler')
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) {}

    @Post('event-types')
    @HttpCode(HttpStatus.CREATED)
    createEventType(@Body() createEventTypeDto: CreateEventTypeDto) {
        const { name, durationInMinutes, ownerId } = createEventTypeDto;
        return this.schedulerService.createEventType(name, durationInMinutes, ownerId);
    }

    @Get('event-types')
    getAllEventTypes() {
        return this.schedulerService.getAllEventTypes();
    }

    @Get('event-types/by-owner/:ownerId')
    getEventTypesByOwner(@Param('ownerId') ownerId: string) {
        return this.schedulerService.getEventTypesByOwner(ownerId);
    }

    @Post('availability')
    @HttpCode(HttpStatus.CREATED)
    addAvailability(@Body() addAvailabilityDto: AddAvailabilityDto) {
        const { eventTypeId, startTime, endTime } = addAvailabilityDto;
        // DTO validation ensures these are valid date strings. Convert to Date objects.
        return this.schedulerService.addAvailability(eventTypeId, new Date(startTime), new Date(endTime));
    }

    @Get('availability/slots/:eventTypeId')
    getAvailableSlots(@Param('eventTypeId') eventTypeId: string) {
        return this.schedulerService.getAvailableSlots(eventTypeId);
    }
    
    @Post('bookings')
    @HttpCode(HttpStatus.CREATED)
    bookSlot(@Body() bookSlotDto: BookSlotDto) {
        const { bookerId, eventTypeId, startTime, endTime } = bookSlotDto;
        return this.schedulerService.bookSlot(bookerId, eventTypeId, new Date(startTime), new Date(endTime));
    }

    @Get('bookings/:userId')
    getAllUserBookings(@Param('userId') userId: string) {
        return this.schedulerService.getAllUserBookings(userId);
    }
}