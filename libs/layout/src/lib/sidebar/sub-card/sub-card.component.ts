import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ImgUrlPipe } from '@tt/common-ui';
import { Profile } from '@tt/data-access';
import { RouterLink } from '@angular/router';

@Component({
   selector: 'app-sub-card',
   standalone: true,
   imports: [ImgUrlPipe, RouterLink],
   templateUrl: './sub-card.component.html',
   styleUrl: './sub-card.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubCardComponent {
   @Input() profile!: Profile;
}
