import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatRepository } from './entities/seat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
})
export class SeatModule {}