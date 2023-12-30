import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findByEmail(payload.email);

      if (_.isNil(user)) {
        throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
      }

      return { id: user.id, email: user.email, isAdmin: user.isAdmin };
    } catch (error) {
      console.error('Token validation failed:', error.message);
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
  
  
  
}
