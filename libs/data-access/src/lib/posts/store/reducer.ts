import { createFeature, createReducer, on } from '@ngrx/store';
import { Post } from '../interfaces/post.interface';
import { postActions } from './actions';

export interface PostState {
   posts: Post[];
}

export const postsInitialState: PostState = {
   posts: [],
};

export const postFeature = createFeature({
   name: 'postFeature',
   reducer: createReducer(
      postsInitialState,
      on(postActions.loadingPosts, (state, payload) => {
         return {
            ...state,
            posts: payload.posts,
         };
      })
   ),
});
