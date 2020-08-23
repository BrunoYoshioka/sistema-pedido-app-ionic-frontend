import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService) {

  }

  // Quando a pagina entrar
  ionViewWillEnter() {
    this.menu.swipeEnable(false); // desabilitar o menu
  }

  // Quando a pagina sair
  ionViewDidLeave() {
    this.menu.swipeEnable(true); // voltar o menu
  }

  // Ciclo de vida da app
  ionViewDidEnter() {
    this.auth.refreshToken() // chamar o método refreshToken do AuthService
    // escrever se vier com resposta com sucesso
      .subscribe(response => {
        // chamar successfulLogin se a autenticação ocorrer com sucesso
        this.auth.successfulLogin(response.headers.get('Authorization')); // imprimir no console para ver se realmente esta acessando este cabeçalho que vai vir com token
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});
  }

  // Quando for clicar no botão de enviar o formulário 
  login(){
    this.auth.authenticate(this.creds) // chamar o método authenticate do AuthService
    // escrever se vier com resposta com sucesso
      .subscribe(response => {
        // chamar successfulLogin se a autenticação ocorrer com sucesso
        this.auth.successfulLogin(response.headers.get('Authorization')); // imprimir no console para ver se realmente esta acessando este cabeçalho que vai vir com token
        this.navCtrl.setRoot('CategoriasPage');
      },
      error => {});
  }
}
