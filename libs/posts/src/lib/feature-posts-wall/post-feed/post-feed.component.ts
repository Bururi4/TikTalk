import {
   AfterViewInit,
   Component,
   ElementRef,
   inject,
   input,
   Input,
   Renderer2,
   Signal
} from '@angular/core';
import { Post, PostCreateDto, Profile } from '@tt/data-access';
import { debounceTime, fromEvent } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { Store } from '@ngrx/store';
import { postActions, selectPosts } from '../../data';

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
   store = inject(Store);
   feed: Signal<Post[] | []> = this.store.selectSignal(selectPosts);

   @Input() isCommentInput = false;
   @Input() postId = 0;

   // @HostListener('window:resize')
   // @Optimization(200)
   // onWindowResize() {
   //    this.resizeFeed();
   // }

   ngAfterViewInit() {
      this.resizeFeed();

      fromEvent(window, 'resize')
         .pipe(debounceTime(200))
         .subscribe(() => {
            this.resizeFeed();
         });
   }

   createPost(post: PostCreateDto) {
      this.store.dispatch(postActions.createPost({ post }));
   }

   resizeFeed() {
      const { top } = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top - 24 - 24;
      this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
   }
}
