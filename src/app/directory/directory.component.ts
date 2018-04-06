import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  currentUser: any;

  constructor(authService: AuthService) {
    authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
  }

}
