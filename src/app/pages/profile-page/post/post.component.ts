import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {SvgComponent} from "../../../common-ui/svg/svg.component";
import {PostInputComponent} from "../post-input/post-input.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";
import {CustomDatePipe} from "../../../helpers/pipes/custom-date.pipe";
import {ProfileService} from "../../../data/services/profile.service";

@Component({
   selector: 'app-post',
   standalone: true,
   imports: [
      AvatarCircleComponent,
      DatePipe,
      SvgComponent,
      PostInputComponent,
      CommentComponent,
      CustomDatePipe
   ],
   templateUrl: './post.component.html',
   styleUrl: './post.component.scss'
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

      firstValueFrom(this.postService.createComment({
         text: comment,
         authorId: this.profile()!.id,
         postId: this.post()!.id
      })).then(async () => {
         const comments = await firstValueFrom(this.postService.getCommentByPostId(this.post()!.id));
         this.comments.set(comments);
      })
      return;
   }
}
