import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/interfaces/User';
import { switchMap, filter } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isNavbarCollapsed = true;
  user: User;

  constructor(
    public authService: AuthService,
    private afs: AngularFirestore,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
  login() {
    this.authService.login();
  }
  ngOnInit() {
  }

}
