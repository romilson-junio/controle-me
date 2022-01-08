import LocalStorageService from "./localStorageService";

import jwt from 'jsonwebtoken';
import ApiService from '../apiservice'

export const USUARIO_LOGADO = '_usuario_logado';
export const TOKEN = '_access_token';

export default class AuthService {

    static isUsuarioAutenticado(){

        const token = LocalStorageService.getItem(TOKEN);
        const decodedToken = jwt.decode(token);
        console.log(decodedToken);
        if(decodedToken != null){
            const expiration = decodedToken.exp;
            const isTokenInvalido = Date.now() >= (expiration * 1000);
            return !isTokenInvalido;
        }
        
        return false;
        
    }

    static removerUsuarioAutenticado(){
        LocalStorageService.removerItem(USUARIO_LOGADO);
        LocalStorageService.removerItem(TOKEN);
    }

    static logar(usuario, token){
        LocalStorageService.addItem(USUARIO_LOGADO, usuario);
        LocalStorageService.addItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static obterUsuarioAutenticado(){
        return LocalStorageService.getItem(USUARIO_LOGADO);
    }

    static refreshSession(){
        const token = LocalStorageService.getItem(TOKEN);
        const usuario = AuthService.obterUsuarioAutenticado();
        AuthService.logar(usuario, token);
        return usuario;
    }

}