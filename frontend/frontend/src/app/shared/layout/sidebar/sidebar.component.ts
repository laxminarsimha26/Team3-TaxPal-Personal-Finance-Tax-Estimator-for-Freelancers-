import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() mobileOpen = false;
  @Output() linkClicked = new EventEmitter<void>();

  constructor(public auth: AuthService, private router: Router) {}

  onLinkClick(): void {
    this.linkClicked.emit();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.linkClicked.emit();
  }
}