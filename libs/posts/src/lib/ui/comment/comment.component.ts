import { Component, input } from '@angular/core';
import { PostComment } from '@tt/data-access';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent, CustomDatePipe } from '@tt/common-ui';

@Component({
   selector: 'app-comment',
   standalone: true,
   imports: [AvatarCircleComponent, DatePipe, CustomDatePipe],
   templateUrl: './comment.component.html',
   styleUrl: './comment.component.scss',
})
export class CommentComponent {
   comment = input<PostComment>();
}
