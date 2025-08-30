import { Post } from '@tt/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';

export interface PostState {
   posts: Post[];
}

export const initialState: PostState = {
   posts: [],
};

export const postFeature = createFeature({
   name: 'postFeature',
   reducer: createReducer(
      initialState,
      on(postActions.loadingPosts, (state, payload) => {
         return {
            ...state,
            posts: payload.posts,
         };
      })
   ),
});
