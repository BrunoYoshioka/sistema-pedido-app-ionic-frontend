import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the CategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: CategoriaDTO[]; // uma lista será exposta pelo controlador pro HTML possa ler os dados.

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  // Chamar o findAll (Chamar para testar se esta recuperando todas as categorias no api)


  ionViewDidLoad() {
    // Chamada assincrona
    this.categoriaService.findAll()
    // na chamada assincrona, tem que se inscrever para fazer algo quando a resposta chegar
      //.subscribe(this.f) // Essa é a famosa função "callback" ("f" é a função "callback")
      .subscribe(response => { /* função anônima é também chamada de "arrow function" */
        this.items = response;
      }, /*resposta de sucesso*/ 
      error => {});
  }
}
