import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() { // evento para executar quando a página for carregada
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

  getCameraPicture() {
    // procedimento para acionar a camera do dispositivo
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false; // desabilitar a camera
    }, (err) => {
    });
  }

  // Método enviar foto
  sendPicture() {
    this.clienteService.uploadPicture(this.picture) // enviar imagem para o aws - s3
      .subscribe(response => {
        this.picture = null;
        this.loadData(); // recarregar os dados da página
      },
      error => {
      });
  }

  cancel() {
    this.picture = null;
  }
}
