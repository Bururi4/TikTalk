import {
   AfterViewInit,
   Component,
   DestroyRef,
   ElementRef,
   HostListener,
   inject,
   input,
   Input,
   Renderer2,
   Signal,
} from '@angular/core';
import { Post, PostCreateDto, Profile } from '@tt/data-access';
import { fromEvent, throttleTime } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { Optimization } from '@tt/shared';
import { PostComponent } from '../post/post.component';
import { Store } from '@ngrx/store';
import { postActions, selectPosts } from '../../data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-post-feed',
   standalone: true,
   imports: [PostInputComponent, PostComponent],
   templateUrl: './post-feed.component.html',
   styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
   @Input() profile!: Profile;
   me = input<Profile>();
   hostElement = inject(ElementRef);
   r2 = inject(Renderer2);
   destroyRef = inject(DestroyRef);
   post = input<Post>();
   store = inject(Store);
   feed: Signal<Post[] | []> = this.store.selectSignal(selectPosts);

   @Input() isCommentInput = false;
   @Input() postId = 0;

   @HostListener('window:resize')
   @Optimization(200)
   onWindowResize() {
      this.resizeFeed();
   }

   ngAfterViewInit() {
      this.resizeFeed();

      fromEvent(window, 'resize')
         .pipe(throttleTime(200), takeUntilDestroyed(this.destroyRef))
         .subscribe(() => {
            this.resizeFeed();
         });
   }

   resizeFeed() {
      const { top } = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top - 24 - 24;
      this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
   }

   postCreated(post: PostCreateDto) {
      this.store.dispatch(postActions.createPost({ post }));
   }
}
