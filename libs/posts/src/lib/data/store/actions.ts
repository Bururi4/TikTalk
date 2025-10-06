import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CommentCreateDto, Post, PostCreateDto } from '@tt/data-access';

export const postActions = createActionGroup({
   source: 'post',
   events: {
      'get posts': props<{ userId: number }>(),
      'get my posts': emptyProps(),
      'loading posts': props<{ posts: Post[] }>(),
      'create post': props<{ post: PostCreateDto }>(),
      'create comment': props<{ comment: CommentCreateDto }>(),
   },
});
