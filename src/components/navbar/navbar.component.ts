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
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  onLogout() {
    this.loginService.clearSession();
    window.location.reload();
  }
}
