import { createSelector } from '@ngrx/store';
import { postFeature } from './reducer';
import { Post } from '../interfaces/post.interface';

export const selectPosts = createSelector(
   postFeature.selectPosts,
   (posts: Post[]) => posts
);
