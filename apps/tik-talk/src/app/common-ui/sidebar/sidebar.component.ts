import { Component, OnInit } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { SubCardComponent } from './sub-card/sub-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';

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

   constructor(private profileService: ProfileService) {}

   subscribers$ = this.profileService.getSubscribersShortList();
   me = this.profileService.me;

   ngOnInit() {
      firstValueFrom(this.profileService.getMe());
   }
}
