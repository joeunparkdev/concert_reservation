import { Body, Controller, Post } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @ApiHeader({
    name: 'token'
  })
  @Post()
  async reserveShow(@Body() reservation: ReservationDto, user: User): Promise<ReservationDto> {
    const userId = user.id; 

    return this.reservationService.reserveShow(reservation, userId);
  }
}