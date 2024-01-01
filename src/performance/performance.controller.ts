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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { Performance } from './entities/performance.entity';
import { PerformanceService } from './performance.service';

@ApiTags('Performance')
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  async getAllPerformances() {
    return this.performanceService.getAllPerformances();
  }

  @Get('search')
  async searchPerformancesByName(@Query('name') name: string) {
    return this.performanceService.getPerformancesByName(name);
  }

  @Get(':id')
  async getPerformanceDetails(@Param('id') id: number) {
    return this.performanceService.getPerformanceDetails(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  createPerformance(
    @UserInfo() user: User,
    @Body() data: CreatePerformanceDto,
  ): Promise<Performance> {
    return this.performanceService.createPerformance(user, data);
  }
}
