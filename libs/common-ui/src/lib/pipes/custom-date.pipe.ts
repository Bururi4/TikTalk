import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'customDate',
   standalone: true,
})
export class CustomDatePipe implements PipeTransform {
   transform(value: string | null) {
      if (value === null) return;
      const today = new Date(value + 'Z');
      const newDate = new Date();
      const dateDifference = newDate.getTime() - today.getTime();
      let result;

      if (dateDifference < 3600000) {
         result = Math.floor(dateDifference / 60000);
         return `${result} мин назад`;
      } else if (dateDifference < 86400000) {
         result = Math.floor(dateDifference / 3600000);
         return `${result} ч назад`;
      } else {
         result = Math.floor(dateDifference / 86400000);

         const lastNumber = Number(result.toString().at(-1));
         const lastTwoNumbers = result % 100;

         if (lastTwoNumbers >= 11 && lastTwoNumbers <= 14) {
            return `${result} дней назад`;
         } else if (lastNumber === 1) {
            return `${result} день назад`;
         } else if (lastNumber >= 2 && lastNumber <= 4) {
            return `${result} дня назад`;
         } else {
            return `${result} дней назад`;
         }
      }
   }
}
