import { Component, OnInit, Input } from '@angular/core';
import { TruncatePipe } from 'angular-pipes/src/string/truncate.pipe';
import { AuthService } from '../../../auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { User } from '@app/interfaces/user';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

  @Input() profile: User;

  constructor(
    private afs: AngularFirestore
  ) { }

  approve(id: string) {
    this.afs.collection('users').doc<User>(id).update({
      status: 'approved',
    });
  }

  ngOnInit() {
  }

}
