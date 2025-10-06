import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '@tt/data-access';

export const profileActions = createActionGroup({
   source: 'profile',
   events: {
      'filter events': props<{ filters: Record<string, any> }>(),
      'set page': props<{ page?: number }>(),
      'profiles loaded': props<{ profiles: Profile[] }>(),
      'get my profile ': emptyProps(),
      'my profile loaded': props<{ me: Profile }>(),
      'get account id': props<{ id: string }>(),
      'profile id loaded': props<{ profile: Profile }>(),
      'get subscribers shortlist': props<{ amount: number }>(),
      'subscribers shortlist loaded': props<{ subscribers: Profile[] }>(),
   },
});
