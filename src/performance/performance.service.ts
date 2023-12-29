import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ScheduleRepository } from 'src/schedule/entities/schedule.repository';
import { PerformanceRepository } from './entities/performance.repository';
import { SeatRepository } from 'src/seat/entities/seat.repository';
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
    private readonly performanceSeatsRepository:Repository<Seat>,
  ) {}



  async getAllPerformances(): Promise<any[]> {
    const performances = await this.performanceRepository.find();
  
    if (!performances || performances.length === 0) {
      throw new NotFoundException('Performances not found');
    }
  
    const performancesWithDates = await Promise.all(
      performances.map(async (performance) => {
        const dateTimes = await this.performanceDateTimesRepository.find({
          where: { performance: performance },
        });
        const seats = await this.performanceSeatsRepository.find({
          where: { performance: performance },
        });
        const isBookingAvailable = this.isBookingAvailable(performance);
  
        return {
          performance,
          isBookingAvailable,
          schedules: dateTimes.map(dateTime => {
            return {
              date_time: dateTime.date_time,
            };
          }),
          seats: seats.map(seat => {
            return {
              seat_number: seat.seat_number,
            };
          }),
        };
      })
    );
  
    return performancesWithDates;
  }
  

  async getPerformancesByName(name: string): Promise<any[]> {
    const performances = await this.performanceRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  
    if (!performances || performances.length === 0) {
      throw new NotFoundException(`Performances with name ${name} not found`);
    }
  
    const performancesWithDates = await Promise.all(
      performances.map(async (performance) => {
        const dateTimes = await this.performanceDateTimesRepository.find({
          where: { performance: performance },
        });
        const seats = await this.performanceSeatsRepository.find({
          where: { performance: performance },
        });
        const isBookingAvailable = this.isBookingAvailable(performance);
  
        return {
          performance,
          isBookingAvailable,
          schedules: dateTimes.map(dateTime => {
            return {
              date_time: dateTime.date_time,
            };
          }),
          seats: seats.map(seat => {
            return {
              seat_number: seat.seat_number,
            };
          }),
        };
      })
    );
  
    return performancesWithDates;
  }

  async getPerformanceDetails(id: number): Promise<any> {
    const performance = await this.performanceRepository.findOne({
      where: { id },
      relations: ['user', 'schedules', 'seats'], 
    });
  
    if (!performance) {
      throw new NotFoundException('Performance not found');
    }
  
    return {
      performance,
    };
  }
  
  isBookingAvailable(performance: Performance): boolean {
    // performance 및 seats이 정의되어 있는지 확인
    if (performance && performance.seats) {
      // seats에서 some 메서드 사용 전에 해당 속성이 존재하는지 확인
      return performance.seats.some((seat) => this.isBookingAllowed(seat));
    }
    return false;
  }
  
  isBookingAllowed(seat: Seat): boolean {
    return seat ? seat.isAvailable : true;
  }  
  
  

  async createPerformance(user: User, data: any): Promise<Performance> {
    if (!user.isAdmin) {
      throw new UnauthorizedException('You do not have permission to create a new performance.');
    }

    let schedules = [];
    let seats = [];

    // dateTimes 배열이 존재하는 경우, 연결된 PerformanceDateTimes 엔터티 생성
    if (data.dateTimes && data.dateTimes.length > 0) {
      schedules = data.dateTimes.map(dateTimeData => {
        const schedule = new Schedule();
        schedule.date_time = dateTimeData.date_time;
        return schedule;
      });

    }

    // seats 배열이 존재하는 경우, 연결된 PerformanceSeats 엔터티 생성
    if (data.seats && data.seats.length > 0) {
      seats = data.seats.map(seatData => {
        const seat = new Seat();
        seat.seat_number = seatData.seat_number;
        seat.isAvailable = seatData.is_available;
        return seat;
      });

    }
    // Performance 엔터티 생성
    const performance = new Performance();
    // Assign values from the data object to the performance entity
    performance.name = data.name;
    performance.description = data.description;
    performance.venue = data.venue;
    performance.image = data.image;
    performance.category = data.category;
    performance.schedules = schedules;
    performance.seats = seats;

    return await this.performanceRepository.save(performance);
  }
  
  async updatePerformance(id: number, data: any, user: User): Promise<Performance> {
    const performance = await this.performanceRepository.findOne({ where: { id } });
  
    if (!performance) {
      throw new NotFoundException('Performance not found.');
    }
  
    if (!user.isAdmin) {
      throw new UnauthorizedException('You do not have permission to update this performance.');
    }
  
    // 업데이트할 속성이 있는 경우에만 업데이트
    const { name, description, venue, image, category, schedules, seats } = data;
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
        const schedule = await this.performanceDateTimesRepository.findOne(scheduleId);
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
          seat.isAvailable = seatData.is_available;
          await this.performanceSeatsRepository.save(seat);
        }
      }
    }
  
    return performance; // 업데이트된 Performance 엔터티 반환
  }
  
  
  
  
  
  


  
}
