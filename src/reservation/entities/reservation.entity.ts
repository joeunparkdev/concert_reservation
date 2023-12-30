import { Seat } from 'src/seat/entities/seat.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Seat)
  seat: Seat;

  @Column()
  userId: number;

}