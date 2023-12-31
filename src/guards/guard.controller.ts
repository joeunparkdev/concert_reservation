import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @ApiHeader({
    name: 'token',
  })
  @Post('grant-admin-role')
  @UseGuards(AdminGuard)
  async grantAdminRole(@Body() { id }: { id: number }) {
    console.log('grantAdminRole method called with ID:', id);

    await this.userService.grantAdminRole(id);

    return { message: 'Admin role granted successfully.' };
  }
}
