import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';

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
        console.log(response);
      }, /*resposta de sucesso*/ 
      error => {
        console.log(error);
      });
  }

  /* f(response){
    console.log(response)
  }*/

}
