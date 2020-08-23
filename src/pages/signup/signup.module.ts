import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
  ],

  // registrar os serviços nos providers
  providers: [
    CidadeService,
    EstadoService
  ] // esses serviços só podem ser instanciados no escopo da página de signup
})
export class SignupPageModule {}
