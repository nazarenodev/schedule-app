import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { SchedulerService } from './scheduler.service';
import { ConflictException } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

describe('SchedulerService (Integration)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let schedulerService: SchedulerService;

  // This will run before EACH test, creating a fresh application instance every time.
  beforeEach(async () => {
    // Compile the module and its dependencies into a testing module.
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create a full NestJS application from the testing module.
    app = moduleFixture.createNestApplication();
    await app.init();

    // Get instances of the services directly from the compiled module fixture.
    // This can be more reliable in test environments than using app.get().
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    schedulerService = moduleFixture.get<SchedulerService>(SchedulerService);

    // Clean the database before running the test logic
    await prisma.booking.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.eventType.deleteMany();
  });

  // This will run after EACH test to clean up the application instance.
  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(schedulerService).toBeDefined();
  });

  describe('createEventType', () => {
    it('should create an event type and save it to the database', async () => {
      const eventName = 'Integration Test Event';
      const duration = 45;
      const ownerId = 'owner-integration';

      const createdEvent = await schedulerService.createEventType(eventName, duration, ownerId);

      expect(createdEvent.name).toBe(eventName);
      expect(createdEvent.durationInMinutes).toBe(duration);

      const dbEvent = await prisma.eventType.findUnique({
        where: { id: createdEvent.id },
      });

      expect(dbEvent).not.toBeNull();
      expect(dbEvent?.name).toBe(eventName);
    });

    it('should prevent creating a duplicate event type for the same owner', async () => {
      const eventName = 'Duplicate Event';
      const duration = 30;
      const ownerId = 'owner-duplicate';

      await schedulerService.createEventType(eventName, duration, ownerId);

      await expect(
        schedulerService.createEventType(eventName, duration, ownerId)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('addAvailability and getAvailableSlots', () => {
    it('should add an availability and correctly calculate the available slots', async () => {
        const eventType = await schedulerService.createEventType('Slot Test', 30, 'owner-slots');

        const startTime = new Date('2025-10-10T10:00:00Z');
        const endTime = new Date('2025-10-10T11:00:00Z');
        await schedulerService.addAvailability(eventType.id, startTime, endTime);

        const slots = await schedulerService.getAvailableSlots(eventType.id);
        expect(slots).toHaveLength(2);
        expect(slots[0].startTime).toEqual(new Date('2025-10-10T10:00:00Z'));
        expect(slots[0].endTime).toEqual(new Date('2025-10-10T10:30:00Z'));
        expect(slots[1].startTime).toEqual(new Date('2025-10-10T10:30:00Z'));
        expect(slots[1].endTime).toEqual(new Date('2025-10-10T11:00:00Z'));
    });
  });
});
