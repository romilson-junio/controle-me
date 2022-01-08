import React from 'react';

import AuthService from '../app/service/authService';
import ApiService from '../app/apiservice'
import jwt from 'jsonwebtoken';

export const AuthContext = React.createContext();
export const AuthConsumer = AuthContext.Consumer;
const AuthProvider = AuthContext.Provider;

class ProvedorAutenticacao extends React.Component{
    
    state = {
        usuarioAutenticado: null,
        isAutenticado: false
    }

    iniciarSessao = (tokenDTO) => {
        const token = tokenDTO.token;
        const claims = jwt.decode(token);
        const usuario = {
            nome: claims.nome,
            email: claims.sub,
            id: claims.userid
        }
        AuthService.logar(usuario, token);
        this.setState({isAutenticado: true, usuarioAutenticado: usuario});
    }

    encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        this.setState({isAutenticado: false, usuarioAutenticado: null})
    }

    componentDidMount(){
        if(AuthService.isUsuarioAutenticado()){
            const usuario = AuthService.refreshSession();
            this.setState({
                isAutenticado: true,
                usuarioAutenticado: usuario
            })
        }
    }

    render(){
        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            isAutenticado: this.state.isAutenticado,
            iniciarSessao: this.iniciarSessao,
            encerrarSessao: this.encerrarSessao
        }
        return(
            <AuthProvider value={contexto}>
                {this.props.children}
            </AuthProvider>
        )
    }
}

export default ProvedorAutenticacao;
