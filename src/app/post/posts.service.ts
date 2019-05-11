import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/v1/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          description: post.description,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPost) => {
      this.posts = transformedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, title: string, description: string }>('http://localhost:3000/api/v1/posts/' + postId);
  }
  getPostUpdatedListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, description: string) {
    const post: Post = { id: null, title: title, description: description };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/v1/posts', post)
    .subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, description: string) {
    const post: Post = {id: id, title: title, description: description};
    this.http.put<{message: string}>('http://localhost:3000/api/v1/posts/' + id, post)
    .subscribe(response => {
      const updatePost = [...this.posts];
      const oldPostIndex = updatePost.findIndex(p => p.id === post.id);
      updatePost[oldPostIndex] = post;
      this.posts = updatePost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/v1/posts/' + postId)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postsUpdated.next([...this.posts]);

    });
  }
}
