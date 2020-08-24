import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx'; // Import atualizado

@Injectable()
export class ProdutoService {

  constructor(public http: HttpClient) {
  }

  // Listar os produtos pela categoria
  findByCategoria(categoria_id : string) { // recebendo id da categoria
    return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`); // obter get da API passando o id da categoria 
  }

  getSmallImageFromBucket(id : string) : Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`
    return this.http.get(url, {responseType : 'blob'});
  }
}