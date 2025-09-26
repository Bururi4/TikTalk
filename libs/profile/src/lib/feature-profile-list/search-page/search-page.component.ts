import { Component, inject } from '@angular/core';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';
import { selectProfiles } from '../../data';
import { RouterLink } from '@angular/router';

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [ProfileCardComponent, ProfileFiltersComponent, RouterLink],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
   store = inject(Store);
   profiles = this.store.selectSignal(selectProfiles);
}
