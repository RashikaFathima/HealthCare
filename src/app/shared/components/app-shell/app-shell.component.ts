import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AppNotification } from '../../../core/models';
import { ROLE_LABELS } from '../../../core/constants/roles.constant';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatMenuModule, UserAvatarComponent, NotificationPanelComponent],
  template: `
    <div class="shell" [class.sidebar-collapsed]="collapsed()">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon"><i class="fa-solid fa-heart-pulse"></i></div>
          @if (!collapsed()) { <span class="brand-name">MediCare<span>+</span></span> }
        </div>

        <nav class="nav-list">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" class="nav-item" [title]="item.label">
              <i class="fa-solid" [class]="item.icon"></i>
              @if (!collapsed()) { <span>{{ item.label }}</span> }
            </a>
          }
        </nav>

        <button type="button" class="collapse-btn" (click)="collapsed.set(!collapsed())">
          <i class="fa-solid" [class]="collapsed() ? 'fa-angles-right' : 'fa-angles-left'"></i>
        </button>
      </aside>

      <div class="main-col">
        <header class="topbar">
          <button class="mobile-toggle d-lg-none" (click)="mobileOpen.set(!mobileOpen())">
            <i class="fa-solid fa-bars"></i>
          </button>

          <div class="role-tag">{{ roleLabel }}</div>

          <div class="topbar-actions">
            <button type="button" class="icon-btn" (click)="themeService.toggle()" title="Toggle theme">
              <i class="fa-solid" [class]="themeService.theme() === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
            </button>

            <button type="button" class="icon-btn" [matMenuTriggerFor]="notifMenu" title="Notifications">
              <i class="fa-solid fa-bell"></i>
              @if (unreadCount() > 0) { <span class="badge-dot">{{ unreadCount() }}</span> }
            </button>
            <mat-menu #notifMenu="matMenu" class="notif-mat-menu">
              <div class="notif-menu-inner" (click)="$event.stopPropagation()">
                <app-notification-panel [notifications]="notifications()" (markRead)="onMarkRead($event)"></app-notification-panel>
              </div>
            </mat-menu>

            <button type="button" class="user-chip" [matMenuTriggerFor]="userMenu">
              <app-user-avatar [name]="userName" [size]="36"></app-user-avatar>
              <span class="d-none d-md-inline">{{ userName }}</span>
              <i class="fa-solid fa-chevron-down small"></i>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item [routerLink]="profilePath"><i class="fa-solid fa-user me-2"></i> Profile</a>
              <button mat-menu-item (click)="confirmLogout()"><i class="fa-solid fa-right-from-bracket me-2"></i> Logout</button>
            </mat-menu>
          </div>
        </header>

        <main class="page-content route-fade-enter">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  @Input({ required: true }) navItems: NavItem[] = [];
  @Input() profilePath = '/patient/profile';

  collapsed = signal(false);
  mobileOpen = signal(false);
  notifications = signal<AppNotification[]>([]);

  constructor(
    private authService: AuthService,
    protected themeService: ThemeService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const user = this.authService.currentUser();
    if (user) {
      this.notificationService.getForUser(user.id).subscribe((list) => this.notifications.set(list));
    }
  }

  get userName(): string {
    return this.authService.currentUser()?.fullName ?? 'User';
  }

  get roleLabel(): string {
    const role = this.authService.currentRole();
    return role ? ROLE_LABELS[role] : '';
  }

  unreadCount(): number {
    return this.notifications().filter((n) => !n.isRead).length;
  }

  onMarkRead(n: AppNotification): void {
    if (n.isRead) return;
    this.notificationService.markAsRead(n.id).subscribe(() => {
      this.notifications.update((list) => list.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    });
  }

  confirmLogout(): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Log out?', message: 'You will need to sign in again to access your dashboard.', confirmText: 'Log out', variant: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
