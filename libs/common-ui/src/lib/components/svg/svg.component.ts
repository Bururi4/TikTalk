import { Component, Input } from '@angular/core';

@Component({
   // eslint-disable-next-line @angular-eslint/component-selector
   selector: 'svg[icon]',
   standalone: true,
   imports: [],
   template: '<svg:use [attr.href]="href"></svg:use>',
   styles: [''],
})
export class SvgComponent {
   @Input() icon = '';

   get href() {
      return `/assets/svg/${this.icon}.svg#${this.icon}`;
   }
}
