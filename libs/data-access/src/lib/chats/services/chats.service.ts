import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { ChatWsService } from '../interfaces/chats-ws-service.interface';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { selectedMyProfile } from '../../profile/store/selectors';
import { AuthService } from '../../auth/services/auth.service';
import { Profile } from '../../profile/interfaces/profile.interface';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isChatError, isNewMessage, isUnreadMessage } from '../interfaces/type-guard';

@Injectable({
   providedIn: 'root',
})
export class ChatsService {
   http = inject(HttpClient);
   #authService = inject(AuthService);
   store = inject(Store);
   me = this.store.selectSignal(selectedMyProfile);
   activeChatMessages = signal<Message[]>([]);
   chatsUrl = `${environment.url}chat/`;
   messageUrl = `${environment.url}message/`;
   wsAdapter: ChatWsService = new ChatWsRxjsService();
   unreadCount = signal<number>(0);
   unreadCountByUser = signal(new Map<number, number>());
   userProfile = signal<Profile | null>(null);

   connectWs() {
      return this.wsAdapter.connect({
         url: `${this.chatsUrl}ws`,
         token: this.#authService.accessToken ?? '',
         handleMessage: this.handleWsMessage,
      }) as Observable<ChatWsMessage>;
   }

   handleWsMessage = (message: ChatWsMessage) => {
      if (!('action' in message)) return;

      if (isUnreadMessage(message)) {
         this.unreadCount.set(message.data.count);
      }

      if (isChatError(message)) {
         this.#authService.refreshAuthToken();
         this.wsAdapter.disconnect();
         this.connectWs().subscribe();
      }

      if (isNewMessage(message)) {
         if (!(message.data.author === this.me()?.id)) {
            const userUnreadMessages = this.unreadCountByUser();
            const chatId = message.data.chat_id;

            if (!userUnreadMessages.has(chatId)) {
               userUnreadMessages.set(chatId, 1);
            } else {
               userUnreadMessages.set(
                  chatId,
                  userUnreadMessages.get(chatId)! + 1
               );
            }
            this.unreadCountByUser.set(userUnreadMessages);
         }

         this.activeChatMessages.set([
            ...this.activeChatMessages(),
            {
               id: message.data.id,
               userFromId: message.data.author,
               personalChatId: message.data.chat_id,
               text: message.data.message,
               createdAt: message.data.created_at,
               isRead: false,
               user:
                  message.data.author === this.me()?.id
                     ? this.me()
                     : this.userProfile(),
               isMine: message.data.author === this.me()?.id,
            },
         ]);
      }
   };

   deleteUnreadMessagesCount(chatId: number) {
      const unreadCount = this.unreadCountByUser();
      if (unreadCount.has(chatId)) {
         unreadCount.set(chatId, 0);
      }
      this.unreadCountByUser.set(unreadCount);
   }

   createChat(userId: number) {
      return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
   }

   getMyChats() {
      return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
   }

   getChatById(chatId: number) {
      return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
         map((chat) => {
            const patchMessages = chat.messages.map((message) => {
               return {
                  ...message,
                  user:
                     chat.userFirst.id === message.userFromId
                        ? chat.userFirst
                        : chat.userSecond,
                  isMine: message.userFromId === this.me()!.id,
               };
            });

            this.activeChatMessages.set(patchMessages);

            return {
               ...chat,
               companion:
                  chat.userFirst.id === this.me()!.id
                     ? chat.userSecond
                     : chat.userFirst,
               messages: patchMessages,
            };
         })
      );
   }
}
