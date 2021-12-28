import React from "react";
import { Children } from "react";

function FormGroup(props){
    return (
        <div className="form-group">
            <label htmlFor={props.htmlFor}>{props.label}</label>
            {props.children}
        </div>
    )
}

export default FormGroup