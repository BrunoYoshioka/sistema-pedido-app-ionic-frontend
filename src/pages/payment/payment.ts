import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';

// Controlador da página para escolher o tipo de pagamento
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  pedido: PedidoDTO; // recebido pela página de escolher endereço
  parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  formGroup: FormGroup; // usar um formulário para controlar os dados da tela que o usuário vai entrar

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder /* objeto que serve para montar o controlador do formulário */) {

    // instanciar pedido, o objeto pedido que vai vir como parâmetro na navegação na página de endereço
    this.pedido = this.navParams.get('pedido');

    this.formGroup = this.formBuilder.group({
      numeroDeParcelas: [1, Validators.required], // valor 1 no padrão e validator requerido
      "@type": ["pagamentoComCartao", Validators.required] // No padrão é com cartão e validator requerido
    });
  }

  nextPage() {
    this.pedido.pagamento = this.formGroup.value; // os dados que foram preenchidos na página html (payment.html)
    console.log(this.pedido); //mostrar no console o pedido preenchido com o pagamento 
  }
}
