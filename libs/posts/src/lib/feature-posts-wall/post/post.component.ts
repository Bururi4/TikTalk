import { Component, inject, input } from '@angular/core';
import {
   Post,
   PostComment,
   CommentCreateDto,
   Profile,
} from '@tt/data-access';
import { PostInputComponent, CommentComponent } from '../../ui';
import {
   AvatarCircleComponent,
   CustomDatePipe,
   SvgComponent,
} from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { postActions } from '../../data';

@Component({
   selector: 'app-post',
   standalone: true,
   imports: [
      AvatarCircleComponent,
      SvgComponent,
      PostInputComponent,
      CommentComponent,
      CustomDatePipe,
   ],
   templateUrl: './post.component.html',
   styleUrl: './post.component.scss',
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
