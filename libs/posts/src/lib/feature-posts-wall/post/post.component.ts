import {
   ChangeDetectionStrategy,
   Component,
   inject,
   input,
} from '@angular/core';
import {
   Post,
   PostComment,
   CommentCreateDto,
   Profile,
   postActions,
} from '@tt/data-access';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { CommentComponent } from '../../ui/comment/comment.component';
import { AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

@Component({
   selector: 'app-post',
   standalone: true,
   imports: [
      AvatarCircleComponent,
      SvgComponent,
      PostInputComponent,
      CommentComponent,
      DatePipe,
   ],
   templateUrl: './post.component.html',
   styleUrl: './post.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
   post = input<Post>();
   comments = input<PostComment[]>();
   me = input<Profile>();
   store = inject(Store);

   createComment(comment: CommentCreateDto) {
      this.store.dispatch(postActions.createComment({ comment: comment }));
   }
}
