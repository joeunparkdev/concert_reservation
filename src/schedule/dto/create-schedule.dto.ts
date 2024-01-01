import { ApiProperty } from "@nestjs/swagger";
import { CreateSeatDto } from "src/seat/dto/create-seat.dto";
import { Seat } from "src/seat/entities/seat.entity";

export class CreateScheduleDto {

  @ApiProperty()
  date_time: Date;
  @ApiProperty()
  seats: CreateSeatDto[];
}
