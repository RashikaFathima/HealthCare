import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ROLE_HOME_ROUTE } from '../../../core/constants/roles.constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  demoAccounts = [
    { role: 'Patient', email: 'patient@health.com' },
    { role: 'Doctor', email: 'doctor@health.com' },
    { role: 'Receptionist', email: 'reception@health.com' },
    { role: 'Admin', email: 'admin@health.com' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  fillDemo(email: string): void {
    this.form.patchValue({ email, password: 'password' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.toast.success(`Welcome back, ${session.user.fullName.split(' ')[0]}!`);
        this.router.navigateByUrl(ROLE_HOME_ROUTE[session.user.role]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message ?? 'Unable to log in. Please try again.');
      }
    });
  }
}
