import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    // Create reactive form in constructor
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.authService.navigateToDashboard();
      return;
    }

    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Getter for easy access to form controls
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate form
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Call auth service
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.toastService.success('Login successful');
        this.loading = false;
        // Navigate based on returnUrl or user role
        if (this.returnUrl && this.returnUrl !== '/') {
          this.router.navigate([this.returnUrl]);
        } else {
          this.authService.navigateToDashboard();
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
