import {
   AfterViewInit,
   Component,
   DestroyRef,
   ElementRef,
   HostListener,
   inject,
   Input,
   Renderer2,
} from '@angular/core';
import { PostService } from '../../data';
import { firstValueFrom } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { GlobalStoreService, Optimization } from '@tt/shared';
import { PostComponent } from '../post/post.component';

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
   profile = inject(GlobalStoreService).me;
   @Input() isCommentInput = false;
   @Input() postId = 0;

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
