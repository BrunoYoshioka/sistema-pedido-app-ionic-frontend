import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

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
  codpedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService) {

    this.pedido = this.navParams.get('pedido'); // carregar o objeto pedido, atribui como que foi enviado o parametro na página anterior
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items; //Método getCart() para pegar o carrinho e pega os itens dele

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

  total() : number {
    return this.cartService.total();
  } 

  // Voltar para a tela de carrinho
  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    this.pedidoService.insert(this.pedido) // inserção do pedido
      .subscribe(response => {
        this.cartService.createOrClearCart(); // esvaziar o carrinho
        this.codpedido = this.extractId(response.headers.get('location')); // Extrair o id da url do pedido salvo e armazenar no codPedido
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }

  // Extração do id do location da url
  private extractId(location : string) : string {
    let position = location.lastIndexOf('/'); /* ele vai encontrar a ultima posição do substring que informar, que no caso é '/' */
    return location.substring(position + 1, location.length);
  }
}