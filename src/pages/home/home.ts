import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // declarar um objeto do tipo CredenciaisDTO com valores vazios
  creds : CredenciaisDTO = {
    email: "",
    senha: ""
  }

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

  // Quando for clicar no botão de enviar o formulário 
  login(){
    console.log(this.creds); // antes de enviar a página, vou imprimir no console o valor da variável creds
    this.navCtrl.setRoot('CategoriasPage');
  }
}
