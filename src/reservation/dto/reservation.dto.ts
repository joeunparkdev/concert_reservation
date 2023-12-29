import { PerformanceDto } from '../../performance/dto/performance.dto';

export class ReservationDto {
  performanceId: number;
  userId: number;
  reservationId: number;
  performance: PerformanceDto;
}