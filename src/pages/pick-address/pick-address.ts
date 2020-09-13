import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[]; // declarado do tipo EnderecoDTO em collections

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    // Atualizar o carregamento dos endereços do cliente logado
    let localUser = this.storage.getLocalUser(); // recuperar o usuário do localStorage
    if (localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email) // buscar o cliente por email na requisição
        .subscribe(response => { // inscrever se acontecer a resposta com sucesso
          this.items = response['enderecos']; // receber os endereços
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

}
