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

  items : ProdutoDTO[] = []; // items será do tipo de coleção de produtos, iniciando com a lista vazia
  page: number = 0;

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
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => { // resposta ok dos produtos por categoria
        let start = this.items.length; // guardar numa variável start o tamanho que a lista tinha
        this.items = this.items.concat(response['content']); // concatenar a nova resposta com o que já tinha anterior
        let end = this.items.length - 1; // guardar numa variável end com o tamanho -1 (0 -> 10 : 0 a 9 | 10 -> 20 : 10 a 19 | 20 -> 30 : 20 a 29 .....)
        loader.dismiss();
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      });
  }

  // método para setar as URL's das imagens de miniatura dos produtos
  loadImageUrls(start: number, end: number) {
    for (var i=start; i<=end; i++) { // percorrendo a lista de produtos
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
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => { // chamada assíncrona
      refresher.complete(); // depois de 1 segundo ele fecha o refresh
    }, 1000);
  }

  doInfinite(infiniteScroll) { // quando chega no final da tela
    this.page++; // incrementa a página
    this.loadData(); // carrega mais dados
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}