import { createAction, props } from '@ngrx/store';
import { LoginRequest, User } from '../../shared/models/user.model';

export const login = createAction(
  '[Auth] Login',
  props<{ request: LoginRequest; returnUrl?: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string; returnUrl?: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const browserReload = createAction('[Auth] Browser Reload');
