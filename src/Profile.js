import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import {axiosApiInstance} from "../src/components/employees/axiosApiInstance";
class Profile extends Component {
    constructor(props){
        super(props);
        this.state= {email: props.email, name: props.name, errors:{}, form: React.createRef(), token: props.token};

    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isExist', (value) => {
            if (value.length !== 0) {
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        ValidatorForm.removeValidationRule('isExist');
    }

    handleForm = (e) => {
        e.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email
        };

        console.log(data);
         //axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`;
         axiosApiInstance.patch("http://127.0.0.1:8000/api/auth/update",data)
            .then(res => {
                console.log(res.data);
                this.props.setUpdate(data);
                Swal.fire(
                    'Done!',
                    'Edit Successfully',
                    'success'
                );
            })
            .catch(e =>{ console.log(e.response.data.errors)});
    };

    handleInput= (e)=>{
        e.preventDefault();
        //this.setState({errors})
        console.log(e.target.value);
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    };
    render() {
        return (
            <div className="flex w-full ">
                <aside className="w-1/6 bg-black h-screen">
                    <ul className="text-white p-4">
                        <Link to="/profile">
                            <li className="bg-gray-900 py-1 px-3 rounded ">
                                Profile
                            </li>
                        </Link>
                        <Link to="/employees">
                            <li className="bg-gray-900 py-1 px-3 rounded ">
                                Employees
                            </li>
                        </Link>
                        {/*<Link to="/employee">*/}
                        {/*    <li className="bg-gray-900 py-1 px-3 rounded ">*/}
                        {/*        Employee*/}
                        {/*    </li>*/}
                        {/*</Link>*/}
                        {/*<Link to="/em">*/}
                        {/*    <li className="bg-gray-900 py-1 px-3 rounded ">*/}
                        {/*        Employee*/}
                        {/*    </li>*/}
                        {/*</Link>*/}
                    </ul>
                </aside>
                <div className="w-5/6 m-2 bg-white flex justify-center">
                    <ValidatorForm className="border border-gray-500 w-1/2 my-5 rounded"
                        ref= {this.state.form}
                        onSubmit={this.handleForm}
                        onError={error => console.log(error)}
                    >
                        <div className="p-4">
                            <h1 className="text-lg border-b border-gray-500 ">Edit</h1>
                                <div className="mt-4">
                                    <TextValidator
                                        label="Name"
                                        onChange={this.handleInput}
                                        name="name"
                                        value={this.state.name}
                                        validators={['isExist']}
                                        errorMessages={['Name is empty']}
                                    />
                                </div>
                                <div className="mt-4">
                                    <TextValidator
                                        label="Email"
                                        onChange={this.handleInput}
                                        name="email"
                                        value={this.state.email}
                                        validators={['isEmail', 'isExist']}
                                        errorMessages={['Email is not valid','Email is empty']}
                                    />
                                </div>
                                <Button type="submit" className="mt-1 p-2 border border-gray-400 rounded cursor-pointer bg-purple-600 text-red">Submit</Button>
                        </div>
                    </ValidatorForm>
                </div>
                {/*<section className="w-5/6 m-2 bg-white flex justify-center">*/}
                {/*    <form className="border border-gray-500 w-1/2 my-5 rounded" onSubmit={this.handleForm}>*/}
                {/*        <div className="p-4">*/}
                {/*            <h1 className="text-lg border-b border-gray-500 ">Edit</h1>*/}
                {/*            <div className="mt-4">*/}
                {/*                <label>Name</label>*/}
                {/*                <input type="text" name="name" placeholder="name..." onChange={this.handleInput}*/}
                {/*                       value={this.state.name}*/}
                {/*                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>*/}
                {/*            </div>*/}
                {/*            <Error error={this.state.errors['name'] ? this.state.errors['name'] : null}/>*/}

                {/*            <div className="mt-4">*/}
                {/*                <label>Email</label>*/}
                {/*                <input type="email" name="email" placeholder="email..." onChange={this.handleInput}*/}
                {/*                       value={this.state.email}*/}
                {/*                       className="mt-2 p-2 bg-gray-200 rounded border border-gray-400 w-full"/>*/}
                {/*            </div>*/}
                {/*            <Error error={this.state.errors['email'] ? this.state.errors['email'] : null}/>*/}
                {/*            <div className="mt-4">*/}
                {/*                <input type="submit" value="Update" className="mt-1 p-2 border border-gray-400 rounded cursor-pointer bg-purple-600 text-white "/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </form>*/}
                {/*</section>*/}
            </div>
        );
    }
}
const mapStateToProps = state =>{
    return{
        name: state.auth.user.name,
        email: state.auth.user.email,
        token: state.auth.token
    }
};
const mapDispatchToProps = dispatch =>{
    return{
        setUpdate: (user) => dispatch({type: "UPDATE_USER", payload: {user:user}})
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Profile)
