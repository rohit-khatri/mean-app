import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pageSize: number, currentPage: number) {
    const queryParam  = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http.get
      <{message: string, posts: any, maxPosts: number}>
      ('http://localhost:3000/api/v1/posts' + queryParam)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            description: post.description,
            id: post._id,
            imagePath: post.imagePath,
            createdBy: post.createdBy
          };
        }),
        maxPosts: postData.maxPosts
      };
    })
  )
  .subscribe(transformedPost => {
      this.posts = transformedPost.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPost.maxPosts
      });
    });
  }

  getPost(postId: string) {
    return this.http.get<{
      id: string,
      title: string,
      description: string,
      imagePath: string,
      createdBy: string }>('http://localhost:3000/api/v1/posts/' + postId);
  }
  getPostUpdatedListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, description: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('image', image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/v1/posts', postData)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, description: string, image: File | string) {
    let postData: Post | FormData;
    if ('object' === typeof(image)) {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('description', description);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        description,
        imagePath: image,
        createdBy: null
      };
    }
    this.http.put<{message: string, imagePath: string}>('http://localhost:3000/api/v1/posts/' + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/v1/posts/' + postId);  }
}
