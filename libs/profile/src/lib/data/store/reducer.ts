import { Profile } from '@tt/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

export interface ProfileState {
   profiles: Profile[];
   profileFilters: Record<string, any>;
   me: Profile | null;
   profileId: Profile | null;
   subscribersShortlist: Profile[];
   page: number;
   size: number;
}

export const initialState: ProfileState = {
   profiles: [],
   profileFilters: {},
   me: null,
   profileId: null,
   subscribersShortlist: [],
   page: 0,
   size: 10,
};

export const profileFeature = createFeature({
   name: 'profileFeature',
   reducer: createReducer(
      initialState,
      on(profileActions.profilesLoaded, (state, payload) => {
         return {
            ...state,
            profiles: payload.profiles,
         };
      }),

      on(profileActions.filterEvents, (state, payload) => {
         return {
            ...state,
            profiles: [],
            profileFilters: payload.filters,
            page: 1,
         };
      }),

      on(profileActions.setPage, (state, payload) => {
         let page = payload.page;
         if (!page) page = state.page + 1;
         return {
            ...state,
            page,
         };
      }),

      on(profileActions.myProfileLoaded, (state, payload) => {
         return {
            ...state,
            me: payload.me,
         };
      }),

      on(profileActions.profileIdLoaded, (state, payload) => {
         return {
            ...state,
            profileId: payload.profile,
         };
      }),

      on(profileActions.subscribersShortlistLoaded,
         (state, { subscribers }) => {
            return {
               ...state,
               subscribersShortList: subscribers,
            };
         }
      )
   ),
});
