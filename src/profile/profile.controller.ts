import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from '../user/entities/user.entity';
import { ProfileService } from './profile.service';
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(@UserInfo() user: User) {
    return this.profileService.getProfile(user.id);
  }
}
