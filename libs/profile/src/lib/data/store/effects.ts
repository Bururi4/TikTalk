import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Pageable, Profile, ProfileService } from '@tt/data-access';
import { profileActions } from './actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectedFilters, selectedPageableProfiles } from './selectors';

@Injectable({
   providedIn: 'root',
})
export class ProfileEffects {
   profileService = inject(ProfileService);
   actions$ = inject(Actions);
   store = inject(Store);

   filterProfiles = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.filterEvents),

         // withLatestFrom(this.store.select(selectedPageableProfiles), this.store.select(selectedFilters)),
         // switchMap(([filters, pageable]) => {
         //    return this.profileService.filterProfiles({
         //       ...pageable,
         //       ...filters
         //    });
         // }),
         // map((res: Pageable<Profile>) => profileActions.profilesLoaded({ profiles: res.items }))

         switchMap(({ filters }) => {

            return this.profileService.filterProfiles(filters);
         }),
         map((profile: Pageable<Profile>) => profileActions.profilesLoaded({ profiles: profile.items }))
      );
   });

   getMyProfile = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.getMyProfile),
         switchMap(() => {
            return this.profileService.getMe();
         }),
         map((profile: Profile) =>
            profileActions.myProfileLoaded({ me: profile })
         )
      );
   });

   getAccountId = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.getAccountId),
         switchMap(({ id }) => {
            return this.profileService.getAccount(id);
         }),
         map((profile) => profileActions.profileIdLoaded({ profile: profile }))
      );
   });

   getSubscribersShortlist = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.getSubscribersShortlist),
         switchMap(({ amount }) => {
            return this.profileService.getSubscribersShortlist(amount);
         }),
         map((profile) => {
            return profileActions.subscribersShortlistLoaded({
               subscribers: profile,
            });
         })
      );
   });
}
