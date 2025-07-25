import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Post, PostComment, PostService, GlobalStoreService } from '@tt/data-access';
import { PostInputComponent, CommentComponent } from '../../ui';
import { firstValueFrom } from 'rxjs';
import { AvatarCircleComponent, CustomDatePipe, SvgComponent } from '@tt/common-ui';

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
export class PostComponent implements OnInit {
   post = input<Post>();
   comments = signal<PostComment[]>([]);
   profile = inject(GlobalStoreService).me;

   postService = inject(PostService);

   async ngOnInit() {
      this.comments.set(this.post()!.comments);
   }

   async onCreated(comment: string) {
      if (!comment) return;

      firstValueFrom(
         this.postService.createComment({
            text: comment,
            authorId: this.profile()!.id,
            postId: this.post()!.id,
         })
      ).then(async () => {
         const comments = await firstValueFrom(
            this.postService.getCommentByPostId(this.post()!.id)
         );
         this.comments.set(comments);
      });
      return;
   }
}
