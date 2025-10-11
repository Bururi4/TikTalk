import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions, selectedFilters } from '@tt/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-profile-filters',
   standalone: true,
   imports: [ReactiveFormsModule],
   templateUrl: './profile-filters.component.html',
   styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit {
   fb = inject(FormBuilder);
   destroyRef = inject(DestroyRef);
   store = inject(Store);
   selectedFilters = this.store.selectSignal(selectedFilters);

   searchForm = this.fb.group({
      firstName: [this.selectedFilters().profileFilters?.['firstName'] || ''],
      lastName: [this.selectedFilters().profileFilters?.['lastName'] || ''],
      stack: [this.selectedFilters().profileFilters?.['stack'] || ''],
   });

   ngOnInit() {
      this.searchForm.valueChanges
         .pipe(
            startWith({}),
            debounceTime(300),
            takeUntilDestroyed(this.destroyRef)
         )
         .subscribe((formValue) => {
            this.store.dispatch(
               profileActions.filterEvents({ filters: formValue })
            );
         });
   }
}
