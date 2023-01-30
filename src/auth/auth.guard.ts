import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Users } from 'src/users/entities/users.entity';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<AllowedRoles>(
      `roles`,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    // console.log(context);
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // console.log(gqlContext);
    const user: Users = gqlContext[`user`];
    // console.log(user);
    if (!user) {
      return false;
    }

    if (roles.includes(`Any`)) {
      return true;
    }
    return roles.includes(user.role);
  }
}
