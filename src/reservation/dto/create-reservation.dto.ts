import { ApiProperty } from "@nestjs/swagger";

export class CreateReservationDto {
  @ApiProperty()
  seatId: number;
}
