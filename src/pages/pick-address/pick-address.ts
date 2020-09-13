import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[]; // declarado do tipo EnderecoDTO em collections

  pedido: PedidoDTO; // PedidoDTO para trafegar nas páginas de fechamento de pedido

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    // Atualizar o carregamento dos endereços do cliente logado
    let localUser = this.storage.getLocalUser(); // recuperar o usuário do localStorage
    if (localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email) // buscar o cliente por email na requisição
        .subscribe(response => { // inscrever se acontecer a resposta com sucesso
          this.items = response['enderecos']; // receber os endereços

          let cart = this.cartService.getCart(); // uma variável para pegar o carrinho armazenado no localStorage

          // instanciar um PedidoDTO a partir dos dados existentes
          this.pedido = {
            cliente: {id: response['id']},
            enderecoDeEntrega: null,
            pagamento: null,
            itens : cart.items.map(x => {return {quantidade: x.quantidade, produto: {id: x.produto.id}}}) // percorre toda a lista 
          }
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

  // método nextPage - Mostrar o pedido no console
  nextPage(item: EnderecoDTO) {
    this.pedido.enderecoDeEntrega = {id: item.id}; // pegar o objeto id do pedido instanciado no ionViewDidLoad

    // fazer a navegação para PaymentPage (Nota: enviar o objeto Pedido)
    this.navCtrl.push('PaymentPage', {pedido: this.pedido}); // empilhar a página PaymentPage
  }

}
