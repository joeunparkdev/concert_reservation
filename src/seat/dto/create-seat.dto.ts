import { ApiProperty } from "@nestjs/swagger";

export class CreateSeatDto {
  @ApiProperty()
  seat_number: string;
  @ApiProperty()
  price : number;
}
