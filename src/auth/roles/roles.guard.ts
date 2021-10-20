import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private usersService: UserService,) { }
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<String>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let result; 
    
    if (role == 'user') {
      return true;
    }
    else if (role == 'own') {
      if (request?.params?.tagId) {
        return  this.usersService.checkOwn(user.id, request.params.tagId,'tag')
      }
     else if(request?.params?.postId){
      return  this.usersService.checkOwn(user.id, request.params.postId,'post')
     }
     else if(request?.params?.commentId){
       return this.usersService.checkOwn(user.id,request.params.commentId,'comment')
     }
    }
   
  };
}
