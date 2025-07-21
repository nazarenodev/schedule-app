import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class BookSlotDto {
    @IsString()
    @IsNotEmpty()
    bookerId: string;

    @IsString()
    @IsNotEmpty()
    eventTypeId: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;
}