import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' }) 
  date_time: Date;

  @ManyToOne(() => Performance, (performance) => performance.schedules)
  performance: Performance;

  @Column({ name: 'is_booking_allowed' }) 
  isBookingAllowed: boolean;
}