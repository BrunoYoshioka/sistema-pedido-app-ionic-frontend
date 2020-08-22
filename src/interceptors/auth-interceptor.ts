import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService){
    }

    // Esse método vai interceptar uma requisição feito lá na API, e dentro aplicando alguma lógica
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let localUser = this.storage.getLocalUser();

        // código para não enviar header Authorization em caso de requisição para o bucket do S3
        let N = API_CONFIG.baseUrl.length; // pegar o tamanho da string da baseUrl
        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl; // comparar N caracteres da url da requisição for igual baseUrl, então a requisição é para API

        // pode não ter o token armazenado no storage
        if (localUser && requestToAPI){ // se existir o localUser e a requisição é para API
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)}); // clonar a requisição original acrescentando Authorization com Bearer, acrescentar o cabeçalho caso a requisição for para API 
            return next.handle(authReq);
        }
        else {
            return next.handle(req); // requisição original
        }
    }
}

// Além da classe em si, tem que fornecer sobre como esse Interceptor será instanciado
export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};
