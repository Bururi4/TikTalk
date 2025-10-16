import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Profile } from '@tt/data-access';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
   selector: 'app-profile-header',
   standalone: true,
   imports: [AvatarCircleComponent],
   templateUrl: './profile-header.component.html',
   styleUrl: './profile-header.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
   profile = input<Profile>();
}
