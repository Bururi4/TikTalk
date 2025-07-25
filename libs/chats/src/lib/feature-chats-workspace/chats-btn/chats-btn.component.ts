import { Component, input } from '@angular/core';
import { LastMessageRes } from '@tt/data-access';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
   selector: 'button[chats]',
   standalone: true,
   imports: [AvatarCircleComponent, DatePipe],
   templateUrl: './chats-btn.component.html',
   styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
   chat = input<LastMessageRes>();
}
