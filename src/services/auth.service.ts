import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';


@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(public http: HttpClient, public storage: StorageService) {
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

    // Método successfulLogin
    successfulLogin(authorizationValue : string) {
        let tok = authorizationValue.substring(7); // Cortar a palavra "Bearer " pegando só o token
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub // incluindo email extraído do token
        };
        this.storage.setLocalUser(user); // armazenando a variável instanciada (user) no localStorage
    }

    // Método logout
    logout() {
        this.storage.setLocalUser(null); // remover o usuário no storage
    }
}
