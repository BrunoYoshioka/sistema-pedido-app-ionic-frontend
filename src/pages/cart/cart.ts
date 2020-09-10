import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[]; // coleção de itens do carrinho

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let cart = this.cartService.getCart(); // pegar o carrinho do localStorage, 
    this.items = cart.items; // carregar os itens do carrinho de coleções
    this.loadImageUrls();
  }

  // método Verificar se cada produto do carrinho possui a imagem no aws, se tiver ele carrega a url da imagem no produto que tiver no item
  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) { // percorrendo a lista de produtos
      let item = this.items[i]; // pegar a refencia do produto 
      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => { // se a imagem existir do bucket
          item.produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
        },
        error => {});
    }
  }

}
