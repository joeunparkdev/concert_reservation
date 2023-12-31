import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity()
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  venue: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @OneToMany(() => Schedule, (schedule) => schedule.performance, {
    cascade: true,
  })
  schedules: Schedule[];

}
