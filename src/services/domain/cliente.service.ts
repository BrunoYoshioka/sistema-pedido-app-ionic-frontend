import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class ClienteService {
    
    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public imageUtilService: ImageUtilService) {
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    // fazer uma requisição get lá no bucket para pegar a imagem
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'}); // resposta do tipo blob que é imagem
    }

    // Método para inserir cliente
    insert(obj : ClienteDTO) { // recebendo obj do tipo ClienteDTO
        return this.http.post( // fazer um post
            `${API_CONFIG.baseUrl}/clientes`, // fazer endpoint
            obj, // passando obj
            {
                observe: 'response', // esperar uma resposta
                responseType: 'text' // do tipo texto, pois o corpo vem vazio para evitar que deu erro de parse do JSON 
            }
        );
    }

    // método para enviar a foto (upload)
    uploadPicture(picture) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture); // converter a imagem que estava na base 64 para blob
        let formData : FormData = new FormData(); // instanciar objeto formdata
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post( // fazer um post
            `${API_CONFIG.baseUrl}/clientes/picture`, // fazer endpoint
            formData, // passando obj
            {
                observe: 'response', // esperar uma resposta
                responseType: 'text' // do tipo texto, pois o corpo vem vazio para evitar que deu erro de parse do JSON 
            }
        );
    }
}