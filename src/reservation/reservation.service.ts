import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { PerformanceService } from '../performance/performance.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { SeatDto } from 'src/seat/dto/seat.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  //예매 가능 좌석 정보 반환
  async getAvailableSeats(): Promise<SeatDto[]> {
    const seats = await this.seatRepository.find({
      where: {
        is_available: true,
      },
    });

    if (!seats || seats.length === 0) {
      throw new NotFoundException('Seats not found');
    }

    return seats.map((seat) => ({
      id: seat.id,
      seat_number: seat.seat_number,
      is_available: seat.is_available,
      price: seat.price,
    }));
  }
}
