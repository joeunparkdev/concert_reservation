import { SeatDto } from 'src/seat/dto/seat.dto';

export class ReservationDto {
  performanceId: number;
  userId: number;
  reservationId: number;
  seat: SeatDto;
}