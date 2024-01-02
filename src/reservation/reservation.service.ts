import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  EntityNotFoundError,
  getManager,
  Repository,
} from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';
import { Transaction } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { FindAllReservationsResponseDto } from './dto/find-all-reservations-response.dto';

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
  async getAvailableSeats(): Promise<CreateSeatDto[]> {
    const seats = await this.seatRepository.find({
      where: {
        is_available: true,
      },
    });

    if (!seats || seats.length === 0) {
      return [];
    }

    return seats.map((seat) => ({
      id: seat.id,
      seat_number: seat.seat_number,
      is_available: seat.is_available,
      price: seat.price,
    }));
  }

  // 좌석 지정하여 예매
  async reserveSeat(seatId: number, userId: number): Promise<Reservation> {
    // 예약 트랜잭션 시작
    return await this.entityManager.transaction(
      'SERIALIZABLE',
      async (txManager: EntityManager) => {
        try {
          // 좌석 정보 조회
          const seat = await txManager.findOneOrFail(Seat, {
            where: { id: seatId },
          });
  
          // 이미 예약된 좌석인지 확인
          if (!seat.is_available) {
            throw new ConflictException(
              '해당 좌석은 이미 다른 사용자에 의해 예매되었습니다',
            );
          }
  
          // 사용자 정보 조회
          const user = await txManager.findOneOrFail(User, {
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
          await txManager.save(user);
  
          // 좌석 예매 처리
          seat.is_available = false;
          await txManager.save(seat);
  
          // 예매 생성
          const reservation = txManager.create(Reservation, {
            seat: seat,
            user: user,
          });
          await txManager.save(reservation);
  
          // 예약 정보 반환
          return reservation;
        } catch (error) {
          // 예외 처리
          console.error('예약 중 오류:', error.message);
          throw error;
        }
      },
    );
  }
  

// 예약 취소
async cancelReservation(
  reservationId: number,
  userId: number,
): Promise<string> { // 메시지를 반환하기 위해 Promise<string>로 변경
  return await this.entityManager.transaction(
    'SERIALIZABLE',
    async (txManager) => {
      try {
        // 예약 정보 조회
        const reservationToCancel = await txManager.findOneOrFail(
          Reservation,
          {
            where: { id: reservationId },
            relations: { seat: { schedule: true } },
          },
        );

        // 사용자 정보 조회
        const user = await txManager.findOneOrFail(User, {
          where: { id: userId },
        });

        // 공연 시작 3시간 전까지만 예매를 취소 가능
        const threeHoursBeforeShow = new Date(
          reservationToCancel.seat.schedule.date_time,
        );
        threeHoursBeforeShow.setHours(threeHoursBeforeShow.getHours() - 3);
        console.log('Three hours before show:', threeHoursBeforeShow);

        if (new Date() > threeHoursBeforeShow) {
          console.log(
            'Throwing exception: 공연 시작 3시간 전까지만 예매를 취소할 수 있습니다',
          );
          throw new BadRequestException(
            '공연 시작 3시간 전까지만 예매를 취소할 수 있습니다',
          );
        }

        // 환불
        const refund = reservationToCancel.seat.price;
        user.point += refund;
        await txManager.save(user);

        // 좌석 예매 처리
        reservationToCancel.seat.is_available = true;
        await txManager.save(reservationToCancel.seat);

        // 예매 취소
        await txManager.remove(reservationToCancel);

        // 성공 메시지 반환
        return '예약이 성공적으로 취소되었습니다';
      } catch (error) {
        if (error instanceof EntityNotFoundError) {
          console.error('예약이 존재하지 않습니다');
          throw new BadRequestException('예약이 존재하지 않습니다');
        }

        console.error('취소 중 오류:', error.message);
        throw error;
      }
    },
  );
}


  //예매 목록 확인
  async getReservationList(
    userId: number,
  ): Promise<FindAllReservationsResponseDto[]> {
    const reservations = await this.reservationRepository.find({
      where: {
        user: { id: userId },
      },
      relations: { seat: { schedule: { performance: true } } },
    });

    return reservations.map((reservation) => ({
      id: reservation.id,
      seat: reservation.seat,
      user: reservation.user,
    }));
  }
}
