// Criar um serviço StorageService para salvar e obter o usuário logado

import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";

@Injectable()
export class StorageService {

    // retorna usuário logado
    getLocalUser() : LocalUser {
        let usr = localStorage.getItem(STORAGE_KEYS.localUser) // pegar usuário local
        if (usr == null) {
            return null;
        }
        else {
            return JSON.parse(usr); // Como o localStorage armazena string, converto para o parse do JSON
        }
    }

    // recebe local user e armazena no localStorage
    setLocalUser(obj : LocalUser) {
        if (obj == null) { // Se o objeto que eu passei por esse método for nulo
            localStorage.removeItem(STORAGE_KEYS.localUser); // ficar nulo no usuário armazenado no storage
        }
        else {
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj) /* Valor da chave convertido pra string */); // armazenar esse objeto lá no storage
        }
    }
}