import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date_time: Date;

  @ManyToOne(() => Performance, (performance) => performance.schedules)
  performance: Performance;

  @OneToMany(() => Seat, (seat) => seat.schedule, { cascade: true })
  seats: Seat[];
}
