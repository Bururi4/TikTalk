import {
   AfterViewInit, ChangeDetectionStrategy,
   Component,
   ElementRef,
   EventEmitter,
   HostListener,
   inject,
   Input,
   input,
   OnChanges,
   Output,
   Renderer2,
   signal,
   SimpleChanges,
   ViewChild
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { ChatsService } from '@tt/data-access';
import { Chat, Message } from '@tt/data-access';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
import { MessageInputComponent } from '../../../ui/message-input/message-input.component';
import { GroupByDateComponent } from '../../group-by-date/group-by-date';

@Component({
   selector: 'app-chat-workspace-messages-wrapper',
   standalone: true,
   imports: [
      ChatWorkspaceMessageComponent,
      MessageInputComponent,
      GroupByDateComponent,
   ],
   templateUrl: './chat-workspace-messages-wrapper.component.html',
   styleUrl: './chat-workspace-messages-wrapper.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent
   implements OnChanges, AfterViewInit
{
   chatsService = inject(ChatsService);
   chat = input.required<Chat>();
   messagesByDay = signal<{ date: string; messages: Message[] }[]>([]);
   hostElement = inject(ElementRef);
   r2 = inject(Renderer2);
   destroy$ = new Subject<void>();

   @Input() messages: Message[] = [];
   @Output() sendMessage = new EventEmitter();
   @ViewChild('scrollToBottom') scrollToBottom!: ElementRef;

   @HostListener('window:resize')
   onWindowResize() {
      this.resizeFeed();
   }

   ngOnChanges(changes: SimpleChanges) {
      if (changes['messages']) {
         this.messagesByDay.set(this.groupedMessages(this.messages));
      }

      Promise.resolve().then(() => this.scrollBottom());
   }

   ngAfterViewInit() {
      this.scrollBottom();
      this.resizeFeed();

      fromEvent(window, 'resize')
         .pipe(debounceTime(500), takeUntil(this.destroy$))
         .subscribe(() => {
            this.resizeFeed();
         });

      this.chatsService.deleteUnreadMessagesCount(this.chat().id);
   }

   // private messageRequest() {
   //    timer(0, 600000)
   //       .pipe(takeUntil(this.destroy$))
   //       .subscribe(async () => {
   //          await firstValueFrom(this.chatsService.getChatById(this.chat().id));
   //       });
   // }

   async onSendMessage(messageText: string) {
      this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);
      this.scrollBottom();
   }

   private scrollBottom() {
      if (this.scrollToBottom) {
         this.scrollToBottom.nativeElement.scrollTop =
            this.scrollToBottom.nativeElement.scrollHeight;
      }
   }

   resizeFeed() {
      const { top } = this.hostElement.nativeElement.getBoundingClientRect();
      const height = window.innerHeight - top - 28;
      this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
   }

   groupedMessages(
      messages: Message[]
   ): { date: string; messages: Message[] }[] {
      const result: { date: string; messages: Message[] }[] = [];

      for (const message of messages) {
         const date = message.createdAt.slice(0, 10);
         const groupExist = result.find((group) => group.date === date);

         if (groupExist) {
            groupExist.messages.push(message);
         } else {
            result.push({
               date,
               messages: [message],
            });
         }
      }
      return result;
   }
}
