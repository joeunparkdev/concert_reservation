import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { JwtCustomerAuthGuard } from 'src/guards/customer.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async availableSeats(): Promise<any> {
    return this.reservationService.getAvailableSeats();
  }
  @ApiHeader({
    name: 'token',
  })
  @UseGuards(JwtAuthGuard)
  @Post(':seatId')
  async reserveSeat(
    @UserInfo() user: User,
    @Param('seatId') seatId: number,
    @Req() request: Request,
  ): Promise<void> {
    const userId = user.id;
    console.log('reservation user=' + user);
    await this.reservationService.reserveSeat(seatId, userId);
  }
}
