import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 * controlador da página de profile
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() { // evento para executar quando a página for carregada
    let localUser = this.storage.getLocalUser(); // recuperar o usuário do localStorage
    if (localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email) // buscar o cliente por email na requisição
        .subscribe(response => { // inscrever se acontecer a resposta com sucesso
          this.cliente = response as ClienteDTO; // pegar os endereços do cliente
          this.getImageIfExists();
        },
        error => {
          if (error.status == 403){
            // redirecionar para a página home
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => { // inscrever se a requisição acontecer com sucesso, a imagem existe
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`; // jogar a imagem no campo image url do cliente
    },
    error => {});
  }
}
