import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from '../components/share/alerts/alerts.component';

@Component({
  selector: 'app-root',

  standalone: true,
  imports: [RouterOutlet, AlertsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
