import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '@tt/data-access';

export const profileActions = createActionGroup({
   source: 'profile',
   events: {
      'filter events': props<{ filters: Record<string, any> }>(),
      'profiles loaded': props<{ profiles: Profile[] }>(),
      'set page': props<{ page?: number }>(),
      'get myProfile ': emptyProps(),
      'myProfile loaded': props<{ me: Profile }>(),
      'get accountId': props<{ id: string }>(),
      'profileId loaded': props<{ profile: Profile }>(),
      'get subscribers shortlist': props<{ amount: number }>(),
      'subscribers shortlist loaded': props<{ subscribers: Profile[] }>(),
   },
});
