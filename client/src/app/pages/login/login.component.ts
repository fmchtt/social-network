import { Component, effect } from '@angular/core';
import { LoginFormComponent } from '../../components/forms/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    effect(() => {
      if (this.authService.authToken()) {
        this.router.navigate(['/home']);
      }
    });
  }
}
