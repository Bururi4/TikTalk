import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
   CommentCreateDto,
   Post,
   PostComment,
   PostCreateDto,
} from '../interfaces/post.interface';
import { map, switchMap } from 'rxjs';
import { environment } from '@tt/common-ui';

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

   getPostsByUser(userId: number) {
      return this.http.get<Post[]>(`${environment.url}post/`, {
         params: { user_id: userId },
      });
   }

   fetchPosts() {
      return this.http.get<Post[]>(`${environment.url}post/`);
   }

   createComment(payload: CommentCreateDto) {
      return this.http
         .post<PostComment>(`${environment.url}comment/`, payload)
         .pipe(
            switchMap(() => {
               return this.fetchPosts();
            })
         );
   }

   getCommentByPostId(postId: number) {
      return this.http
         .get<Post>(`${environment.url}post/${postId}`)
         .pipe(map((res) => res.comments));
   }
}
