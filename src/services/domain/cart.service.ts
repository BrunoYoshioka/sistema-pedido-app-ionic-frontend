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

    // Remover item no carrinho
    removeProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart(); // pegar o carrinho de itens no storage
        // buscar dentro do carrinho se o produto já existe
        let position = cart.items.findIndex(x => x.produto.id == produto.id); // encontrar a posição do elemento 
        if (position != -1) { // Se o produto for encontrado
            cart.items.splice(position, 1);
        }
        this.storage.setCart(cart); // atualizar o cart
        return cart;
    }

    // incrementar a quantidade de um produto no carrinho
    increaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart(); // pegar o carrinho de itens no storage
        // buscar dentro do carrinho se o produto já existe
        let position = cart.items.findIndex(x => x.produto.id == produto.id); // encontrar a posição do elemento 
        if (position != -1) { // Se o produto for encontrado
            cart.items[position].quantidade++; // incrementar a quantidade do produto que estiver nessa posição
        }
        this.storage.setCart(cart); // atualizar o cart
        return cart;
    }

    // decrementar a quantidade de um produto no carrinho
    decreaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart(); // pegar o carrinho de itens no storage
        // buscar dentro do carrinho se o produto já existe
        let position = cart.items.findIndex(x => x.produto.id == produto.id); // encontrar a posição do elemento 
        if (position != -1) { // Se o produto for encontrado
            cart.items[position].quantidade--; // incrementar a quantidade do produto que estiver nessa posição
            if (cart.items[position].quantidade < 1) { // se a quantidade for menor do que 1
                cart = this.removeProduto(produto); // Excluir item do carrinho
            }
        }
        this.storage.setCart(cart); // atualizar o cart
        return cart;
    }

    // Operação Valor total do carrinho
    total() : number {
        let cart = this.getCart(); // pegar o carrinho que está no local storage
        let sum = 0;
        for (var i=0; i<cart.items.length; i++) { // percorrendo os itens do carrinho
            sum += cart.items[i].produto.preco * cart.items[i].quantidade;
        }
        return sum;
    }
}
