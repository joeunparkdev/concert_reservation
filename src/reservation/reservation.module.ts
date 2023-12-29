import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { PerformanceModule } from '../performance/performance.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    PerformanceModule, 
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}