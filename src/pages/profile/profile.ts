import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';

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

  email: string; // criar um atributo email

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService) {
  }

  ionViewDidLoad() { // evento para executar quando a página for carregada
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email){
      this.email = localUser.email; // carregá-lo do storage
    }
  }

}
