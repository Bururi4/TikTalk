import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '@tt/data-access';
import { postActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class PostEffects {
   postService = inject(PostService);
   actions$ = inject(Actions);

   loadingPosts = createEffect(() => {
      return this.actions$.pipe(
         ofType(postActions.fetchPosts),
         switchMap(() => {
            return this.postService.fetchPosts()
               .pipe(
                  map((posts) => postActions.loadingPosts({ posts: posts }))
               );
         })
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

   // getPosts = createEffect(() => {
   //    return this.actions$.pipe(
   //       ofType(postActions.getPosts),
   //       switchMap(({ userId }) => {
   //          return this.postService.getPostsByUser(userId);
   //       }),
   //       map((posts) => postActions.loadingPosts({ posts: posts }))
   //    );
   // });
   //
   // getMyPosts = createEffect(() => {
   //    return this.actions$.pipe(
   //       ofType(postActions.getMyPosts),
   //       switchMap(() => {
   //          return this.postService.fetchPosts();
   //       }),
   //       map((posts) => postActions.loadingPosts({ posts: posts }))
   //    );
   // });
}
