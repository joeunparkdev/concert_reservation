import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Performance } from 'src/performance/entities/performance.entity';
import { Role } from '../types/userRole.type';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  //@IsStrongPassword()
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.Client })
  role: Role;

  @Column({ type: 'int', default: 1000000 })
  point: number;

}
