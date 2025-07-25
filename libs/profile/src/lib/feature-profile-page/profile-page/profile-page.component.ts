import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { ChatsService, ProfileService } from '@tt/data-access';
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component';

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
   ],
   templateUrl: './profile-page.component.html',
   styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
   profileService = inject(ProfileService);
   activatedRoute = inject(ActivatedRoute);
   chatsService = inject(ChatsService);
   router = inject(Router);

   me$ = toObservable(this.profileService.me);
   subscribers$ = this.profileService.getSubscribersShortList(6);
   isMyPage = signal(false);

   profile$ = this.activatedRoute.params.pipe(
      switchMap(({ id }) => {
         this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
         if (id === 'me') return this.me$;

         return this.profileService.getAccount(id);
      })
   );

   async sendMessage(userId: number) {
      this.router.navigate(['/chats', 'new'], {queryParams: {userId}});
   }
}
