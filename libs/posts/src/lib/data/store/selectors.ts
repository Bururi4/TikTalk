import { createSelector } from '@ngrx/store';
import { postFeature } from './reducer';
import { Post } from '@tt/data-access';

export const selectPosts = createSelector(
   postFeature.selectPosts,
   (posts: Post[]) => posts
);
