
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

 onSubmit(): void {

  this.errorMessage = '';

  this.auth.login(this.email, this.password)
    .subscribe({

      next: (response: any) => {

        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message;
        }

      },

      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
      }

    });

}}
