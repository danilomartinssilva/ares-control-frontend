import { Component, OnInit } from '@angular/core';
import { Alert, AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];

  ngOnInit() {
    AlertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  closeAlert(id: string) {
    AlertService.clearAlerts();
  }
}
