import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import {ApiService} from '../../api/api.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    DividerModule,
    RouterLink
  ],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  get passwordsDoNotMatch(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.passwordsDoNotMatch) return;

    this.loading = true;
    this.errorMsg = '';

    const { username, email, password } = this.registerForm.value;

    this.api.register({ username, email, password }).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMsg = 'Rejestracja nie powiodła się. Spróbuj ponownie.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
