import { Component, inject } from '@angular/core';
import { LoginService } from '../../../../services/login/login.service';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../services/users/users.service';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const repeatedPassword = control.get('repeatedPassword');

  if (!password || !repeatedPassword) {
    return null;
  }

  return password.value !== repeatedPassword.value ? { mismatch: true } : null;
};
@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css',
})
export class NewUserComponent {
  addUserForm!: FormGroup;

  private authService = inject(LoginService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.addUserForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatedPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordMatchValidator }
    );
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  passwordsMatch(): boolean {
    const password = this.addUserForm.get('password')?.value;
    const repeatedPassword = this.addUserForm.get('repeatedPassword')?.value;
    return password === repeatedPassword;
  }

  checkUserIsLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onAddUser() {
    if (this.addUserForm.valid) {
      this.usersService
        .createUser({
          name: this.addUserForm.value.name,
          email: this.addUserForm.value.email,
          phone: this.addUserForm.value.phone,
          password: this.addUserForm.value.password,
        })
        .subscribe({
          next: () => {
            this.toastr.success('User registered successfully!');
            if (!this.checkUserIsLoggedIn()) {
              this.router.navigate(['/login']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (error) => {
            console.error('User registration failed:', error);
          },
        });
    }
  }
}
