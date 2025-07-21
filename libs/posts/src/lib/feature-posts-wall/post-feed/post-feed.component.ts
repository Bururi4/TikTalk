import {
   AfterViewInit,
   Component,
   DestroyRef,
   ElementRef,
   EventEmitter,
   HostListener,
   inject,
   input,
   Input,
   Output,
   Renderer2,
} from '@angular/core';
import { PostInputComponent } from '../../ui/post-input/post-input.component';
import { PostComponent } from '../post/post.component';
import { PostService } from '../../data';
import { firstValueFrom, fromEvent, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {ProfileService} from "../../../../../../apps/tik-talk/src/app/data/services/profile.service";
import {Optimization} from "../../../../../../apps/tik-talk/src/app/helpers/decorators/resize";

@Component({
   selector: 'app-post-feed',
   standalone: true,
   imports: [PostInputComponent, PostComponent],
   templateUrl: './post-feed.component.html',
   styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
   postService = inject(PostService);
   hostElement = inject(ElementRef);
   r2 = inject(Renderer2);
   feed = inject(PostService).posts;
   destroyRef = inject(DestroyRef);

   profile = inject(ProfileService).me;
   @Input() isCommentInput: boolean = false;
   @Input() postId: number = 0;

   @HostListener('window:resize')
   @Optimization(200)
   onWindowResize() {
      console.log(123);
      this.resizeFeed();
   }

   constructor() {
      firstValueFrom(this.postService.fetchPosts());
   }

   ngAfterViewInit() {
      this.resizeFeed();
      // this.resizeOptimization();
   }

   resizeFeed() {
      const { top } = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top - 24 - 24;
      this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
   }

   // resizeOptimization() {
   //    fromEvent(window, 'resize')
   //       .pipe(throttleTime(200), takeUntilDestroyed(this.destroyRef))
   //       .subscribe(() => {
   //          console.log(123);
   //          this.resizeFeed();
   //       })
   // }

   onCreatedPost(postText: string) {
      if (!postText) return;

      firstValueFrom(
         this.postService.createPost({
            title: 'Клевый пост',
            content: postText,
            authorId: this.profile()!.id,
         })
      ).then(() => {
         postText = '';
      });
   }
}
