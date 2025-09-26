import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
   CommentCreateDto,
   Post,
   PostCreateDto,
} from '../interfaces/post.interface';
import { Comment } from '@angular/compiler';
import { switchMap } from 'rxjs';
import { environment } from '@tt/common-ui';

@Injectable({
   providedIn: 'root',
})
export class PostService {
   posts = signal<Post[]>([]);

   constructor(private http: HttpClient) {}

   createPost(post: PostCreateDto) {
      return this.http.post<Post>(`${environment.url}post/`, post).pipe(
         switchMap(() => {
            return this.fetchPost();
         })
      );
   }

   fetchPost() {
      return this.http.get<Post[]>(`${environment.url}post/`);
   }

   getPostsByUserId(userId: number) {
      return this.http.get<Post[]>(`${environment.url}post/`, {
         params: { user_id: userId },
      });
   }

   createComment(comment: CommentCreateDto) {
      return this.http
         .post<Comment>(`${environment.url}comment/`, comment)
         .pipe(
            switchMap(() => {
               return this.fetchPost();
            })
         );
   }
}
