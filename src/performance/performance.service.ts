import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Performance } from './entities/performance.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Seat } from '../seat/entities/seat.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(Schedule)
    private readonly performanceDateTimesRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private readonly performanceSeatsRepository: Repository<Seat>,
  ) {}

  async getAllPerformances(): Promise<any[]> {
    const performances = await this.performanceRepository.find({
      relations: { schedules: { seats: true } },
    });

    if (!performances || performances.length === 0) {
      throw new NotFoundException('Performances not found');
    }

    return performances;
  }

  async getPerformancesByName(name: string): Promise<any[]> {
    const performances = await this.performanceRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: { schedules: { seats: true } },
    });

    if (!performances || performances.length === 0) {
      throw new NotFoundException(`Performances with name ${name} not found`);
    }

    return performances;
  }

  async getPerformanceDetails(id: number): Promise<any> {
    const performance = await this.performanceRepository.findOne({
      where: { id },
      relations: { schedules: { seats: true } },
    });

    if (!performance) {
      throw new NotFoundException('Performance not found');
    }

    return {
      performance,
    };
  }

  async createPerformance(user: User, data: any): Promise<Performance> {
    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to create a new performance.',
      );
    }

    let schedules = [];

    // Performance 엔터티 생성
    const performance = new Performance();

    performance.name = data.name;
    performance.description = data.description;
    performance.venue = data.venue;
    performance.image = data.image;
    performance.category = data.category;

    // dateTimes 배열이 존재하는 경우, 연결된 PerformanceDateTimes 엔터티 생성
    if (data.schedules && data.schedules.length > 0) {
      for (const scheduleData of data.schedules) {
        if (
          !scheduleData.date_time ||
          !scheduleData.seats ||
          scheduleData.seats.length === 0
        ) {
          throw new BadRequestException(
            'Invalid performance data. Please provide valid date_time and seats.',
          );
        }

        const schedule = new Schedule();
        schedule.date_time = scheduleData.date_time;
        let seats = [];
        for (const seatData of scheduleData.seats) {
          if (!seatData.seat_number) {
            throw new BadRequestException(
              'Invalid seat data. Please provide a valid seat_number.',
            );
          }

          const seat = new Seat();
          seat.seat_number = seatData.seat_number;
          seat.is_available = seatData.is_available || false;
          seat.price = seatData.price;
          seats.push(seat);
        }
        schedule.seats = seats;
        schedules.push(schedule);
      }
    }

    // Performance 엔터티에 일정 및 좌석 할당
    performance.schedules = schedules;

    // Performance 저장
    return await this.performanceRepository.save(performance);
  }

  async updatePerformance(
    id: number,
    data: any,
    user: User,
  ): Promise<Performance> {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException('Performance not found.');
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException(
        'You do not have permission to update this performance.',
      );
    }

    // 업데이트할 속성이 있는 경우에만 업데이트
    const { name, description, venue, image, category, schedules, seats } =
      data;
    if (name || description || venue || image || category) {
      // 업데이트할 속성이 있는 경우에만 업데이트
      if (name) performance.name = name;
      if (description) performance.description = description;
      if (venue) performance.venue = venue;
      if (image) performance.image = image;
      if (category) performance.category = category;
    }

    // Performance 엔터티 저장
    await this.performanceRepository.save(performance);

    // schedules 업데이트
    if (schedules && schedules.length > 0) {
      for (const scheduleData of schedules) {
        const scheduleId = scheduleData.id; // 이전에 저장된 schedule의 ID
        const schedule =
          await this.performanceDateTimesRepository.findOne(scheduleId);
        if (schedule) {
          // schedule 업데이트
          schedule.date_time = scheduleData.date_time;
          await this.performanceDateTimesRepository.save(schedule);
        }
      }
    }

    // seats 업데이트
    if (seats && seats.length > 0) {
      for (const seatData of seats) {
        const seatId = seatData.id; // 이전에 저장된 seat의 ID
        const seat = await this.performanceSeatsRepository.findOne(seatId);
        if (seat) {
          // seat 업데이트
          seat.seat_number = seatData.seat_number;
          seat.is_available = seatData.is_available;
          seat.price = seatData.price;
          await this.performanceSeatsRepository.save(seat);
        }
      }
    }

    return performance; // 업데이트된 Performance 엔터티 반환
  }
}
