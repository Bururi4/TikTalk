import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions } from './actions';
import { ProfileService } from '../services/profile.service';
import { Pageable } from '../../shared/interfaces/pageable.interface';
import { Profile } from '../interfaces/profile.interface';
import { selectProfileFilters, selectProfilePageable } from './selectors';

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
            this.store.select(selectProfileFilters),
            this.store.select(selectProfilePageable)
         ),
         switchMap(([_, filters, pageable]) => {
            return this.profileService.filterProfiles({
               ...pageable,
               ...filters,
            });
         }),
         map((profile: Pageable<Profile>) =>
            profileActions.profilesLoaded({ profiles: profile.items })
         )
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
