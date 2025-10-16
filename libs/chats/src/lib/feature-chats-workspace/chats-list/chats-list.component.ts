import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ChatsService } from '@tt/data-access';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
   selector: 'app-chats-list',
   standalone: true,
   imports: [
      RouterLink,
      RouterLinkActive,
      ChatsBtnComponent,
      ReactiveFormsModule,
      AsyncPipe
   ],
   templateUrl: './chats-list.component.html',
   styleUrl: './chats-list.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
   private chatsService = inject(ChatsService);
   userUnreadMessages = this.chatsService.unreadCountByUser;
   filterChatsControl = new FormControl('');

   chats$ = combineLatest([
      this.chatsService.getMyChats(),
      this.filterChatsControl.valueChanges.pipe(startWith('')),
      toObservable(this.userUnreadMessages),
   ]).pipe(
      map(([chats, filter, count]) => {
         const filteredMessages = chats.filter((chat) =>
            `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
               .toLowerCase()
               .includes(filter?.toLowerCase() ?? '')
         );

         const result = filteredMessages.map((chat) => ({
            ...chat,
            unreadMessages: count.get(chat.id) ?? 0,
         }));

         return result;
      })
   );
}
