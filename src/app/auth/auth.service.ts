import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import Auth0Lock from 'auth0-lock';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import { mergeMap, first, switchMap, tap, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class AuthService {
  private auth0Options = {
    theme: {
      logo: '/assets/images/logo/logo_notagline_color_small.png',
      primaryColor: '#4FB3DC'
    },
    auth: {
      redirectUrl: environment.auth0.callbackURL,
      responseType: 'token id_token',
      audience: `https://techandcolor/api`,
      params: {
        scope: 'openid profile email',
      }
    },
    oidcConformant: true,
  };

  private lock = new Auth0Lock(
    environment.auth0.clientId,
    environment.auth0.domain,
    this.auth0Options
  );

  private accessToken: string;
  private currentUserId: string;
  private profile: any;
  // Track authentication status
  loggedIn: boolean;
  // Track Firebase authentication status
  loggedInFirebase: boolean;
  // Subscribe to the Firebase token stream
  firebaseSub: Subscription;
  // Subscribe to Firebase renewal timer stream
  refreshFirebaseSub: Subscription;


  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private afs: AngularFirestore, ) {

    this.lock.on('authenticated', (authResult) => {
      this.accessToken = authResult.accessToken;
      this.lock.getUserInfo(authResult.accessToken, (err, profile) => {
        if (profile) {
          this.profile = profile;
          this._setSession(authResult);
        } else if (err) {
          console.warn(`Error retrieving profile: ${err.error}`);
        }
      });
    });

    this.lock.on('authorization_error', error => {
      console.log('something went wrong', error);
    });

  }

  private _setSession(authResult) {
    // Set tokens and expiration in localStorage
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

    localStorage.setItem('expires_at', expiresAt);

    // Session set; set loggedIn
    this.loggedIn = true;
    // Get Firebase token
    this._getFirebaseToken();

  }

  get currentUser(): Observable<User> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`)
            // .valueChanges();
            .snapshotChanges()
            .map(doc => {
              const data = doc.payload.data();
              const id = doc.payload.id;
              return <User>{
                id,
                ...data
              };
            });
        } else {
          return Observable.of(null);
        }
      })
    );
  }


  get isAuthenticated(): boolean {
    return this.loggedInFirebase;
  }

  login(redirect?: string) {
    const _redirect = redirect ? redirect : this.router.url;
    localStorage.setItem('auth_redirect', _redirect);
    this.lock.show();
  }


  private _getFirebaseToken() {
    // Prompt for login if no access token
    if (!this.accessToken) {
      this.login();
    }
    const projectId = environment.firebase.authDomain.split('.')[0];
    const tokenFunctionURL = 'https://us-central1-' + projectId +
      '.cloudfunctions.net/createCustomToken/';

    const getToken$ = () => {
      return this.http
        .get(tokenFunctionURL, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`)
        }
        );
    };

    this.firebaseSub = getToken$().subscribe(
      res => this._firebaseAuth(res),
      err => console.error(`An error occurred fetching Firebase token: ${err.message}`)
    );
  }

  private _firebaseAuth(tokenObj) {
    this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
      .then(res => {
        this.loggedInFirebase = true;

        // Create the user if doesn't exists
        if (this.profile) {
          this.afs.doc<User>(`users/${this.profile.sub}`).valueChanges().pipe(
            first(),
          )
            .subscribe(doc => {
              if (!doc) {
                this.afs.collection('users').doc<User>(this.profile.sub).set({
                  firstname: this.profile.given_name || '',
                  lastname: this.profile.family_name || '',
                  fullname: this.profile.name || '',
                  email: this.profile.email || '',
                  pictureThumbnail: this.profile.picture || '',
                  picture: this.profile['https://www.linkedin.com/picture'] || '',
                  linkedin: this.profile['https://www.linkedin.com/publicProfileUrl'] || '',
                  bio: this.profile['https://www.linkedin.com/summary'] || '',
                  headline: this.profile['https://www.linkedin.com/headline'] || '',
                  roles: {
                    admin: false,
                    user: true
                  },
                  createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
              } else {
                // update linked basic information
                this.afs.collection('users').doc<User>(this.profile.sub).update({
                  firstname: this.profile.given_name,
                  lastname: this.profile.family_name,
                  fullname: this.profile.name,
                  email: this.profile.email,
                  pictureThumbnail: this.profile.picture || '',
                  picture: this.profile['https://www.linkedin.com/picture'] || '',
                  linkedin: this.profile['https://www.linkedin.com/publicProfileUrl'] || '',
                });
              }
            });
        }

        // Schedule token renewal
        this.scheduleFirebaseRenewal();
        // Redirect to desired route
        this.router.navigateByUrl(localStorage.getItem('auth_redirect'));
        // close the lock
        this.lock.hide();
        console.log('Successfully authenticated with Firebase!');
      })
      .catch(err => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error(`${errorCode} Could not log into Firebase: ${errorMessage}`);
        this.loggedInFirebase = false;
      });
  }

  scheduleFirebaseRenewal() {
    // If user isn't authenticated, check for Firebase subscription
    // and unsubscribe, then return (don't schedule renewal)
    if (!this.loggedInFirebase) {
      if (this.firebaseSub) {
        this.firebaseSub.unsubscribe();
      }
      return;
    }
    // Unsubscribe from previous expiration observable
    this.unscheduleFirebaseRenewal();
    // Create and subscribe to expiration observable
    // Custom Firebase tokens minted by Firebase
    // expire after 3600 seconds (1 hour)
    const expiresAt = new Date().getTime() + (3600 * 1000);
    const expiresIn$ = Observable.of(expiresAt)
      .pipe(
        mergeMap(
          expires => {
            const now = Date.now();
            // Use timer to track delay until expiration
            // to run the refresh at the proper time
            return Observable.timer(Math.max(1, expires - now));
          }
        )
      );

    this.refreshFirebaseSub = expiresIn$
      .subscribe(
        () => {
          console.log('Firebase token expired; fetching a new one');
          this._getFirebaseToken();
        }
      );
  }

  unscheduleFirebaseRenewal() {
    if (this.refreshFirebaseSub) {
      this.refreshFirebaseSub.unsubscribe();
    }
  }

  logout() {
    // Ensure all auth items removed
    localStorage.removeItem('expires_at');
    localStorage.removeItem('auth_redirect');
    localStorage.removeItem('user');
    this.accessToken = undefined;
    this.loggedIn = false;
    // Sign out of Firebase
    this.loggedInFirebase = false;
    this.afAuth.auth.signOut();
    // Return to homepage
    // this.router.navigate(['/']);
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }
}
