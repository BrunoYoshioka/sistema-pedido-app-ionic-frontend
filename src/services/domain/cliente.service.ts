import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {
    
    constructor(public http: HttpClient, public storage: StorageService) {
    }

    findByEmail(email: string) : Observable<ClienteDTO> {

        // Provisoriamente, incluir o header Authorization
        let token = this.storage.getLocalUser().token; // pegar o token armazenado no localStorage
        let authHeader = new HttpHeaders({'Authorization': 'Bearer ' + token}); // passar o Cabeçalho

        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            {'headers': authHeader}); // Acrescentar o cabeçalho na requisição
    }

    // fazer uma requisição get lá no bucket para pegar a imagem
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'}); // resposta do tipo blob que é imagem
    }
}