import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Profile} from "../interfaces/profile.interface";
import {Pageable} from "../interfaces/pageable.interface";
import {map, tap} from "rxjs";
import {environment} from "../../common-ui/environments/environment";

@Injectable({
   providedIn: 'root'
})
export class ProfileService {

   constructor(private http: HttpClient) {
   }

   me = signal<Profile | null>(null);
   filteredProfiles = signal<Profile[]>([]);

   getTestAccounts() {
      return this.http.get<Profile[]>(`${environment.url}account/test_accounts`);
   }

   getMe() {
      return this.http.get<Profile>(`${environment.url}account/me`)
         .pipe(
            tap(res => this.me.set(res))
         )
   }

   getAccount(id: string) {
      return this.http.get<Profile>(`${environment.url}account/${id}`)
   }

   getSubscribersShortList(subsAmount = 4) {
      return this.http.get<Pageable<Profile>>(`${environment.url}account/subscribers/`)
         .pipe(
            map(response => response.items.slice(1, subsAmount))
         )
   }

   patchProfile(profile: Partial<Profile>) {
      return this.http.patch<Profile>(`${environment.url}account/me`, profile);
   }

   uploadAvatar(file: File) {
      const fd = new FormData();
      fd.append('image', file);
      return this.http.post<Profile[]>(`${environment.url}account/upload_image`, fd);
   }

   filterProfiles(params: Record<string, any>) {
      return this.http.get<Pageable<Profile>>(`${environment.url}account/accounts`, {params})
         .pipe(
            tap(res => this.filteredProfiles.set(res.items))
         )
   }
}
