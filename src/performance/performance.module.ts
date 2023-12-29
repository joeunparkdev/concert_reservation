import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { Performance } from './entities/performance.entity';
import { ScheduleModule } from '../schedule/schedule.module';
import { SeatModule } from '../seat/seat.module';
import { ScheduleRepository } from '../schedule/entities/schedule.repository'; 
import { SeatRepository } from '../seat/entities/seat.repository'; 
import { PerformanceRepository } from './entities/performance.repository'; 
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Performance,Seat,Schedule]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService], 
  exports: [PerformanceService],
})
export class PerformanceModule {}
