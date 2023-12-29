import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_number: string;

  @Column({ name: 'is_available' }) 
  isAvailable: boolean;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats) 
  schedule: Schedule;
}