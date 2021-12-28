import React from 'react';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';
import SelectMenu from '../../components/selectMenu';
import LancamentosTable from './lancamentosTable';

import * as messages from '../../components/toastr';

import { withRouter } from 'react-router-dom';

import LancamentoService from '../../app/service/lancamentoService';
import LocalStorageService from '../../app/service/localStorageService';

import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

class ConsultaLancamentos extends React.Component{

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {

        if(!this.state.ano){
            messages.mensagemErro('O preenchimento do campo ano é obrigatório.');
            return false;
        }

        const usuarioLogado = LocalStorageService.getItem('_usuario_logado');
        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }
        
        this.service.consultar(lancamentoFiltro)
            .then( response => {
                if(response.data.length < 1){
                    messages.mensagemAlerta('Nenhum registro encontrado.');
                }
                this.setState({lancamentos: response.data});
            })
            .catch( error => {
                console.log('Erro', error.response.data);
            });
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`);
    }

    confirmarExclusao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento});
        
    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({lancamentos: lancamentos, showConfirmDialog: false});
                messages.mensagemSucesso('Lançamento deletado com sucesso.');
            })  
            .catch( error => {
                messages.mensagemErro('Erro ao tentar exluir o lançamento.');
            });
        
    }

    goToCadastroLancamentos = () => {
        this.props.history.push('/cadastro-lancamentos');
    }

    cancelarExclusao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}});
    }

    alterarStatus = (lancamento, status) => {
        this.service.alterarStatus(lancamento.id, status)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if(index !== -1){
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({ lancamento });
                }
                messages.mensagemSucesso("Status atualizado com sucesso!");
            })
            .catch();
    }

    render(){

        const meses = this.service.meses();
        const tipos = this.service.tipos();

        const confirmDialogFooter = (
            <div>
                <Button label='Confirmar' icon='pi pi-check' onClick={this.deletar}></Button>
                <Button label='Cancelar' icon='pi pi-times' onClick={this.cancelarExclusao} className='p-button-secondary'></Button>
            </div>
        );

        return (
            <Card title="Consultar Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputAno" 
                                    value={this.state.ano}
                                    onChange={e => this.setState({ano: e.target.value})}
                                    placeholder="Digite o Ano"/>
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu 
                                    id="inputMes" 
                                    className="form-control" 
                                    value={this.state.mes}
                                    onChange={e => this.setState({mes: e.target.value})}
                                    lista={meses}/>
                            </FormGroup>

                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputDescricao" 
                                    value={this.state.descricao}
                                    onChange={e => this.setState({descricao: e.target.value})}
                                    placeholder="Digite a descrição do lançamento"/>
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo de Lançamento: ">
                                <SelectMenu 
                                    id="inputTipo" 
                                    className="form-control" 
                                    value={this.state.tipo}
                                    onChange={e => this.setState({tipo: e.target.value})}
                                    lista={tipos}/>
                            </FormGroup>

                            <button 
                                type="button" 
                                onClick={this.buscar} 
                                className="btn btn-success mt-2">
                                    <i className='pi pi-search'></i>
                                     Buscar
                                </button>
                            <button 
                                type="button" 
                                onClick={this.goToCadastroLancamentos} 
                                className="btn btn-danger mt-2">
                                    <i className='pi pi-plus'></i>
                                    Cadastrar
                                </button>

                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="bs-component">
                            <LancamentosTable 
                                lancamentos={this.state.lancamentos} 
                                deleteAction={this.confirmarExclusao}
                                alterarStatus={this.alterarStatus}
                                editAction={this.editar}/>
                        </div>
                    </div>
                </div>

                <div>
                    <Dialog 
                        header='Confirmar Exclusão' 
                        visible={this.state.showConfirmDialog} 
                        style={{width: '50vw'}} 
                        modal={true} 
                        footer={confirmDialogFooter}
                        onHide={ () => this.setState({showConfirmDialog: false})}>
                            Confirma a exclusão deste lançamento?
                    </Dialog>
                </div>
            </Card>
        );
    }

}

export default withRouter(ConsultaLancamentos);