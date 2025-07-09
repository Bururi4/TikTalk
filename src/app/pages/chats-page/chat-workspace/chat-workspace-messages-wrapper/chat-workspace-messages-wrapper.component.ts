import {
   AfterViewInit,
   Component,
   ElementRef,
   HostListener,
   inject,
   input,
   OnDestroy,
   OnInit,
   Renderer2
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {PostInputComponent} from "../../../profile-page/post-input/post-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {Chat, Message} from "../../../../data/interfaces/chats.interface";
import {debounceTime, firstValueFrom, fromEvent, Subject, takeUntil, timer} from "rxjs";
import {DateTime} from 'luxon';
import {KeyValuePipe} from '@angular/common';

@Component({
   selector: 'app-chat-workspace-messages-wrapper',
   standalone: true,
   imports: [
      ChatWorkspaceMessageComponent,
      PostInputComponent,
      KeyValuePipe
   ],
   templateUrl: './chat-workspace-messages-wrapper.component.html',
   styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
   chatsService = inject(ChatsService);
   chat = input.required<Chat>();
   messages = this.chatsService.activeChatMessages;
   hostElement = inject(ElementRef);
   r2 = inject(Renderer2);
   destroy$ = new Subject<void>();

   @HostListener('window:resize')
   onWindowResize() {
      this.resizeFeed();
   }

   constructor() {
      this.messageRequest();
   }

   ngOnInit() {
      this.messagesByDay();
   }

   ngAfterViewInit() {
      this.resizeFeed();

      fromEvent(window, 'resize')
         .pipe(debounceTime(500), takeUntil(this.destroy$))
         .subscribe(() => {
            this.resizeFeed();
         })

   }

   ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
   }

   private messageRequest() {
      timer(0, 3600000)
         .pipe(takeUntil(this.destroy$))
         .subscribe(async () => {
            await firstValueFrom(this.chatsService.getChatById(this.chat().id));
         })
   }

   async onSendMessage(messageText: string) {
      await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText));
      await firstValueFrom(this.chatsService.getChatById(this.chat().id));
   }


   resizeFeed() {
      const {top} = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top - 28;
      this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
   }

   messagesByDay() {
      const messagesStart = this.messages();
      const messagesResult: {[key: string]: Message[]} = {};

      const today = DateTime.now().startOf('day');
      const yesterday = today.minus({days: 1});

      messagesStart.forEach((message: Message) => {
         const messageDate = DateTime.fromISO(message.createdAt, {zone: 'utc'})
            .setZone(DateTime.local().zone)
            .startOf('day');

         let dateName: string;

         if (messageDate.equals(today)) {
            dateName = 'Сегодня';
         } else if (messageDate.equals(yesterday)) {
            dateName = 'Вчера';
         } else {
            dateName = messageDate.toFormat('dd.MM.yyyy');
         }

         if (!messagesResult[dateName]) {
            messagesResult[dateName] = [];
         }
         messagesResult[dateName].push(message);
      });

      return messagesResult;
   }
}
