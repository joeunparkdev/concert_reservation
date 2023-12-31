import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { PerformanceDto } from './dto/performance.dto';
import { Performance } from './entities/performance.entity';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  async getAllPerformances(@Query('name') name?: string) {
    if (name) {
      return this.performanceService.getPerformancesByName(name);
    } else {
      return this.performanceService.getAllPerformances();
    }
  }

  @Get('search')
  async searchPerformancesByName(@Query('name') name: string) {
    return this.performanceService.getPerformancesByName(name);
  }

  @Get(':id')
  async getPerformanceDetails(@Param('id') id: number) {
    return this.performanceService.getPerformanceDetails(id);
  }

  @ApiHeader({
    name: 'token',
  })
  @ApiOkResponse({
    status: 200,
  })
  @UseGuards(AdminGuard)
  @Post()
  createPerformance(
    @UserInfo() user: User,
    @Body() data: PerformanceDto,
  ): Promise<Performance> {

    return this.performanceService.createPerformance(user, data);
  }
}
