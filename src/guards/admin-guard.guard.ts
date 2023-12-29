import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
  

    if (!request.user) {
      console.log('No user in the request');
      return false;
    }

    const userId = request.user.userId;

    if (!userId) {
      console.log('Invalid user ID');
      return false;
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      console.log('User not found');
      return false;
    }

    console.log('User isAdmin:', user.isAdmin);

    return user.isAdmin;
  }
}
