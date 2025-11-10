import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  timeout?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private static alertsSubject = new BehaviorSubject<Alert[]>([]);
  public static alerts$ = AlertService.alertsSubject.asObservable();

  private static showAlert(alert: Omit<Alert, 'id'>) {
    const id = Math.random().toString(36).substring(2);
    const newAlert: Alert = { ...alert, id };

    const currentAlerts = AlertService.alertsSubject.value;
    AlertService.alertsSubject.next([...currentAlerts, newAlert]);

    if (alert.timeout) {
      setTimeout(() => {
        AlertService.clearAlerts();
      }, alert.timeout);
    }
  }

  static success(message: string, title: string = 'Sucesso!') {
    this.showAlert({ type: 'success', title, message, timeout: 5000 });
  }

  static error(message: string, title: string = 'Erro!') {
    this.showAlert({ type: 'danger', title, message, timeout: 8000 });
  }

  static clearAlerts() {
    AlertService.alertsSubject.next([]);
  }
}
