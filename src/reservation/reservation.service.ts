import { Injectable, BadRequestException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { PerformanceService } from '../performance/performance.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    private readonly performanceService: PerformanceService,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async reserveShow(reservation: ReservationDto, userId: number): Promise<ReservationDto> {
    const { performance, isBookingAvailable } = await this.performanceService.getPerformanceDetails(reservation.performanceId);

    if (!isBookingAvailable) {
      throw new BadRequestException('Booking not available for the selected performance.');
    }

    // 예약 정보 저장 로직 추가
    const newReservation: Reservation = {
        userId,
        performance,
        id: 0,
    };

    // 데이터베이스에 저장
    const savedReservation = await this.reservationRepository.save(newReservation);

    // 예약 정보에 퍼포먼스 정보 추가
    const reservationDto: ReservationDto = {
        ...reservation,
        reservationId: savedReservation.id,
        userId: savedReservation.userId,
        performance: savedReservation.performance,
      };
    return reservationDto;
  }
}
