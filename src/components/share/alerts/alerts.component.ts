import { Component, OnInit } from '@angular/core';
import { Alert, AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];

  ngOnInit() {
    AlertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  closeAlert() {
    AlertService.clearAlerts();
  }
}
