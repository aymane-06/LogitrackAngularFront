import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.authService.navigateToDashboard();
      return;
    }

    // Create reactive form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

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
