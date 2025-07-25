import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs';
import { ProfileService } from '@tt/data-access';

@Component({
   selector: 'app-profile-filters',
   standalone: true,
   imports: [ReactiveFormsModule],
   templateUrl: './profile-filters.component.html',
   styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
   searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      stack: [''],
   });

   searchFormSub!: Subscription;

   constructor(
      private formBuilder: FormBuilder,
      private profileService: ProfileService
   ) {
      this.searchFormSub = this.searchForm.valueChanges
         .pipe(
            startWith({}),
            debounceTime(500),
            switchMap((formValue) => {
               return this.profileService.filterProfiles(formValue);
            })
         )
         .subscribe();
   }

   ngOnDestroy() {
      this.searchFormSub.unsubscribe();
   }
}
