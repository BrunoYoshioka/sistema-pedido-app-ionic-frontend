export interface ProdutoDTO {
    id : string;
    nome : string;
    preco : number;
    imageUrl? : string; // Guardar a Url da imagem do produto é opcional
}