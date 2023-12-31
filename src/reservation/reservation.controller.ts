import {
  Body,
  Controller,
  Delete,
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

  //list available seats
  @Get()
  async availableSeats(): Promise<any> {
    return this.reservationService.getAvailableSeats();
  }

  //list loggedin user's reservation history
  @ApiHeader({
    name: 'token',
  })
  @UseGuards(JwtCustomerAuthGuard)
  @Get('my-reservation-history')
  async getReservationList(   
    @UserInfo() user: User,
    @Req() request: Request,
  ):Promise<any> {
    const userId = user.id;
    console.log(user);
    console.log(userId);
    return this.reservationService.getReservationList(userId);
  }

  //make a reservation
  @ApiHeader({
    name: 'token',
  })
  @UseGuards(JwtCustomerAuthGuard)
  @Post()
  async reserveSeat(
    @UserInfo() user: User,
    @Body('seatId') seatId: number,
    @Req() request: Request,
  ): Promise<void> {
    const userId = user.id;
    await this.reservationService.reserveSeat(seatId, userId);
  }

  //cancel reservation 
  @ApiHeader({
    name: 'token',
  })
  @UseGuards(JwtCustomerAuthGuard)
  @Delete(':reservationId')
  async cancelReservation(
    @UserInfo() user: User,
    @Param('reservationId') reservationId: number, 
    @Req() request: Request,
  ): Promise<void> {
    const userId = user.id;
    await this.reservationService.cancelReservation(reservationId, userId);
  }
}
