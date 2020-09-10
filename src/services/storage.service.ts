// Criar um serviço StorageService para salvar e obter o usuário logado

import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { Cart } from "../models/cart";

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

    // Métodos para obter e salvar o carrinho em localStorage
    getCart() : Cart {
        let usr = localStorage.getItem(STORAGE_KEYS.cart)
        if (usr != null) {
            return JSON.parse(usr); // Como o localStorage armazena string, converto para o parse do JSON
        }
        else {
            return null;
        }
    }

    setCart(obj : Cart) {
        if (obj != null) { // Se o objeto que eu passei por esse método for diferente de nulo
            localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(obj) /* Valor da chave convertido pra string */); // armazenar esse objeto lá no storage
        }
        else {
            localStorage.removeItem(STORAGE_KEYS.cart); // ficar nulo no usuário armazenado no storage
        }
    }
}