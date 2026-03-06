import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  if(!inject(UserService).currentUser)
    return createUrlTreeFromSnapshot(route, ["/login"]);
  else return true;
};
