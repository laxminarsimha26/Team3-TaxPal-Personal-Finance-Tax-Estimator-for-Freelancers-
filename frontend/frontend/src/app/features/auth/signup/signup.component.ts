import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  country = '';
  incomeBracket: 'low' | 'middle' | 'high' | '' = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const result = this.auth.signup({
      name: this.name,
      email: this.email,
      password: this.password,
      country: this.country,
      ...(this.incomeBracket ? { incomeBracket: this.incomeBracket } : {}),
    });

    if (result.success) {
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = result.message;
    }
  }
}