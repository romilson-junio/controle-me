import React from 'react';

import { withRouter } from 'react-router-dom';
import FormGroup from '../../components/form-group';
import SelectMenu from '../../components/selectMenu';

import Card from '../../components/card';
import * as Messages from '../../components/toastr';

import LancamentoService from '../../app/service/lancamentoService';
import LocalStorageService from '../../app/service/localStorageService';

class CadastroLancamentos extends React.Component{
    
    state = {
        id: null,
        descricao: '',
        mes: '',
        ano: '',
        valor: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    componentDidMount(){
        const params = this.props.match.params;
        if(params.id){
            this.service.obterPorId(params.id)
                .then( response => {
                    this.setState({ ...response.data, atualizando: true });
                })
                .catch( error => {
                    Messages.mensagemErro(error.response.data);
                });
        }
    }
        
    submit = () => {

        const usuario = LocalStorageService.getItem('_usuario_logado');
        const { descricao, mes ,ano , valor, tipo } = this.state;
        const lancamento = { descricao, mes, ano, valor, tipo, usuario: usuario.id };

        try {
            this.service.validar(lancamento);    
        } catch (erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => Messages.mensagemErro(msg) );
            return false;
        }

        
        this.service.salvar(lancamento)
            .then( response => {
                this.props.history.push('/consulta-lancamentos');
                Messages.mensagemSucesso('Lançamento cadastrado com sucesso!');
            })
            .catch( error => {
                Messages.mensagemErro(error.response.data);
            });
        
    }

    edit = () => {
        
        const { descricao, mes ,ano , valor, tipo, status, id, usuario } = this.state;
        const lancamento = { descricao, mes, ano, valor, tipo, status, id, usuario };
        this.service.atualizar(lancamento)
            .then( response => {
                this.props.history.push('/consulta-lancamentos');
                Messages.mensagemSucesso('Lançamento atualizado com sucesso!');
            })
            .catch( error => {
                Messages.mensagemErro(error.response.data);
            });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name] : value })
    }

    render(){

        const tipos = this.service.tipos();
        const meses = this.service.meses();

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamentos'}>
                <div className='row'>
                    <FormGroup id='inputDescricao' label='Descrição: *'>
                        <input 
                            id='inputDescricao' 
                            type='text' 
                            className='form-control'
                            value={this.state.descricao} 
                            name='descricao'
                            onChange={this.handleChange}/>
                    </FormGroup>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <FormGroup id='inputAno' label='Ano: *'>
                            <input 
                                id='inputAno' 
                                type='text' 
                                className='form-control'
                                value={this.state.ano} 
                                name='ano'
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className='col-md-6'>
                        <FormGroup id='inputMes' label='Mês: *'>
                            <SelectMenu 
                                id='inputMes' 
                                className='form-control' 
                                lista={meses}
                                value={this.state.mes} 
                                name='mes'
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4'>
                        <FormGroup id='inputValor' label='Valor: *'>
                            <input 
                                id='inputValor' 
                                type='text' 
                                className='form-control'
                                value={this.state.valor} 
                                name='valor'
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className='col-md-4'>
                        <FormGroup id='inputTipo' label='Tipo: *'>
                            <SelectMenu 
                                id='inputTipo' 
                                className='form-control' 
                                lista={tipos} 
                                value={this.state.tipo} 
                                name='tipo'
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className='col-md-4'>
                        <FormGroup id='inputStatus' label='Status: '>
                            <input 
                                type='text' 
                                className='form-control' 
                                disabled
                                value={this.state.status} 
                                name='status'/>
                        </FormGroup>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6'>
                            {
                                this.state.atualizando 
                                ? ( <button className='btn btn-success' onClick={this.edit}>
                                        <i className='pi pi-refresh'></i>
                                        Atualizar
                                    </button> )
                                : ( <button className='btn btn-primary' onClick={this.submit}>
                                        <i className='pi pi-save'></i>
                                        Salvar
                                    </button> )
                            }
                            <button 
                                className='btn btn-danger'
                                onClick={e => this.props.history.push('/consulta-lancamentos')}>
                                    <i className='pi pi-times'></i>
                                    Cancelar
                                </button>
                        </div>
                    </div>
                    
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);