import {
   ChangeDetectionStrategy,
   Component,
   effect,
   inject,
   ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SvgComponent } from '@tt/common-ui';
import { AddressInputComponent, StackInputComponent } from '@tt/chats';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { AvatarUploadComponent } from '../../ui/avatar-upload/avatar-upload.component';
import { ProfileService } from '@tt/data-access';
import { Store } from '@ngrx/store';
import { selectedMyProfile, profileActions } from '@tt/data-access';

@Component({
   selector: 'app-settings-page',
   standalone: true,
   imports: [
      RouterModule,
      ReactiveFormsModule,
      ProfileHeaderComponent,
      AvatarUploadComponent,
      SvgComponent,
      StackInputComponent,
      AddressInputComponent,
   ],
   templateUrl: './settings-page.component.html',
   styleUrl: './settings-page.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
   fb = inject(FormBuilder);
   profileService = inject(ProfileService);
   store = inject(Store);
   profile = this.store.selectSignal(selectedMyProfile);

   constructor() {
      effect(() => {
         //@ts-ignore
         this.form.patchValue({ ...this.profile() });
      });
   }

   @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

   form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      description: [''],
      stack: [''],
      city: [null],
   });

   onSave() {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();

      if (this.form.invalid) return;

      if (this.avatarUploader.avatar) {
         firstValueFrom(
            this.profileService.uploadAvatar(this.avatarUploader.avatar)
         );
      }

      firstValueFrom(
         //@ts-ignore
         this.profileService.patchProfile({
            ...this.form.value,
         })
      );

      this.store.dispatch(profileActions.getMyProfile());
   }

   clearForm() {
      this.form.reset();
   }
}
