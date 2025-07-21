import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
   CommentCreateDto,
   Post,
   PostCreateDto,
   PostComment,
} from '../interfaces/post.interface';
import { map, switchMap, tap } from 'rxjs';
import { environment } from '../../../../../../apps/tik-talk/src/app/common-ui/environments/environment';

@Injectable({
   providedIn: 'root',
})
export class PostService {
   posts = signal<Post[]>([]);

   constructor(private http: HttpClient) {}

   createPost(payload: PostCreateDto) {
      return this.http.post<Post>(`${environment.url}post/`, payload).pipe(
         switchMap(() => {
            return this.fetchPosts();
         })
      );
   }

   fetchPosts() {
      return this.http
         .get<Post[]>(`${environment.url}post/`)
         .pipe(tap((res) => this.posts.set(res)));
   }

   createComment(payload: CommentCreateDto) {
      return this.http.post<PostComment>(`${environment.url}comment/`, payload);
   }

   getCommentByPostId(postId: number) {
      return this.http
         .get<Post>(`${environment.url}post/${postId}`)
         .pipe(map((res) => res.comments));
   }
}
