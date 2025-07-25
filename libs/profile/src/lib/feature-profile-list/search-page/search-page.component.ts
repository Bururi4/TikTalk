import { Component } from '@angular/core';
import { ProfileCardComponent, ProfileService, ProfileFiltersComponent } from '@tt/profile';

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [ProfileCardComponent, ProfileFiltersComponent],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
   profiles = this.profileService.filteredProfiles;

   constructor(private profileService: ProfileService) {}
}
