import axios from "axios";
import {Component} from "react";

export default class makeData2 extends  Component{
    constructor(){
        super();
        this.state({employees: []});
    }

    loadEmployee(){
        axios.get('http://127.0.0.1:8000/api/employees/').then((response) =>{
                this.setState({
                    employees: response.data
                });
                console.log(this.state.employees);
                console.log('a');
            return this.state.employees;
            }
        )
    }
    render(){
    return(
        this.loadEmployee()
    )
    }
}
