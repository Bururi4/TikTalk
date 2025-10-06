import { Component, HostBinding, input } from '@angular/core';
import { Message } from '@tt/data-access';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
   selector: 'app-chat-workspace-message',
   standalone: true,
   imports: [AvatarCircleComponent, DatePipe],
   templateUrl: './chat-workspace-message.component.html',
   styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
   message = input.required<Message>();

   @HostBinding('class')
   get isMine(): string {
      return this.message().isMine ? 'is-mine' : '';
   }
}
