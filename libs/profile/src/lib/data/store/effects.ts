import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '@tt/data-access';
import { profileActions } from './actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPageableProfiles, selectFilters } from './selectors';

@Injectable({
   providedIn: 'root',
})
export class ProfileEffects {
   profileService = inject(ProfileService);
   actions$ = inject(Actions);
   store = inject(Store);

   filterProfiles = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.filterEvents, profileActions.setPage),
         withLatestFrom(
            this.store.select(selectPageableProfiles),
            this.store.select(selectFilters)
         ),
         switchMap(([_, filters, pageable]) => {
            return this.profileService.filterProfiles({
               ...pageable,
               ...filters,
            });
         }),
         map((res) => profileActions.profilesLoaded({ profiles: res.items }))
      );
   });

   getMyProfile = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.getMyProfile),
         switchMap(() => {
            return this.profileService.getMe();
         }),
         map((profile) => profileActions.myProfileLoaded({ me: profile }))
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

   getSubscribersShortList = createEffect(() => {
      return this.actions$.pipe(
         ofType(profileActions.getSubscribersShortlist),
         switchMap(({ amount }) => {
            return this.profileService.getSubscribersShortList(amount);
         }),
         map((profile) => {
            return profileActions.subscribersShortlistLoaded({
               subscribers: profile,
            });
         })
      );
   });
}
