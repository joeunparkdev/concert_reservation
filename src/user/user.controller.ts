import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { GrantAdminRoleDto } from './dto/grant-admin-role.dto';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.register(
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }

  @ApiBearerAuth()
  @Post('grant-admin-role')
  @UseGuards(AdminGuard)
  async grantAdminRole(@Body() grantAdminRole: GrantAdminRoleDto) {
    const { userId } = grantAdminRole;
    await this.userService.grantAdminRole(userId);
    return { message: 'Admin role granted successfully.' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('id')
  getId(@UserInfo() user: User) {
    return { id: user.id };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('email')
  getEmail(@UserInfo() user: User) {
    return { email: user.email };
  }
}
