import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions';
import { map, switchMap } from 'rxjs';
import { PostService } from '../services/post.service';

@Injectable({
   providedIn: 'root',
})
export class PostEffects {
   postService = inject(PostService);
   actions$ = inject(Actions);

   fetchPost = createEffect(() => {
      return this.actions$.pipe(
         ofType(postActions.getPosts),
         switchMap(({ userId }) => {
            return this.postService.getPostsByUserId(userId);
         }),
         map((posts) => postActions.loadingPosts({ posts: posts }))
      );
   });

   fetchMyPost = createEffect(() => {
      return this.actions$.pipe(
         ofType(postActions.getMyPosts),
         switchMap(() => {
            return this.postService.fetchPost();
         }),
         map((posts) => postActions.loadingPosts({ posts: posts }))
      );
   });

   createPost = createEffect(() => {
      return this.actions$.pipe(
         ofType(postActions.createPost),
         switchMap(({ post }) => {
            return this.postService.createPost(post);
         }),
         map((posts) => postActions.loadingPosts({ posts: posts }))
      );
   });

   createComment = createEffect(() => {
      return this.actions$.pipe(
         ofType(postActions.createComment),
         switchMap(({ comment }) => {
            return this.postService.createComment(comment);
         }),
         map((posts) => postActions.loadingPosts({ posts: posts }))
      );
   });
}
