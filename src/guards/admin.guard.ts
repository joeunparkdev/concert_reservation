import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    console.log(user);
    if (err || !user || !user.isAdmin) {
      throw err || new UnauthorizedException();
    }
  
    return user;
  }
}
