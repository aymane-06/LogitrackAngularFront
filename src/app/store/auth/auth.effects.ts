import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$;
  loginSuccess$;
  browserReload$;
  logout$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ request, returnUrl }) =>
          this.authService.login(request).pipe(
            map((response) =>
              AuthActions.loginSuccess({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                returnUrl
              })
            ),
            catchError((error) => {
               const errorMessage = error.error?.message || error.message || 'Login failed';
               return of(AuthActions.loginFailure({ error: errorMessage }));
            })
          )
        )
      )
    );

    this.loginSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap(({ returnUrl }) => {
            if (returnUrl && returnUrl !== '/') {
                this.router.navigate([returnUrl]);
            } else {
                this.authService.navigateToDashboard();
            }
          })
        ),
      { dispatch: false }
    );

    this.browserReload$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.browserReload),
        map(() => {
          const user = this.authService.getCurrentUser();
          if (user) {
            return AuthActions.loginSuccess({
                user: user, 
                accessToken: '', 
                refreshToken: ''
            });
          }
          return { type: '[Auth] No Session Restored' };
        })
      )
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            this.authService.logout();
          })
        ),
      { dispatch: false }
    );
  }
}
