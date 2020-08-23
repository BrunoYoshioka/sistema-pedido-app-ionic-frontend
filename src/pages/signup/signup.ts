import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  // definir o FormGroup (Controla o formulário, fazendo validações de uma forma interessante)
  formGroup: FormGroup;
  estados: EstadoDTO[]; // uma coleção de estados
  cidades: CidadeDTO[]; // uma coleção de cidades

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertCtrl: AlertController) {

      // instanciar definindo o FormGroup e pertence formBuilder
      this.formGroup = this.formBuilder.group({
        nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
        tipo : ['1', [Validators.required]],
        cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha : ['123', [Validators.required]],
        logradouro : ['Rua Via', [Validators.required]],
        numero : ['25', [Validators.required]],
        complemento : ['Apto 3', []],
        bairro : ['Copacabana', []],
        cep : ['10828333', [Validators.required]],
        telefone1 : ['977261827', [Validators.required]],
        telefone2 : ['', []],
        telefone3 : ['', []],
        estadoId : [null, [Validators.required]],
        cidadeId : [null, [Validators.required]]
      })
  }

  // para carregamento inicial dos estados e cidades
  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(response => { // se ocorrer tudo ok
        // armazenar os estados buscados
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id); // pegar o primeiro elemento da lista e atribuir ele na lista estadoId do formulário
        this.updateCidades(); // buscar as cidades correspondente ao estado selecionado
      },
      error => {});
  }

  // Evento para carregar as cidades quando um estado é selecionado
  updateCidades() {
    let estado_id = this.formGroup.value.estadoId; // pegar o cod do estado selecionado da lista do html do formulário
    this.cidadeService.findAll(estado_id) // por estado selecionado
      .subscribe(response => {
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null); // deselecionar a cidade selecionada no formulário
      },
      error => {});
  }

  signupUser() {
    this.clienteService.insert(this.formGroup.value)
      .subscribe(response => {
        this.showInsertOk();
      },
      error => {});
  }

  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso', // Mostrar uma mensagem de confirmação de cadastro
      enableBackdropDismiss: false, // só pode sair desse alert clicando no botão ok
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop(); // desempilhar essa página, pois esse form de cadastro foi empilhado em cima do login
          }
        }
      ]
    });
    alert.present(); // Apresentar esse alert
  }
}
