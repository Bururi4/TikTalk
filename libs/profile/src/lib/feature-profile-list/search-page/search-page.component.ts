import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';
import { profileActions, selectedProfiles } from '@tt/data-access';
import { RouterLink } from '@angular/router';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [
      ProfileCardComponent,
      ProfileFiltersComponent,
      RouterLink,
      InfiniteScrollTriggerComponent,
   ],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
   store = inject(Store);
   profiles = this.store.selectSignal(selectedProfiles);

   timeToFetch() {
      this.store.dispatch(profileActions.setPage({}));
   }
}
