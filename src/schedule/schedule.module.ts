import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Schedule])],
  })
  export class ScheduleModule {}