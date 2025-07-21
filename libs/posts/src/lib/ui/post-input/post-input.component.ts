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
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { ProfileService } from '../../../data/services/profile.service';
import { SvgComponent } from '../../../common-ui/svg/svg.component';
import { PostService } from '../../../data/services/post.service';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-post-input',
   standalone: true,
   imports: [AvatarCircleComponent, SvgComponent, FormsModule],
   templateUrl: './post-input.component.html',
   styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
   r2 = inject(Renderer2);
   profile = inject(ProfileService).me;
   postService = inject(PostService);
   postText = '';
   isCommentInput = input(false);
   postId = input<number>(0);

   @Input() placeholder: string = 'Напишите что-нибудь';
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
