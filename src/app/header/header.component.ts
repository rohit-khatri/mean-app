import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;
  private authListnerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authListnerSubs = this.authService
    .getAuthStatusListner()
    .subscribe(isAuthenticate => {
      this.isUserAuthenticated = isAuthenticate;
    })
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

}
