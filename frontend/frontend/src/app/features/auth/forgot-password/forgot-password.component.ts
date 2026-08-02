import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;
  message = '';
  devResetLink = ''; // placeholder for where the emailed link would point

  constructor(private auth: AuthService) {}

  onSubmit(): void {
    const result = this.auth.requestPasswordReset(this.email);
    this.message = result.message;
    this.submitted = true;

    if (result.token) {
      this.devResetLink = `${location.origin}/reset-password/${result.token}`;
    }
  }
}