import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    // Esse método vai interceptar uma requisição feito lá na API, e dentro aplicando alguma lógica
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Passou no interceptor")
        return next.handle(req) // simplesmente continua a requisição
        .catch((error, caught) => { // se acontecer algum erro

            let errorObj = error;
            if(errorObj.error) { // testar se o errorObj tem o campo error
                errorObj = errorObj.error; // Pegar apenas o error
            }
            
            // Converter o texto para json
            if(!errorObj) { // se o meu objeto de erro ele não tiver o campo status (Isso não é json)
                errorObj = JSON.parse(errorObj); // fazer receber o json dele mesmo
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            return Observable.throw(errorObj); // propaga esse erro
        }) as any;
    }
}

// Além da classe em si, tem que fornecer sobre como esse Interceptor será instanciado
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};
