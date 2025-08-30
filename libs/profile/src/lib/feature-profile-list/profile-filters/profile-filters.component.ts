import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions } from '../../data';

@Component({
   selector: 'app-profile-filters',
   standalone: true,
   imports: [ReactiveFormsModule],
   templateUrl: './profile-filters.component.html',
   styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
   store = inject(Store);
   searchFormSub!: Subscription;

   searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      stack: [''],
   });

   constructor(private formBuilder: FormBuilder) {
      this.searchFormSub = this.searchForm.valueChanges
         .pipe(
            startWith({}),
            debounceTime(200),
         )
         .subscribe((formValue) => {
            this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
         });
   }

   ngOnDestroy() {
      this.searchFormSub.unsubscribe();
   }
}
