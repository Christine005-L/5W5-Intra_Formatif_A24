import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const catGuardGuard: CanActivateFn = (route, state) => {
  if(!inject(UserService).currentUser?.prefercat)
    return createUrlTreeFromSnapshot(route, ["/dog"]);
  else return true;
};
