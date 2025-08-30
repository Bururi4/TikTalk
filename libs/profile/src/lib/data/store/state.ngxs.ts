import { Pageable, Profile, ProfileService } from '@tt/data-access';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { FilterEvents } from './actions.ngxs';
import { Observable, tap } from 'rxjs';

export interface ProfileStateModel {
   profiles: Profile[];
   profileFilters: Record<string, any>;
}

@State({
   name: 'profileState',
   defaults: {
      profiles: [],
      profileFilters: {}
   }
})
@Injectable()
export class ProfileState {
   #profileService = inject(ProfileService);

   @Selector()
   static getProfiles(state: ProfileStateModel): Profile[] {
      return state.profiles;
   }

   @Action(FilterEvents)
   onFilterEvents(ctx: StateContext<ProfileStateModel>, {filters}: FilterEvents): Observable<Pageable<Profile>> {
      return this.#profileService.filterProfiles(filters).pipe(
         tap(res => {
            ctx.patchState({
               profiles: res.items
            })
         })
      )
   }
}
