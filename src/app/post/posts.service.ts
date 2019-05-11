import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPost() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/v1/posts')
    .subscribe((postData) => {
      this.posts = postData.posts;
      this.postsUpdated.next([...this.posts]);
    });

  }

  getPostUpdatedListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, description: string) {
    const post: Post = { id: null, title: title, description: description };
    this.http.post<{message: string}>('http://localhost:3000/api/v1/posts', post)
    .subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
