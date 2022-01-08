import React from "react";

import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import CadastroUsuario from '../views/cadastroUsuario';
import Login from '../views/login';
import Home from '../views/home';
import ConsultaLancamentos from '../views/lancamentos/consulta-lancamentos';
import CadastroLancamentos from '../views/lancamentos/cadastro-lancamentos';

import { AuthConsumer } from '../main/provedorDeAutenticao'
import LandingPage from "../views/landingPage";

function RotaAutenticada( {component: Component, isUsuarioAutenticado, ...props } ){
    return (
        <Route {...props} render={ ( componentProps ) => {
            if(isUsuarioAutenticado){
                return (
                    <Component {...componentProps} />
                )
            } else {
                return(
                    <Redirect to={ { pathname: '/login', state: { from: componentProps.location } } }/>
                )
            }
        }} />
    )
}

function Rotas(props){
    return (
        <BrowserRouter>
            <Switch>
                
                <Route exact path="/login" component={Login}/>
                <Route exact path="/cadastro-usuarios" component={CadastroUsuario}/>
                <Route exact path="/" component={LandingPage}/>
                
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} exact path="/home" component={Home}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} exact path="/consulta-lancamentos" component={ConsultaLancamentos}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} exact path="/cadastro-lancamentos/:id?" component={CadastroLancamentos}/>
            </Switch>
        </BrowserRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />) }
    </AuthConsumer>
);