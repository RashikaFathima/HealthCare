import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    <div class="avatar" [style.width.px]="size" [style.height.px]="size" [style.fontSize.px]="size/2.4">
      {{ initials }}
    </div>
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--gradient-hero); color: #fff; font-weight: 700; flex-shrink: 0;
    }
  `]
})
export class UserAvatarComponent {
  @Input({ required: true }) name!: string;
  @Input() size = 40;

  get initials(): string {
    const parts = (this.name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }
}
