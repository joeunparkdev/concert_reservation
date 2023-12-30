import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { PerformanceService } from '../performance/performance.service';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { SeatDto } from 'src/seat/dto/seat.dto';
import { Transaction } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //예매 가능 좌석들 리스트 나열
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

  // 좌석 지정하여 예매
  async reserveSeat(seatId: number, userId: number): Promise<void> {
    return await this.entityManager.transaction(
      'SERIALIZABLE',
      async (txManager) => {
        // 좌석 정보 조회
        const seat = await this.seatRepository.findOneOrFail({
          where: { id: seatId },
        });

        // 이미 예약된 좌석인지 확인
        if (!seat.is_available) {
          throw new ConflictException(
            '해당 좌석은 이미 다른 사용자에 의해 예매되었습니다',
          );
        }

        // 사용자 정보 조회
        const user = await this.userRepository.findOneOrFail({
          where: { id: userId },
        });

        // 결제
        const ticketPrice = seat.price;
        if (user.point < ticketPrice) {
          throw new BadRequestException(
            '사용자의 포인트가 부족하여 예매할 수 없습니다',
          );
        }
        user.point -= ticketPrice;
        await this.userRepository.save(user);

        // 좌석 예매 처리
        seat.is_available = false;
        await this.seatRepository.save(seat);

        // 예매 생성
        const reservation = this.reservationRepository.create({
          seat: seat,
          user: user,
        });
        await this.reservationRepository.save(reservation);
      },
    );
  }
}
