import { Component, input, OnInit, signal } from '@angular/core';

@Component({
   selector: 'app-group-by-date',
   imports: [],
   templateUrl: './group-by-date.html',
   styleUrl: './group-by-date.scss',
   standalone: true,
})
export class GroupByDateComponent implements OnInit {
   messageDate = input<string>();
   dateOutput = signal<string>('');

   ngOnInit() {
      const dateValue = this.messageDate();
      if (!dateValue) return;

      const dateArr = dateValue.slice(0, 10).split('-');
      const now = new Date();

      const dateObj = {
         year: now.getFullYear().toString(),
         month:
            now.getMonth().toString().length === 1
               ? `0${now.getMonth() + 1}`
               : `${now.getMonth() + 1}`,
         day: now.getDate().toString(),
      };

      const dateMesObj = {
         year: dateArr[0],
         month: dateArr[1],
         day: dateArr[2],
      };

      if (
         dateObj.year === dateMesObj.year &&
         dateObj.month === dateMesObj.month &&
         dateObj.day === dateMesObj.day
      ) {
         return this.dateOutput.set('Сегодня');
      } else if (
         dateObj.year === dateMesObj.year &&
         dateObj.month === dateMesObj.month &&
         dateObj.day === (Number(dateMesObj.day) + 1).toString()
      ) {
         return this.dateOutput.set('Вчера');
      }
      return this.dateOutput.set(
         `${dateMesObj.day}.${dateMesObj.month}.${dateMesObj.year}`
      );
   }
}
