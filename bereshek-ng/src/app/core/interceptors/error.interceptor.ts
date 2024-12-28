import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.error instanceof ErrorEvent) {
        // Клиентская ошибка
        errorMessage = error.error.message;
      } else {
        // Серверная ошибка
        if (error.status === 0) {
          errorMessage = 'Нет соединения с сервером';
        } else if (error.status === 401) {
          errorMessage = 'Необходима авторизация';
        } else if (error.status === 403) {
          errorMessage = 'Доступ запрещен';
        } else if (error.status === 404) {
          errorMessage = 'Ресурс не найден';
        } else if (error.error?.message) {
          errorMessage = Array.isArray(error.error.message)
            ? error.error.message.join(', ')
            : error.error.message;
        }
      }

      return throwError(() => ({ ...error, message: errorMessage }));
    })
  );
}; 