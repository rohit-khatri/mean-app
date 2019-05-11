import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoding = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isLoding  = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdatedListner()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoding  = false;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
