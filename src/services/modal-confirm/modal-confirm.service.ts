import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ModalData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ModalConfirmService {
  private readonly modalSubject = new Subject<{
    show: boolean;
    data?: ModalData;
  }>();
  private readonly resultObject = new Subject<boolean>();

  constructor() {}

  getModalState(): Observable<{ show: boolean; data?: ModalData }> {
    return this.modalSubject.asObservable();
  }

  getResult(): Observable<boolean> {
    return this.resultObject.asObservable();
  }

  show(data: ModalData) {
    this.modalSubject.next({ show: true, data });
  }

  close() {
    this.modalSubject.next({ show: false });
  }

  setResult(result: boolean) {
    this.resultObject.next(result);
  }
}
