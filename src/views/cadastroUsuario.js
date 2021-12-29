import React from "react";

import { withRouter } from 'react-router-dom';

import Card from "../components/card";
import FormGroup from "../components/form-group";
import * as Mensagens from '../components/toastr';

import UsuarioService from "../app/service/usuarioService";

class CadastroUsuario extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }
    
    cadastrar = () => {
    
        const { nome, email, senha, senhaRepeticao } = this.state;
        const usuario = { email, nome, senha, senhaRepeticao };

        try{
            this.service.validar(usuario);
        } catch(erro){
            const msgs = erro.mensagens;
            msgs.forEach(msg => Mensagens.mensagemErro(msg));
            return false;
        }

        this.service.salvar(usuario)
        .then( response => {
            Mensagens.mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.');
            this.props.history.push('/login');
        })
        .catch( error => {
            Mensagens.mensagemErro(error.response.data);
        });
    }

    cancelar = () => {
        this.props.history.push('/login');
    }

    render(){
        return (
            
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input 
                                    type="text" 
                                    id="inputNome" 
                                    className="form-control"
                                    name="nome" 
                                    onChange={ e => this.setState({nome: e.target.value})}/>
                            </FormGroup>
                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input 
                                    type="email"
                                    id="inputEmail"
                                    className="form-control"
                                    name="email"
                                    onChange={e => this.setState({email: e.target.value})}/>
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input 
                                    type="password"
                                    id="inputSenha"
                                    className="form-control"
                                    name="senha"
                                    onChange={e => this.setState({senha: e.target.value})}/>
                            </FormGroup>
                            <FormGroup label="Confirmar Senha: *" htmlFor="inputSenhaRepeticao">
                                <input 
                                    type="password"
                                    id="inputSenhaRepeticao"
                                    className="form-control"
                                    name="senhaRepeticao"
                                    onChange={ e => this.setState({senhaRepeticao: e.target.value}) }/>
                            </FormGroup>
                            <button 
                                onClick={ this.cadastrar } 
                                type="button" 
                                className="btn btn-success mt-3">
                                    <i className='pi pi-save'></i>
                                    Salvar
                                </button>
                            <button 
                                onClick={ this.cancelar } 
                                type="button" 
                                className="btn btn-danger mt-3">
                                    <i className='pi pi-times'></i>
                                    Cancelar
                                </button>
                        </div>
                    </div>
                </div>
            </Card>
            
        );
    }

}

export default withRouter( CadastroUsuario );