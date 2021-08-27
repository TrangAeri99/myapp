import React, {Component} from 'react';
import axios from "axios";
import cookie from "js-cookie";
import {connect} from "react-redux";
import Error from "./components/Error";

class Login extends Component {
    constructor(props){
        super(props);
        this.state= {email:'', password:'', errors:{}};

    }

    handleForm= (e) =>{
      e.preventDefault();
      const data = {
          email: this.state.email,
          password: this.state.password
      };
      axios.post("http://127.0.0.1:8000/api/auth/login",data)
          .then(res => {
              //cookie.set('token', res.data.access_token);

              this.props.setLogin(res.data.access_token, res.data.user, res.data.expires_in);
              console.log(res.data.expires_in);
              //this.props.getU(res.data.user);

              this.props.history.push('/profile');
          })
          //.catch(e => console.log(e.response.data.errors));
          .catch(e => this.setState({errors: e.response.data.errors}));

    };

    handleInput= (e)=>{
      e.preventDefault();
      console.log(e.target.value);
      const name = e.target.name;
      const value = e.target.value;
      this.setState({[name]: value});
    };

    render() {
        //const error = this.state.errors;
        return (
            <div className="flex">
                <div className="w-1/3"/>
                <div className="w-1/3 mt-10 p-4 bg-white">
                    <form className="border border-gray-500" onSubmit={this.handleForm}>
                        <div className="p-4">
                            <h1 className="text-lg border-b border-gray-500 ">Login</h1>
                            <Error error={this.state.errors['result'] ? this.state.errors['result'] : null}/>
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
                                <input type="submit" name="submit" className="mt-1 p-2 border border-gray-400 rounded cursor-pointer bg-purple-600 text-white "/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        setLogin: (token,user, expires_in) => dispatch({type: "SET_LOGIN", payload:{token: token, user:user, expires_in: expires_in}}),
        //getU: (user) => dispatch({type: "GET_USER", payload: {user:user}})
    }
};

export default connect(null, mapDispatchToProps)(Login)