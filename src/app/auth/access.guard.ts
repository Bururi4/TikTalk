import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const accessGuard = () => {
   const isLoggedIn = inject(AuthService).isAuthenticated;

   if (isLoggedIn) {
      return true;
   }

   return inject(Router).createUrlTree(['/login']);
};
