import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class RegisterDto extends PickType(User, ['email','password']){


}