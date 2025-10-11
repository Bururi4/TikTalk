import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { selectedMyProfile } from '@tt/data-access';
import { SvgComponent, DndDirective, ImgUrlPipe } from '@tt/common-ui';
import { Store } from '@ngrx/store';

@Component({
   selector: 'app-avatar-upload',
   standalone: true,
   imports: [SvgComponent, DndDirective, FormsModule, ImgUrlPipe],
   templateUrl: './avatar-upload.component.html',
   styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
   preview = signal<string>('/assets/images/avatar-placeholder.png');
   store = inject(Store);
   me = this.store.selectSignal(selectedMyProfile);

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
