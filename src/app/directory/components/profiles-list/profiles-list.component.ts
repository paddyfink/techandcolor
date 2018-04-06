import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '@app/interfaces/user';
import { AuthService } from '../../../auth';
import { get } from 'lodash';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss']
})
export class ProfileslistComponent implements OnInit {

  profiles$: Observable<User[]>;
  currentUser: User;

  constructor(private afs: AngularFirestore,
    private authService: AuthService) {

  }


  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;

      this.profiles$ = this.afs.collection<User>('users', ref => {
        const isAdmin = get(this.currentUser, 'roles.admin') || false;
        if (!isAdmin) {
          return ref.where('status', '==', 'approved');
        }
        return ref;
      }).snapshotChanges()
        .map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return <User>{
              id,
              ...data
            };
          });
        });

    });
  }

}
