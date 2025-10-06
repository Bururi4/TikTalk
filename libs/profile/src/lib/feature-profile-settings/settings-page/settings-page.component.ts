import {
   Component,
   effect,
   inject,
   ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SvgComponent } from '@tt/common-ui';
import { StackInputComponent } from '@tt/chats';
import { AvatarUploadComponent } from '../../ui/avatar-upload/avatar-upload.component';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { ProfileService } from '@tt/data-access';
import { Store } from '@ngrx/store';
import { selectedMyProfile } from '../../data/store/selectors';
import { profileActions } from '../../data/store/actions';

@Component({
   selector: 'app-settings-page',
   standalone: true,
   imports: [
      ProfileHeaderComponent,
      ReactiveFormsModule,
      AvatarUploadComponent,
      SvgComponent,
      StackInputComponent,
      RouterModule,
   ],
   templateUrl: './settings-page.component.html',
   styleUrl: './settings-page.component.scss'
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
