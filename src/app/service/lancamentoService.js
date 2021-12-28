import ApiService from '../apiservice';
import ErroValidacao from './exception/ErroValidacao';

export default class LancamentoService extends ApiService{
    
    constructor(){
        super('/api/lancamentos');
    }

    deletar(id){
        return this.delete(`/${id}`);
    }

    obterPorId(id){
        return this.get(`/${id}`);
    }

    consultar(lancamentoFiltro){
        
        let url = `?ano=${lancamentoFiltro.ano}`;

        if(lancamentoFiltro.mes){
            url += `&mes=${lancamentoFiltro.mes}`
        }

        if(lancamentoFiltro.tipo){
            url += `&tipo=${lancamentoFiltro.tipo}`
        }

        if(lancamentoFiltro.status){
            url += `&status=${lancamentoFiltro.status}`
        }

        if(lancamentoFiltro.usuario){
            url += `&usuario=${lancamentoFiltro.usuario}`
        }

        if(lancamentoFiltro.descricao){
            url += `&descricao=${lancamentoFiltro.descricao}`
        }

        return this.get(url);

    }

    salvar(lancamento){
        return this.post('/', lancamento);
    }

    atualizar(lancamento){
        return this.put(`/${lancamento.id}`, lancamento);
    }

    alterarStatus(id, status){
        return this.put(`/${id}/atualizar-status`, { status });
    }

    meses(){
        return [
            {value: 0, label: 'Selecione...' },
            {value: 1,  label: 'Janeiro' },
            {value: 2,  label: 'Fevereiro' },
            {value: 3,  label: 'Março' },
            {value: 4,  label: 'Abril' },
            {value: 5,  label: 'Maio' },
            {value: 6,  label: 'Junho' },
            {value: 7,  label: 'Julho' },
            {value: 8,  label: 'Agosto' },
            {value: 9,  label: 'Setembro' },
            {value: 10, label: 'Outubro' },
            {value: 11, label: 'Novembro' },
            {value: 12, label: 'Dezembro' }
        ]
    }

    tipos(){
        return [
            {value: 0, label: 'Selecione...'},
            {value: 'RECEITA', label: 'Receita'},
            {value: 'DESPESA', label: 'Despesa'}
        ]
    }

    validar(lancamento){
        const erros = [];

        if(!lancamento.ano){
            erros.push("Informe o Ano!");
        }

        if(!lancamento.descricao){
            erros.push("Informe a Descrição!");
        }

        if(!lancamento.mes){
            erros.push("Informe o Mês!");
        }

        if(!lancamento.valor){
            erros.push("Informe o Valor!");
        }

        if(!lancamento.tipo){
            erros.push("Informe o Tipo!");
        }

        if(erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

}