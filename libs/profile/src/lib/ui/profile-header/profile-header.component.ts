import { Component, input } from '@angular/core';
import { Profile } from '@tt/data-access';
import { AvatarCircleComponent, ImgUrlPipe } from '@tt/common-ui';

@Component({
   selector: 'profile-header',
   standalone: true,
   imports: [ImgUrlPipe, AvatarCircleComponent],
   templateUrl: './profile-header.component.html',
   styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
   profile = input<Profile>();
}
