import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { SubCardComponent } from './sub-card/sub-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe, SvgComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

@Component({
   selector: 'app-sidebar',
   standalone: true,
   imports: [
      SvgComponent,
      NgForOf,
      SubCardComponent,
      RouterLink,
      AsyncPipe,
      ImgUrlPipe,
      RouterLinkActive,
   ],
   templateUrl: './sidebar.component.html',
   styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
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

   constructor(private profileService: ProfileService) {

   }

   subscribers$ = this.profileService.getSubscribersShortList();
   me = this.profileService.me;

   ngOnInit() {
      firstValueFrom(this.profileService.getMe());
   }
}
