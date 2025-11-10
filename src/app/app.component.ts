import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from '../components/share/alerts/alerts.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LoginService } from '../services/login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',

  standalone: true,
  imports: [RouterOutlet, AlertsComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);
  isLoggedIn: boolean = false;

  title = 'frontend';

  ngOnInit(): void {
    this.handleLoginStatusChange();
  }

  handleLoginStatusChange() {
    this.loginService.isLogged$.subscribe((status) => {
      console.log(
        '🚀 ~ AppComponent ~ handleLoginStatusChange ~ status:',
        status
      );
      this.isLoggedIn = status;
    });
  }
}
