import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { SubCardComponent } from './sub-card/sub-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import {
   AuthService,
   ChatsService,
   isChatError,
   profileActions,
   ProfileService,
   selectedMyProfile,
   selectedSubscribersShortlist,
} from '@tt/data-access';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-sidebar',
   standalone: true,
   imports: [
      RouterLink,
      RouterLinkActive,
      SvgComponent,
      NgForOf,
      SubCardComponent,
      ImgUrlPipe,
   ],
   templateUrl: './sidebar.component.html',
   styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
   store = inject(Store);
   subscribers = this.store.selectSignal(selectedSubscribersShortlist);
   me = this.store.selectSignal(selectedMyProfile);
   chatService = inject(ChatsService);
   destroyRef = inject(DestroyRef);
   authService = inject(AuthService);
   profileService = inject(ProfileService);
   countUnread = this.chatService.unreadCount;
   wsSubscribe!: Subscription;

   menuItems = [
      {
         label: 'Моя страница',
         icon: 'home',
         link: 'profile/me',
      },
      {
         label: 'Чаты',
         icon: 'chat',
         link: 'chats',
      },
      {
         label: 'Поиск',
         icon: 'search',
         link: 'search',
      },
   ];

   ngOnInit() {
      this.store.dispatch(profileActions.getMyProfile());
      this.store.dispatch(
         profileActions.getSubscribersShortlist({ amount: 5 })
      );

      this.wsSubscribe = this.chatService
         .connectWs()
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe({
            next: (message) => {
               if (isChatError(message)) {
                  this.reconnect();
               }
            },
            error: (err) => {
               console.error('Ошибка WebSocket:', err);
               this.reconnect();
            },
            complete: () => {
               console.log('WebSocket соединение закрыто');
               this.reconnect();
            },
         });
   }

   async reconnect() {
      // await firstValueFrom(this.authService.refreshAuthToken());
      await firstValueFrom(this.profileService.getMe());
      await firstValueFrom(timer(2000));
      this.connectWs();
   }

   connectWs() {
      this.wsSubscribe?.unsubscribe();
      this.wsSubscribe = this.chatService
         .connectWs()
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe((message) => {
            if (isChatError(message)) {
               console.log('Неправильный токен');
               this.reconnect();
            }
         });
   }
}
