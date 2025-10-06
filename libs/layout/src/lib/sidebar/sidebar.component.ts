import { Component, inject, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { SubCardComponent } from './sub-card/sub-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import {
   profileActions,
   selectedMyProfile,
   selectedSubscribersShortlist,
} from '@tt/profile';

@Component({
   selector: 'app-sidebar',
   standalone: true,
   imports: [
      SvgComponent,
      NgForOf,
      SubCardComponent,
      RouterLink,
      ImgUrlPipe,
      RouterLinkActive,
   ],
   templateUrl: './sidebar.component.html',
   styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
   store = inject(Store);
   subscribers = this.store.selectSignal(selectedSubscribersShortlist);
   me = this.store.selectSignal(selectedMyProfile);

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
   }
}
