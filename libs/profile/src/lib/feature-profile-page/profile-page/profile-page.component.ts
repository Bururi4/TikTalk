import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { postActions, PostFeedComponent } from '@tt/posts';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';
import { Store } from '@ngrx/store';
import {
   profileActions,
   selectedMyProfile,
   selectedProfileId,
   selectedSubscribersShortlist,
} from '../../data/store';

@Component({
   selector: 'app-profile-page',
   standalone: true,
   imports: [
      ProfileHeaderComponent,
      AsyncPipe,
      RouterLink,
      SvgComponent,
      ImgUrlPipe,
      PostFeedComponent,
      PostFeedComponent,
   ],
   templateUrl: './profile-page.component.html',
   styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
   activatedRoute = inject(ActivatedRoute);
   router = inject(Router);
   store = inject(Store);
   isMyPage = signal<boolean>(false);
   subscribers = this.store.selectSignal(selectedSubscribersShortlist);
   me = this.store.selectSignal(selectedMyProfile);

   profile$ = this.activatedRoute.params.pipe(
      switchMap(({ id }) => {
         if (id === 'me') {
            this.isMyPage.set(id === 'me' || id === this.me()?.id);
            this.store.dispatch(postActions.getMyPosts());
            return this.store.select(selectedMyProfile);
         } else {
            this.store.dispatch(profileActions.getAccountId({ id: id }));
            this.store.dispatch(postActions.getPosts({ userId: id }));
            return this.store.select(selectedProfileId);
         }
      })
   );

   async sendMessage(userId: number) {
      this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
   }


   ngOnInit() {
      this.store.dispatch(profileActions.getSubscribersShortlist({ amount: 5 }));
   }
}
