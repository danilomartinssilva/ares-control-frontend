import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  loginService = inject(LoginService);
  name = '';

  constructor() {}

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    const userId = sessionStorage.getItem('userId') || '';
    this.loginService.findById(userId).subscribe({
      next: (user) => {
        this.name = user.name;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  onLogout() {
    this.loginService.clearSession();
    window.location.reload();
  }

  initialOfName(): string {
    return this.name ? this.name.charAt(0).toUpperCase() : '';
  }
}
