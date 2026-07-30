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
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

 onSubmit(): void {

  this.errorMessage = '';

  this.auth.signup({
    name: this.name,
    email: this.email,
    password: this.password,
    country: this.country,
    income_bracket: null
  }).subscribe({

    next: (response: any) => {

      if (response.success) {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = response.message;
      }

    },

    error: (error) => {
      this.errorMessage = error.error?.message || 'Signup failed';
    }

  });
 }}