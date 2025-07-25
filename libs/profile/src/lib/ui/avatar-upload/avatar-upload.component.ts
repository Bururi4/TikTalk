import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '@tt/data-access';
import { SvgComponent, DndDirective, ImgUrlPipe } from '@tt/common-ui';

@Component({
   selector: 'app-avatar-upload',
   standalone: true,
   imports: [SvgComponent, DndDirective, FormsModule, ImgUrlPipe],
   templateUrl: './avatar-upload.component.html',
   styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
   profileService = inject(ProfileService);

   preview = signal<string>('/assets/images/avatar-placeholder.png');
   me = this.profileService.me;

   avatar: File | null = null;

   fileBrowserHandler(event: Event) {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      this.processFile(file);
   }

   onFileDropped(file: File) {
      this.processFile(file);
   }

   processFile(file: File | null | undefined) {
      if (!file || !file.type.match('image')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         this.preview.set(event.target?.result?.toString() ?? '');
      };

      reader.readAsDataURL(file);
      this.avatar = file;
   }
}
