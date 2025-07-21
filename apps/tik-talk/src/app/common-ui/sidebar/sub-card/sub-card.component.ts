import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../../helpers/pipes/img-url.pipe';

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
