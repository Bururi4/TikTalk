import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Post, PostComment } from '../../data';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { CommentComponent } from '../../ui/comment/comment.component';
import { PostService } from '../../data';
import { firstValueFrom } from 'rxjs';
import {ProfileService} from "../../../../../../apps/tik-talk/src/app/data/services/profile.service";
import {CustomDatePipe} from "../../../../../../apps/tik-talk/src/app/helpers/pipes/custom-date.pipe";
import {SvgComponent} from "../../../../../../apps/tik-talk/src/app/common-ui/svg/svg.component";
import {
   AvatarCircleComponent
} from "../../../../../../apps/tik-talk/src/app/common-ui/avatar-circle/avatar-circle.component";

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
   profile = inject(ProfileService).me;

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
