import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private store: Store
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    // Get return URL
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Check if already logged in - using Store
    this.store.select(selectIsAuthenticated).subscribe(isAuth => {
        if (isAuth) {
             if (this.returnUrl && this.returnUrl !== '/') {
                this.router.navigate([this.returnUrl], { replaceUrl: true });
              } else {
                this.authService.navigateToDashboard();
              }
        }
    });

    // Error handling UI
    this.error$.subscribe(err => {
        this.errorMessage = err || '';
        if (err) {
            this.toastService.error(err);
        }
    });
    
    // Sync loading state for template
    this.loading$.subscribe(l => this.loading = l);
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(AuthActions.login({
        request: this.loginForm.value,
        returnUrl: this.returnUrl
    }));
  }
  
  // Getter for template compatibility if not using async pipe, 
  // but better to use async pipe in template or subscribe.
  // Template uses 'loading' boolean.
  // I will add a subscription to update a local property for compatibility 
  // without changing HTML significantly, although HTML changes are safer.
  // Actually, I can just leave 'loading' property and update it.
  loading = false;
  errorMessage = '';

  // Use subscribe in constructor/init to sync local state
  // This is temporary until template refactor.
}
