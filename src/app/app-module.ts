import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { authInterceptor } from './core/interceptors/auth.interceptor.fn';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth.service';
import { Home } from './features/home/home';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized';
import { SharedModule } from './shared/shared.module';

// Initialize AuthService before app starts
export function initializeApp(authService: AuthService) {
  return () => {
    // This forces AuthService to be constructed before guards run
    return Promise.resolve();
  };
}

@NgModule({
  declarations: [
    App,
    Home,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
