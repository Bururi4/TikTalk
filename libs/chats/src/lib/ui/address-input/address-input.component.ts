import {
   ChangeDetectionStrategy,
   Component,
   forwardRef,
   inject,
   input,
   signal,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
   ControlValueAccessor,
   FormControl,
   NG_VALUE_ACCESSOR,
   ReactiveFormsModule,
} from '@angular/forms';
import { TtInputComponent } from '../tt-input/tt-input.component';
import { debounceTime, switchMap, tap } from 'rxjs';
import { DataService } from '../../data/services/data.service';

@Component({
   selector: 'address-input',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, AsyncPipe, TtInputComponent],
   templateUrl: './address-input.component.html',
   styleUrl: './address-input.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         multi: true,
         useExisting: forwardRef(() => AddressInputComponent),
      },
   ],
})
export class AddressInputComponent implements ControlValueAccessor {
   innerSearchControl = new FormControl();
   #dataService = inject(DataService);
   showDropdown = signal<boolean>(true);

   suggestions$ = this.innerSearchControl.valueChanges.pipe(
      debounceTime(500),
      switchMap((value) => {
         return this.#dataService.getSuggestion(value).pipe(
            tap((res) => {
               this.showDropdown.set(!!res.length);
            })
         );
      })
   );

   onChange(value: any): void {}

   onTouched(): void {}

   registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   setDisabledState?(isDisabled: boolean): void {}

   writeValue(city: string | null): void {
      this.innerSearchControl.patchValue(city, {
         emitEvent: false,
      });
   }

   onSuggestionChoose(city: string) {
      this.showDropdown.set(false);

      this.innerSearchControl.patchValue(city, {
         emitEvent: false,
      });

      this.onChange(city);
   }
}
