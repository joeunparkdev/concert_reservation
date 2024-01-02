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
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtCustomerAuthGuard } from 'src/guards/customer.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //list available seats
  @Get('available-seats')
  async availableSeats(): Promise<any> {
    return this.reservationService.getAvailableSeats();
  }

  //list loggedin user's reservation list
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-reservation-list')
  async getReservationList(
    @UserInfo() user: User,
    @Req() request: Request,
  ): Promise<any> {
    const userId = user.id;
    return this.reservationService.getReservationList(userId);
  }

  //make a reservation
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async reserveSeat(
    @UserInfo() user: User,
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: Request,
  ): Promise<Reservation> {
    const userId = user.id;
    const { seatId } = createReservationDto;
    return await this.reservationService.reserveSeat(seatId, userId);
  }

  //cancel reservation
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':reservationId')
  async cancelReservation(
    @UserInfo() user: User,
    @Param('reservationId') reservationId: number,
    @Req() request: Request,
  ): Promise<String> {
    const userId = user.id;
    return await this.reservationService.cancelReservation(
      reservationId,
      userId,
    );
  }
}
