import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../common-ui/environments/environment";
import {Chat, LastMessageRes, Message} from "../interfaces/chats.interface";
import {ProfileService} from "./profile.service";
import {map} from "rxjs";

@Injectable({
   providedIn: 'root'
})
export class ChatsService {
   http = inject(HttpClient);
   me = inject(ProfileService).me;
   activeChatMessages = signal<Message[]>([]);

   chatsUrl = `${environment.url}chat/`;
   messageUrl = `${environment.url}message/`;

   createChat(userId: number) {
      return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
   }

   getMyChats() {
      return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
   }

   getChatById(chatId: number) {
      return this.http.get<Chat>(`${this.chatsUrl}${chatId}`)
         .pipe(
            map(chat => {
               const patchMessages = chat.messages.map(message => {
                  return {
                     ...message,
                     user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                     isMine: message.userFromId === this.me()!.id,
                  }
               })

               this.activeChatMessages.set(patchMessages);

               return {
                  ...chat,
                  companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
                  messages: patchMessages
               }
            })
         )
   }

   sendMessage(chatId: number, message: string) {
      return this.http.post<Message>(`${this.messageUrl}send/${chatId}`, {}, {
         params: {
            message
         }
      });
   }
}
