import { Seat } from 'src/seat/entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  seatId: number;

  @Column({ type: 'int' })
  userId: number;

  @OneToOne(() => Seat)
  @JoinColumn()
  seat: Seat;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
