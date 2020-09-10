import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService {
    constructor(public storage: StorageService) {
    }

    // método para limpar, ou criar o carrinho no localStorage
    createOrClearCart() : Cart { // retornar Cart
        let cart: Cart = {items: []}; // recebe novo objeto, e jogar no atributo itens dele vazio (carrinho vazio)
        this.storage.setCart(cart); // armazenar o carrinho vazio no localStorage
        return cart;
    }

    // obter o carrinho
    getCart() : Cart {
        let cart: Cart = this.storage.getCart(); // cart armazenado no localStorage
        if (cart == null){ // se não existir cart
            cart = this.createOrClearCart(); // criar o cart
        }
        return cart;
    }

    // função para adicionar um dado produto pro carrinho que está armazenado no storage
    addProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        // buscar dentro do carrinho se o produto já existe
        let position = cart.items.findIndex(x => x.produto.id == produto.id); // encontrar a posição do elemento 
        if (position == -1) {
            cart.items.push({quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart); // atualizar o cart
        return cart;
    }
}
