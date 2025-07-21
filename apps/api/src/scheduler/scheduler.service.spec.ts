import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EventType } from '@scheduler/core';

// Use Vitest's built-in mocking to replace the entire PrismaService module.
// This is a very robust way to ensure the mock is used.
const prismaMock = {
  eventType: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  // Add other models as needed for more tests
};

vi.mock('../prisma/prisma.service', () => ({
  // This tells Vitest to provide a default export that is our mock
  default: prismaMock,
  // Also provide it as a named export if needed
  PrismaService: vi.fn(() => prismaMock),
}));


describe('SchedulerService', () => {
  let schedulerService: SchedulerService;
  let prismaService: typeof prismaMock;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Cast the mock to the PrismaService type for type safety
    const mockedPrismaInstance = prismaMock as unknown as PrismaService;
    
    // Manually instantiate the service with the mocked prisma instance
    schedulerService = new SchedulerService(mockedPrismaInstance);
    prismaService = prismaMock;
  });

  describe('createEventType', () => {
    it('should create a new event type successfully', async () => {
      const newEventTypeDto = { name: 'New Event', durationInMinutes: 60, ownerId: 'owner1' };
      const expectedEventType: EventType = { id: '1', ...newEventTypeDto };

      // Mock the database response
      prismaService.eventType.findUnique.mockResolvedValue(null);
      prismaService.eventType.create.mockResolvedValue(expectedEventType);

      const result = await schedulerService.createEventType(
        newEventTypeDto.name,
        newEventTypeDto.durationInMinutes,
        newEventTypeDto.ownerId,
      );

      expect(result).toEqual(expectedEventType);
      expect(prismaService.eventType.create).toHaveBeenCalledWith({ data: newEventTypeDto });
    });

    it('should throw a ConflictException if the event type already exists', async () => {
      const existingEventTypeDto = { name: 'Existing Event', durationInMinutes: 30, ownerId: 'owner1' };
      const existingEventType: EventType = { id: '2', ...existingEventTypeDto };

      // Mock the database response
      prismaService.eventType.findUnique.mockResolvedValue(existingEventType);

      await expect(
        schedulerService.createEventType(
          existingEventTypeDto.name,
          existingEventTypeDto.durationInMinutes,
          existingEventTypeDto.ownerId,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('addAvailability', () => {
    it('should throw NotFoundException if event type does not exist', async () => {
      const availabilityDto = {
        eventTypeId: 'non-existent-id',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600 * 1000),
      };

      // Mock the database response
      prismaService.eventType.findUnique.mockResolvedValue(null);

      await expect(
        schedulerService.addAvailability(
          availabilityDto.eventTypeId,
          availabilityDto.startTime,
          availabilityDto.endTime,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
