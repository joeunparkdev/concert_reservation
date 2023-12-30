import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      point: 1000000,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'point'],
      where: { email },
    });
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAdmin(email: string, password: string) {
    const existingAdmin = await this.userRepository.findOne({ where: { isAdmin: true } });

    if (existingAdmin) {
      throw new ConflictException('이미 어드민 계정이 존재합니다.');
    }

    const hashedPassword = await hash(password, 10);

    const adminUser = this.userRepository.create({
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await this.userRepository.save(adminUser);
  }
  
  //TODO: REMOVE
  async createInitialAdmin() {
    const existingAdmin = await this.userRepository.findOne({ where: { isAdmin: true } });
  
    if (!existingAdmin) {
      const hashedPassword = await hash('admin_password', 10);
  
      const adminUser = this.userRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      });
  
      await this.userRepository.save(adminUser);
    }
  }
  
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async grantAdminRole(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (user) {
      user.isAdmin = true;
      await this.userRepository.save(user);
      console.log(`Admin role granted for user with ID ${id}`);
    }
  }
}
