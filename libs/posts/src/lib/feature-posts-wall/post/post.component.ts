import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
   Post,
   PostComment,
   GlobalStoreService,
   CommentCreateDto,
   Profile,
} from '@tt/data-access';
import { PostInputComponent, CommentComponent } from '../../ui';
import { AvatarCircleComponent, SvgComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { postActions } from '../../data';
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
})
export class PostComponent {
   post = input<Post>();
   comments = input<PostComment[]>();
   // comments = signal<PostComment[]>([]);
   profile = inject(GlobalStoreService).me;
   me = input<Profile>();
   store = inject(Store);

   createComment(comment: CommentCreateDto) {
      this.store.dispatch(postActions.createComment({ comment: comment }));
   }
}
