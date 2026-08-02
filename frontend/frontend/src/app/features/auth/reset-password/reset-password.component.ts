import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  token = '';
  tokenValid = false;
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.tokenValid = this.auth.validateResetToken(this.token);
  }

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const result = this.auth.resetPassword(this.token, this.newPassword);
    if (result.success) {
      this.successMessage = result.message;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.errorMessage = result.message;
    }
  }
}