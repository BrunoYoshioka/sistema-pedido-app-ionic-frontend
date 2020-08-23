import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { FieldMessage } from '../models/fieldmessage';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController) {
    }

    // Esse método vai interceptar uma requisição feito lá na API, e dentro aplicando alguma lógica
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log("Passou no interceptor")
        return next.handle(req) // simplesmente continua a requisição
        .catch((error, caught) => { // se acontecer algum erro

            let errorObj = error;
            if(errorObj.error) { // testar se o errorObj tem o campo error
                errorObj = errorObj.error; // Pegar apenas o error
            }
            
            // Converter o texto para json
            if(!errorObj.status) { // se o meu objeto de erro ele não tiver o campo status (Isso não é json)
                errorObj = JSON.parse(errorObj); // fazer receber o json dele mesmo
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            // acrescentar um tratamento específico para 403

            // switch para testar várias possibilidades do status
            switch(errorObj.status) {
                case 401:
                    this.handle401();
                    break;

                case 403:
                    this.handle403();
                    break;

                // tratar especificamente o erro 422
                case 422:
                    this.handle422(errorObj);
                    break;

                default: // tratando outros erros
                    this.handleDefaultEror(errorObj);
            }

            return Observable.throw(errorObj); // propaga esse erro
        }) as any;
    }

    // função auxiliar 
    handle403(){
        // Limpeza do localStorage
        this.storage.setLocalUser(null);
    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, // sair do alert pelo botão
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        }); // permitir criar objeto do alert
        alert.present(); // Apresentar esse alert
    }

    handle422(errorObj) { // Erros da API (backend)
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false, // sair do alert pelo botão
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        }); // permitir criar objeto do alert
        alert.present(); // Apresentar esse alert
    }

    // tratando outros erros
    handleDefaultEror(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();        
    }

    private listErrors(messages : FieldMessage[]) : string {
        let s : string = ''; // começar com string vazio
        for (var i=0; i<messages.length; i++) { // percorrer todos os elementos da lista de mensagens
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }
}

// Além da classe em si, tem que fornecer sobre como esse Interceptor será instanciado
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};
