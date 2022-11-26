import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// https://github.com/nestjs/nest/issues/964#issuecomment-480834786
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());

    if(isPublic) {
      console.log("public route")
      return true;
    }

    return true;
  }
}
