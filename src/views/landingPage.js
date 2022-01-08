import React from "react";
import {withRouter} from 'react-router-dom'

class LandingPage extends React.Component{

goToHomePage = () => {
    this.props.history.push("/home");
}

    render(){
        return(
            <div className="container text-center">
                <h2>Bem vindo ao Controle-Me</h2>
                <p>Para acessar <br/>
                    <a onClick={this.goToHomePage} className="btn btn-outline-secondary">
                        <i className="pi pi-sign-in pr-2"></i>
                        clique aqui
                    </a>
                </p>
            </div>
        )
    }
}

export default withRouter(LandingPage)