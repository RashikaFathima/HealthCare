import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  // Injecting ThemeService here ensures the saved theme preference
  // is applied to <html> as soon as the app boots, on every route.
  constructor(private themeService: ThemeService) {}
}
