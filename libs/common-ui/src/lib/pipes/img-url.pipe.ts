import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@tt/common-ui';

@Pipe({
   name: 'imgUrl',
   standalone: true,
})
export class ImgUrlPipe implements PipeTransform {
   transform(value: string | null): string | null {
      if (!value) return null;
      return `${environment.url}${value}`;
   }
}
