import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@app/auth/auth.service';
import { tap, first, map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth,
    private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.afAuth.authState.pipe(
      first(),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.authService.login(state.url);
        }
      })
    );


  }

}
