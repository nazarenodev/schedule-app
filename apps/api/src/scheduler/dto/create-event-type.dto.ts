import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  durationInMinutes: number;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}