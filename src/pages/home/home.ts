import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  // Quando a pagina entrar
  ionViewWillEnter() {
    this.menu.swipeEnable(false); // desabilitar o menu
  }

  // Quando a pagina sair
  ionViewDidLeave() {
    this.menu.swipeEnable(true); // voltar o menu
  }

  login(){
    this.navCtrl.setRoot('CategoriasPage');
  }
}
