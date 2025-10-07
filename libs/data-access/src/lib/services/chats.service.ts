import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { map, Observable } from 'rxjs';
import { environment } from '@tt/common-ui';
import { GlobalStoreService } from './global-store.service';
import { ChatWsService } from '../interfaces/chats-ws-service.interface';
import { ChatsWsNativeService } from './chats-ws-native.service';
import { AuthService } from './auth.service';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../guards/type-guard';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';

@Injectable({
   providedIn: 'root',
})
export class ChatsService {
   http = inject(HttpClient);
   #authService = inject(AuthService);
   me = inject(GlobalStoreService).me;
   activeChatMessages = signal<Message[]>([]);
   chatsUrl = `${environment.url}chat/`;
   messageUrl = `${environment.url}message/`;

   wsAdapter: ChatWsService = new ChatWsRxjsService();

   connectWs() {
      return this.wsAdapter.connect({
         url: `${this.chatsUrl}ws`,
         token: this.#authService.accessToken ?? '',
         handleMessage: this.handleWsMessage,
      }) as Observable<ChatWsMessage>;
   }

   handleWsMessage = (message: ChatWsMessage)=> {
      if (!('action' in message)) return;

      if (isUnreadMessage(message)) {
         //TODO
      }

      if (isNewMessage(message)) {
         this.activeChatMessages.set([
            ...this.activeChatMessages(),
            {
               id: message.data.id,
               userFromId: message.data.author,
               personalChatId: message.data.chat_id,
               text: message.data.message,
               createdAt: message.data.created_at,
               isRead: false,
               isMine: false,
            }
         ])
      }
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

   sendMessage(chatId: number, message: string) {
      return this.http.post<Message>(
         `${this.messageUrl}send/${chatId}`,
         {},
         {
            params: {
               message,
            },
         }
      );
   }
}
