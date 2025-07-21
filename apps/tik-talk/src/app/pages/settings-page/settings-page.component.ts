import { Component, effect, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { SvgComponent } from '../../common-ui/svg/svg.component';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { StackInputComponent } from '../../common-ui/stack-input/stack-input.component';

@Component({
   selector: 'app-settings-page',
   standalone: true,
   imports: [
      ProfileHeaderComponent,
      ReactiveFormsModule,
      AvatarUploadComponent,
      SvgComponent,
      AsyncPipe,
      StackInputComponent,
      RouterModule
   ],
   templateUrl: './settings-page.component.html',
   styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
   constructor(
      private fb: FormBuilder,
      private profileService: ProfileService,
      private activatedRoute: ActivatedRoute
   ) {
      effect(() => {
         //@ts-ignore
         this.form.patchValue({ ...this.profileService.me() });
      });
   }

   profile$ = toObservable(this.profileService.me);

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
   }

   clearForm() {
      this.form.reset();
   }
}
