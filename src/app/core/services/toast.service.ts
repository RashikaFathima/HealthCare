import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3500, panelClass: ['toast-success'] });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 4500, panelClass: ['toast-error'] });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3000, panelClass: ['toast-info'] });
  }
}
