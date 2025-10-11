import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '@tt/common-ui';
import { TokenResponse } from '../interfaces/auth.interface';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   constructor(private http: HttpClient, private router: Router) {}

   accessToken: string | null = null;
   refreshToken: string | null = null;
   cookieService = inject(CookieService);

   get isAuthenticated() {
      if (!this.accessToken) {
         this.accessToken = this.cookieService.get('access_token');
         this.refreshToken = this.cookieService.get('refresh_token');
      }

      return !!this.accessToken;
   }

   login(payload: { username: string; password: string }) {
      const fd = new FormData();

      fd.append('username', payload.username);
      fd.append('password', payload.password);

      return this.http
         .post<TokenResponse>(`${environment.url}auth/token`, fd)
         .pipe(tap((val) => this.saveTokens(val)));
   }

   refreshAuthToken() {
      return this.http
         .post<TokenResponse>(`${environment.url}auth/refresh`, {
            refresh_token: this.refreshToken,
         })
         .pipe(
            tap((val) => this.saveTokens(val)),
            catchError((error) => {
               this.logout();
               return throwError(error);
            })
         );
   }

   logout() {
      this.cookieService.deleteAll();
      this.accessToken = null;
      this.refreshToken = null;
      this.router.navigate(['/login']);
   }

   saveTokens(res: TokenResponse) {
      this.accessToken = res.access_token;
      this.refreshToken = res.refresh_token;

      this.cookieService.set('access_token', this.accessToken, { path: '/' });
      this.cookieService.set('refresh_token', this.refreshToken, { path: '/' });
   }
}
