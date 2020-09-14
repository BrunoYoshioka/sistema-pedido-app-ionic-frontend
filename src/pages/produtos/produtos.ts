import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

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
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => { // resposta ok dos produtos por categoria
        this.items = response['content']; // chegar os produtos
        loader.dismiss();
        this.loadImageUrls();
      },
      error => {
        loader.dismiss();
      });
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

  // método presentLoading() no controlador da página, com os devidos ajustes
  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.loadData();
    setTimeout(() => { // chamada assíncrona
      refresher.complete(); // depois de certo tempo ele fecha o refresh
    }, 1000);
  }
}