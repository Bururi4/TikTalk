import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

export const selectProfiles = createSelector(
   profileFeature.selectProfiles,
   (profiles) => profiles
);

export const selectPageableProfiles = createSelector(
   profileFeature.selectProfileFeatureState,
   (state) => {
      return {
         page: state.page,
         size: state.size,
      };
   }
);

export const selectFilters = createSelector(
   profileFeature.selectProfileFeatureState,
   (profileFilters) => profileFilters
);

export const selectMeProfile = createSelector(
   profileFeature.selectMe,
   (me) => me
);

export const selectProfileId = createSelector(
   profileFeature.selectProfileId,
   (profileId) => profileId
);

export const selectSubscribersShortlist = createSelector(
   profileFeature.selectSubscribersShortlist,
   (subscribers) => {
      return subscribers;
   }
);
