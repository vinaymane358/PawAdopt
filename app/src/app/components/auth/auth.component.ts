import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loading = false;
  alertMessage = '';
  alertType = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      role: ['', [Validators.required]],
      firstName: [''],
      lastName: [''],
      shelterName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Add conditional validation based on role
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFormValidation(role);
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.alertMessage = '';
    this.loading = false;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.alertMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.showAlert('Login successful! Welcome back!', 'success');
          setTimeout(() => {
            // Navigate based on user role
            if (response.user.role === 'Admin') {
              this.router.navigate(['/admin']);
            } else if (response.user.role === 'Shelter') {
              this.router.navigate(['/shelter']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.showAlert('Invalid credentials or role mismatch. Please try again.', 'error');
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.alertMessage = '';

      const formValue = this.registerForm.value;
      delete formValue.confirmPassword; // Remove confirmPassword before sending

      this.authService.register(formValue).subscribe({
        next: (response) => {
          this.loading = false;
          this.showAlert('Account created successfully! Welcome to PawAdopt!', 'success');
          setTimeout(() => {
            // Navigate based on user role
            if (response.user.role === 'Shelter') {
              this.router.navigate(['/shelter']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1000);
        },
        error: (error) => {
          this.loading = false;
          this.showAlert('Registration failed. Please try again.', 'error');
        }
      });
    }
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
  }

  updateFormValidation(role: string) {
    const firstNameControl = this.registerForm.get('firstName');
    const lastNameControl = this.registerForm.get('lastName');
    const shelterNameControl = this.registerForm.get('shelterName');

    if (role === 'Shelter') {
      // For shelter, require shelter name and clear first/last name
      firstNameControl?.clearValidators();
      lastNameControl?.clearValidators();
      shelterNameControl?.setValidators([Validators.required]);
      firstNameControl?.setValue('');
      lastNameControl?.setValue('');
    } else {
      // For regular users, require first/last name and clear shelter name
      firstNameControl?.setValidators([Validators.required]);
      lastNameControl?.setValidators([Validators.required]);
      shelterNameControl?.clearValidators();
      shelterNameControl?.setValue('');
    }

    firstNameControl?.updateValueAndValidity();
    lastNameControl?.updateValueAndValidity();
    shelterNameControl?.updateValueAndValidity();
  }

  get isShelterRole(): boolean {
    return this.registerForm.get('role')?.value === 'Shelter';
  }
}
