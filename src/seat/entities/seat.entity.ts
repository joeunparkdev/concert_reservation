import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_number: string;

  @Column({ name: 'is_available' }) 
  is_available: boolean;

  @Column()
  price: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.seats) 
  schedule: Schedule;

  @OneToOne(() => Reservation, Reservation => Reservation.seat, { cascade: true })
  reservations: Reservation[];
}