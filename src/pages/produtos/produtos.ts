import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[]; // items será do tipo de coleção de produtos

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => { // resposta ok dos produtos por categoria
        this.items = response['content']; // chegar os produtos
        this.loadImageUrls();
      },
      error => {});
  }

  // método para setar as URL's das imagens de miniatura dos produtos
  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) { // percorrendo a lista de produtos
      let item = this.items[i]; // pegar a refencia do produto 
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => { // se a imagem existir do bucket
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
        error => {});
    }
  }

  // método showDetail() para abrir a página de detalhes
  showDetail(produto_id : string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
  }
}