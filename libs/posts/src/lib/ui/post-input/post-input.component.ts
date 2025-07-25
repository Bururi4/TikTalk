import {
   Component,
   EventEmitter,
   HostBinding,
   inject,
   Input,
   input,
   Output,
   Renderer2,
} from '@angular/core';
import { PostService } from '@tt/data-access';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import { GlobalStoreService } from '@tt/data-access';

@Component({
   selector: 'app-post-input',
   standalone: true,
   imports: [AvatarCircleComponent, SvgComponent, FormsModule],
   templateUrl: './post-input.component.html',
   styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
   r2 = inject(Renderer2);
   postService = inject(PostService);
   profile = inject(GlobalStoreService).me;
   postText = '';
   isCommentInput = input(false);
   postId = input<number>(0);

   @Input() placeholder = 'Напишите что-нибудь';
   @Output() created = new EventEmitter<string>();

   @HostBinding('class.comment')
   get isComment() {
      return this.isCommentInput();
   }

   onTextAreaInput(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.r2.setStyle(textarea, 'height', 'auto');
      this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
   }

   sendPost() {
      if (!this.postText) return;
      this.created.emit(this.postText);
      this.postText = '';
   }
}
