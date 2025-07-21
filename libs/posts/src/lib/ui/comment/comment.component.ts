import { Component, input } from '@angular/core';
import { PostComment } from '../../data';
import { DatePipe } from '@angular/common';
import {
   AvatarCircleComponent
} from "../../../../../../apps/tik-talk/src/app/common-ui/avatar-circle/avatar-circle.component";

@Component({
   selector: 'app-comment',
   standalone: true,
   imports: [AvatarCircleComponent, DatePipe],
   templateUrl: './comment.component.html',
   styleUrl: './comment.component.scss',
})
export class CommentComponent {
   comment = input<PostComment>();
}
