import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Seat, User]), 
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
