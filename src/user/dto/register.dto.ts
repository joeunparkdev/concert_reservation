import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class RegisterDto extends PickType(User, ['email', 'password']) {
  @ApiProperty()
  email: string;
  password: string;
}
