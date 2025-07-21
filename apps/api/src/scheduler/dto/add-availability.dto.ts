import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class AddAvailabilityDto {
    @IsString()
    @IsNotEmpty()
    eventTypeId: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;
}