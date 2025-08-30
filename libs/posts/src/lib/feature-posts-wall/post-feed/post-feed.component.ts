import {
   AfterViewInit,
   Component,
   DestroyRef,
   ElementRef,
   HostListener,
   inject,
   input,
   Input,
   OnInit,
   Renderer2, Signal
} from '@angular/core';
import {
   GlobalStoreService,
   Post,
   PostCreateDto,
   Profile,
} from '@tt/data-access';
import { fromEvent, throttleTime } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { Optimization } from '@tt/shared';
import { PostComponent } from '../post/post.component';
import { Store } from '@ngrx/store';
import { postActions, selectPosts } from '../../data';
import { NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-post-feed',
   standalone: true,
   imports: [PostInputComponent, PostComponent],
   templateUrl: './post-feed.component.html',
   styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements OnInit, AfterViewInit {
   @Input() profile!: Profile;
   me = input<Profile>();
   hostElement = inject(ElementRef);
   r2 = inject(Renderer2);
   destroyRef = inject(DestroyRef);
   // profile = inject(GlobalStoreService).me;
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

   ngOnInit() {
      this.store.dispatch(postActions.fetchPosts({}));
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
