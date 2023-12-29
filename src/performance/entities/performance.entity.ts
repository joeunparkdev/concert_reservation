import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.performances)
  user: User;

  @OneToMany(() => Schedule, schedule => schedule.performance, { cascade: true })
  schedules: Schedule[];

  @OneToMany(() => Seat, seat => seat.performance, { cascade: true })
  seats: Seat[];

  // @OneToMany(() => Reservation, Reservation => Reservation.performance, { cascade: true })
  // reservations: Reservation[];

}
