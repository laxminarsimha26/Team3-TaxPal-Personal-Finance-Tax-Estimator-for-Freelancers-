import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe({
  next: () => {
    this.router.navigate(['/login']);
  }
});
    this.router.navigate(['/login']);
  }
}