import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('api.themoviedb.org')) {
        const cloned = req.clone({
            setParams: {
                api_key: environment.api_key,
                language: 'es-MX'
            }
        });
        return next(cloned);
    }
    return next(req);
};
