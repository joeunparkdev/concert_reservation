import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCustomerAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    console.log('jwt user=' + user);
    console.log('jwt info=' + info);
    console.log('jwt context=' + context);
    console.log(err);
    if (err || !user || !user.isAdmin) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
