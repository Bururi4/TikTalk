import {
   ChangeDetectionStrategy,
   Component,
   EventEmitter, HostBinding,
   inject, Input, input,
   Output,
   Renderer2
} from '@angular/core';
import { AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectMeProfile } from '@tt/profile';
import { CommentCreateDto, PostCreateDto, ProfileService } from '@tt/data-access';

@Component({
   imports: [AvatarCircleComponent, FormsModule, SvgComponent],
   standalone: true,
   selector: 'app-message-input',
   styleUrl: './message-input.component.scss',
   templateUrl: './message-input.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
   r2 = inject(Renderer2);
   postText = '';
   isCommentInput = input(false);
   postId = input<number>(0);
   profileService = inject(ProfileService);
   profile = this.profileService.me;
   store = inject(Store);
   me = this.store.selectSignal(selectMeProfile)();
   @Output() createdMessage = new EventEmitter<string>();

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
      this.createdMessage.emit(this.postText);
      this.postText = '';
      return;
   }
}
