import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'customDate',
   standalone: true,
})
export class CustomDatePipe implements PipeTransform {
   transform(value: string | Date | null): string {
      const date = new Date(value + 'Z');
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (isNaN(seconds)) return '';

      const intervals = {
         год: 31536000,
         месяц: 2592000,
         неделя: 604800,
         день: 86400,
         час: 3600,
         минута: 60,
         секунда: 1,
      };

      for (const [unit, unitSeconds] of Object.entries(intervals)) {
         const interval = Math.floor(seconds / unitSeconds);

         if (interval >= 1) {
            return this.getPluralForm(interval, unit);
         }
      }

      return 'только что';
   }

   private getPluralForm(count: number, word: string): string {
      const cases: Record<string, string[]> = {
         год: ['год', 'года', 'лет'],
         месяц: ['месяц', 'месяца', 'месяцев'],
         неделя: ['неделя', 'недели', 'недель'],
         день: ['день', 'дня', 'дней'],
         час: ['час', 'часа', 'часов'],
         минута: ['минута', 'минуты', 'минут'],
         секунда: ['секунда', 'секунды', 'секунд'],
      };

      if (!cases[word]) return `${count} ${word} назад`;

      if (count % 10 === 1 && count % 100 !== 11) {
         return `${count} ${cases[word][0]} назад`;
      } else if (
         count % 10 >= 2 &&
         count % 10 <= 4 &&
         (count % 100 < 10 || count % 100 >= 20)
      ) {
         return `${count} ${cases[word][1]} назад`;
      } else {
         return `${count} ${cases[word][2]} назад`;
      }
   }
}
