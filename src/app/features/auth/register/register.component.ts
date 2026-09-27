import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { ROLE_HOME_ROUTE } from '../../../core/constants/roles.constant';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.scss'
})
export class RegisterComponent {
  loading = signal(false);
  errorMessage = signal('');

  form = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
      role: ['PATIENT', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const { fullName, email, phone, role, password } = this.form.getRawValue();
    this.authService
      .register({ fullName: fullName!, email: email!, password: password!, role: role as any, phone: phone ?? undefined })
      .subscribe({
        next: (session) => {
          this.loading.set(false);
          this.toast.success('Account created successfully!');
          this.router.navigateByUrl(ROLE_HOME_ROUTE[session.user.role]);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err?.message ?? 'Unable to register. Please try again.');
        }
      });
  }
}
