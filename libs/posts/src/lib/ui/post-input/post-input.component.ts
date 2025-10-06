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
import { CommentCreateDto, PostCreateDto, Profile } from '@tt/data-access';

@Component({
   selector: 'app-post-input',
   standalone: true,
   imports: [AvatarCircleComponent, SvgComponent, FormsModule],
   templateUrl: './post-input.component.html',
   styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
   profile = input<Profile>();
   isCommentInput = input(false);
   postId = input<number>(0);
   r2 = inject(Renderer2);
   postText = '';

   @Input() placeholder = 'Напишите что-нибудь';
   @Output() createdPost = new EventEmitter<PostCreateDto>();
   @Output() createdComment = new EventEmitter<CommentCreateDto>();

   @HostBinding('class')
   get isComment() {
      return { comment: this.isCommentInput() };
   }

   // ngOnInit() {
   //    console.log('Profile', this.profile());
   // }
   //
   // ngOnChanges() {
   //    console.log('Profile', this.profile());
   // }

   onTextAreaInput(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.r2.setStyle(textarea, 'height', 'auto');
      this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
   }

   onEnterKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
         event.preventDefault();
         event.stopPropagation();
         this.createPost();
      }
   }

   createPost() {
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
         title: 'new post',
         content: this.postText,
         authorId: this.profile()!.id,
      });

      this.postText = '';
      return;
   }
}
