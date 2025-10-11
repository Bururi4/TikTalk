import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@tt/common-ui';
import { Profile } from '../interfaces/profile.interface';
import { Pageable } from '../../shared/interfaces/pageable.interface';

@Injectable({
   providedIn: 'root',
})
export class ProfileService {
   me = signal<Profile | null>(null);
   http = inject(HttpClient);

   getTestAccounts(): Observable<Profile[]> {
      return this.http.get<Profile[]>(
         `${environment.url}account/test_accounts`
      );
   }

   getMe(): Observable<Profile> {
      return this.http.get<Profile>(`${environment.url}account/me`);
   }

   getAccount(id: string): Observable<Profile> {
      return this.http.get<Profile>(`${environment.url}account/${id}`);
   }

   getSubscribersShortlist(subsAmount = 3): Observable<Profile[]> {
      return this.http
         .get<Pageable<Profile>>(`${environment.url}account/subscribers/`)
         .pipe(map((response) => response.items.slice(0, subsAmount)));
   }

   patchProfile(profile: Partial<Profile>): Observable<Profile> {
      return this.http.patch<Profile>(`${environment.url}account/me`, profile);
   }

   uploadAvatar(file: File): Observable<Profile[]> {
      const fd = new FormData();
      fd.append('image', file);
      return this.http.post<Profile[]>(
         `${environment.url}account/upload_image`,
         fd
      );
   }

   filterProfiles(params: Record<string, any>): Observable<Pageable<Profile>> {
      return this.http.get<Pageable<Profile>>(
         `${environment.url}account/accounts`,
         { params }
      );
   }
}
