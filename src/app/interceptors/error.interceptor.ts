import { HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.error && error.error.message) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      toastService.error(errorMessage, 'Error', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'increasing',
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
