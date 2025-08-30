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
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import {
   CommentCreateDto,
   PostCreateDto, Profile,
   ProfileService
} from '@tt/data-access';

@Component({
   selector: 'app-post-input',
   standalone: true,
   imports: [AvatarCircleComponent, SvgComponent, FormsModule],
   templateUrl: './post-input.component.html',
   styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
   r2 = inject(Renderer2);
   postText = '';
   isCommentInput = input(false);
   postId = input<number>(0);
   profileService = inject(ProfileService);
   profile = this.profileService.me;
   me = input<Profile>();

   @Input() placeholder = 'Напишите что-нибудь';
   @Output() createdPost = new EventEmitter<PostCreateDto>();
   @Output() createdComment = new EventEmitter<CommentCreateDto>();

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

      if (this.isCommentInput()) {
         this.createdComment.emit({
            text: this.postText,
            authorId: this.profile()!.id,
            postId: this.postId(),
         });
         this.postText = '';
         return;
      }

      this.createdPost.emit({
         title: 'postTitle',
         content: this.postText,
         authorId: this.profile()!.id,
      });
      this.postText = '';
      return;
   }
}
