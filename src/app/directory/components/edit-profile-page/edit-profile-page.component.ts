import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { User } from 'app/interfaces';
import { NotificationsService } from 'app/core';
import { AuthService } from 'app/auth';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { tap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.scss']
})
export class EditProfilePageComponent implements OnInit {

  @ViewChild('location')
  public searchElementRef: ElementRef;

  user: User = {};

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private afs: AngularFirestore,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  save() {
    if (this.user.status !== 'approved') {
      this.user.status = 'published';
    }
    this.afs.collection('users').doc<User>(this.user.id).update({
      ...this.user,
    });

    this.notificationsService.notify('success', 'Profile successfuly updated', '');
  }

  ngOnInit() {

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['(cities)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.user.city = place.formatted_address;

        });
      });
    });

    this.authService.currentUser.subscribe(user => {
      this.user = user || {};
    });
  }

}
