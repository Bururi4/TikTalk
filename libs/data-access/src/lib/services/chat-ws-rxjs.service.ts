import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import {
   ChatConnectionWsParams,
   ChatWsService,
} from '../interfaces/chats-ws-service.interface';
import { finalize, Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { webSocket } from 'rxjs/webSocket';

export class ChatWsRxjsService implements ChatWsService {
   #socket: WebSocketSubject<ChatWsMessage> | null = null;
   #authService = inject(AuthService);

   connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
      if (!this.#socket) {
         this.#socket = webSocket({
            url: params.url,
            protocol: [params.token],
         });
      }

      return this.#socket.asObservable().pipe(
         tap((message) => params.handleMessage(message)),
         finalize(() => {
            this.#handleSocketClose(params);
         })
      );
   }

   disconnect(): void {
      this.#socket?.complete();
   }

   sendMessage(text: string, chatId: number){
      this.#socket?.next({
         status: 'success',
         text,
         chat_id: chatId,
      });
   }

   #handleSocketClose(params: ChatConnectionWsParams): void {
      this.#authService.refreshAuthToken();

      if (this.#authService.accessToken) {
         this.#socket?.complete();
         this.connect({
            url: params.url,
            token: this.#authService.accessToken,
            handleMessage: params.handleMessage,
         });
      }
   }
}
