import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";


@Injectable()
export class AuthService {

    constructor(public http: HttpClient) {
    }

    // Método para Fazer a autenticação
    authenticate(creds : CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds, // Pegar os dados como email e a senha
            // Pegando o header da resposta
            {
                observe: 'response', // especificar essa requisição, que vai retornar do tipo resposta, dessa maneira terá o acesso ao header
                responseType: 'text' // O tipo da resposta deve ser como texto e não JSON, evitar o parse do json
            });
    }
}
