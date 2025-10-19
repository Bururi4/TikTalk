import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   forwardRef,
   inject,
   Input,
   input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
   ControlValueAccessor,
   NG_VALUE_ACCESSOR,
   ReactiveFormsModule,
} from '@angular/forms';

@Component({
   selector: 'tt-input',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './tt-input.component.html',
   styleUrl: './tt-input.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         multi: true,
         useExisting: forwardRef(() => TtInputComponent),
      },
   ],
})
export class TtInputComponent implements ControlValueAccessor {
   type = input<'text' | 'password'>('text');
   placeholder = input<string>('');
   value: string | null = null;
   cdr = inject(ChangeDetectorRef);
   @Input() showSvg = true;

   onChange(value: any): void {}

   onTouched(): void {}

   writeValue(obj: any): void {
      this.value = obj;
      this.cdr.markForCheck();
   }

   registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   onModelChange(event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.value = value;
      this.onChange(value);
   }
}
