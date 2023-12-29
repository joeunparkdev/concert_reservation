import { EntityRepository, Repository } from 'typeorm';
import { Performance } from './performance.entity';

@EntityRepository(Performance)
export class PerformanceRepository extends Repository<Performance> {}
