import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async availableSeats():Promise<any> {
    return this.reservationService.getAvailableSeats();
  }
}