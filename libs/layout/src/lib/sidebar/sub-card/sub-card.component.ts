import { Component, Input } from '@angular/core';
import { ImgUrlPipe } from '@tt/common-ui';
import { Profile } from '@tt/interfaces/profile';

@Component({
   selector: 'sub-card',
   standalone: true,
   imports: [ImgUrlPipe],
   templateUrl: './sub-card.component.html',
   styleUrl: './sub-card.component.scss',
})
export class SubCardComponent {
   @Input() profile!: Profile;
}
