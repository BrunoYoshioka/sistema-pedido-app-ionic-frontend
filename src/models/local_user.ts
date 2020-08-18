// Criar um tipo LocalUser correspondente aos dados do usuário logado
export interface LocalUser {
    token: string;
    email: string; // facilitar o acesso email, para não precisar dar o parse do token toda vez
}