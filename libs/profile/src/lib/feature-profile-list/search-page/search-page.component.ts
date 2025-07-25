import { Component } from '@angular/core';
import { ProfileService } from '@tt/data-access';
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [ProfileCardComponent, ProfileFiltersComponent],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
   profiles = this.profileService.filteredProfiles;

   constructor(private profileService: ProfileService) {

   }
}
