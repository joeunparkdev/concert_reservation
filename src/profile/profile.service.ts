import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity'; 
import { UserRepository } from '../user/entities/user.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 여기에서 사용자 프로필 정보를 가공하여 반환
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
