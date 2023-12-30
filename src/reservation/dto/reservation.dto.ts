import { SeatDto } from 'src/seat/dto/seat.dto';
import { LoginDto } from 'src/user/dto/login.dto';

export class ReservationDto {
  performanceId: number;
  userId: number;
  reservationId: number;
  user: LoginDto;
  seat: SeatDto;
}