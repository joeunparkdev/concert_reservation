import { ApiProperty } from "@nestjs/swagger";
import { CreateScheduleDto } from "src/schedule/dto/create-schedule.dto";

export class CreatePerformanceDto {

  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  venue: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  schedules: CreateScheduleDto[];
  
}
