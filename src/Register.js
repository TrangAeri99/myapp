import React, {Component} from 'react';
import axios from "axios";
import cookie from "js-cookie"
import Error from "./components/Error";
class Register extends Component {
    constructor(props){
        super(props);
        this.state= {name:'',email:'', password:'',password_confirmation:'', errors:{}};

    }

    handleForm = (e) =>{
        e.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        };
        axios.post("http://127.0.0.1:8000/api/auth/register",data)
            .then(res => {
                cookie.set('token', res.data.access_token);
                cookie.set('user', res.data.user);
                this.props.history.push('/login');
            })
            .catch(e => this.setState({errors: e.response.data.errors}));
    };

    handleInput = (e) =>{
        e.preventDefault();
        console.log(e.target.value);
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    };
    render() {
        return (
            <div className="flex">
                <div className="w-1/3"/>
                <div className="w-1/3 mt-10 p-4 bg-white">
                    <form className="border border-gray-500" onSubmit={this.handleForm}>
                        <div className="p-4">
                            <h1 className="text-lg border-b border-gray-500 ">Register</h1>
                            <div className="mt-4">
                                <label>Name</label>
                                <input type="text" name="name" placeholder="name..." onChange={this.handleInput}
                                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>
                                <Error error={this.state.errors['name'] ? this.state.errors['name'] : null}/>
                            </div>
                            <div className="mt-4">
                                <label>Email</label>
                                <input type="email" name="email" placeholder="email..." onChange={this.handleInput}
                                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>
                                <Error error={this.state.errors['email'] ? this.state.errors['email'] : null}/>
                            </div>
                            <div className="mt-4">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="password..." onChange={this.handleInput}
                                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>
                                <Error error={this.state.errors['password'] ? this.state.errors['password'] : null}/>
                            </div>
                            <div className="mt-4">
                                <label>Password</label>
                                <input type="password" name="password_confirmation" placeholder="confirm password..." onChange={this.handleInput}
                                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>
                            </div>
                            <div className="mt-4">
                                <input type="submit" value="Register" className="mt-1 p-2 border border-gray-400 rounded cursor-pointer bg-purple-600 text-white "/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;