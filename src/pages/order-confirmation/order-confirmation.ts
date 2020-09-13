import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService) {
    
    this.pedido = this.navParams.get('pedido'); // carregar o objeto pedido, atribui como que foi enviado o parametro na página anterior
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart() //Método getCart() para pegar o carrinho
    .items; // pega o itens dele

    // mostrar a tela de confirmação de pedido
    this.clienteService.findById(this.pedido.cliente.id) // faz a busca por id
    // como é o padrão assíncrona deve colocar a inscrição da resposta
      .subscribe(response => {
        this.cliente = response as ClienteDTO; // automaticamente ele pega os dados: id, nome e email dessa resposta
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']); // faz a busca de endereços e armazena na variável endereço
      },
      error => { // quando der erro, deu problema de fazer a busca por id, (exemplo, o token pode ter expirado)
        this.navCtrl.setRoot('HomePage');
      })
  }

  // método auxiliar para receber o id e a lista de endereços
  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position]; // retorna objeto da lista pelo id
  }

  total() {
    return this.cartService.total();
  }
}
