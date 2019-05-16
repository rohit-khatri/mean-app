import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscriber, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoding = false;
  totalPost = 0;
  postPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoding  = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdatedListner()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.posts = postData.posts;
      this.totalPost = postData.postCount;
      this.isLoding  = false;
      this.userId = this.authService.getUseId();
    });

    this.isUserAuthenticated  = this.authService.getIsAuthenticated();

    this.authStatusSub = this.authService.getAuthStatusListner()
    .subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  onDelete(postId: string) {
    this.isLoding  = true;
    this.postsService.deletePost(postId)
    .subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoding  = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
