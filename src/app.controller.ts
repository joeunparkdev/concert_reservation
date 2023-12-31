import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('Health-Check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Hello',
    description: 'Endpoint to get a hello message',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
