import React from "react";
import {Table, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import axios from "axios";
import './app1.css';
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import SearchBar from "./SearchBar";
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {axiosApiInstance} from "../employees/axiosApiInstance";
class List extends React.Component {
    constructor() {
        super();
        this.onChangeEmployeeName = this.onChangeEmployeeName.bind(this);
        this.onChangeEmployeeCmt = this.onChangeEmployeeCmt.bind(this);
        this.onChangeEmployeeDateOfBirth = this.onChangeEmployeeDateOfBirth.bind(this);
        this.onChangeEmployeeGender = this.onChangeEmployeeGender.bind(this);
        this.onChangeEmployeeAddress = this.onChangeEmployeeAddress.bind(this);
        this.onChangeEmployeeLevel = this.onChangeEmployeeLevel.bind(this);
        this.onChangeEmployeeYearOfEx = this.onChangeEmployeeYearOfEx.bind(this);
        this.onChangeEmployeePosition = this.onChangeEmployeePosition.bind(this);
        this.onChangeEmployeeImagePath = this.onChangeEmployeeImagePath.bind(this);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.loadEmployee = this.loadEmployee.bind(this);

        this.state = {
            employees: [],
            newEmployeeModal: false,
            editEmployeeModal: false,
            name: '',
            cmt: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            level: '',
            yearOfEx: '',
            position: '',
            image_path: null,
            filterText: '',
            file: null,imagePreviewUrl: null,
            form: React.createRef()
        };

    }

    componentDidMount() {
        this.loadEmployee();
    }

    toggleNewEmployeeModal() {
        this.setState({
            newEmployeeModal: !this.state.newEmployeeModal
        });
        if(!this.state.newEmployeeModal){
            this.setState({
                name: '',
                cmt: '',
                dateOfBirth: '',
                gender: '',
                address: '',
                level: '',
                yearOfEx: '',
                position: '',
                image_path: null,
                imagePreviewUrl: null
            });
        }
    }

    toggleEditEmployeeModal() {
        this.setState({
            editEmployeeModal: !this.state.editEmployeeModal
        })
    }

    addEmployee() {
        this.form.validateFields();
        if (!this.form.isValid()) {
            console.log('form is invalid: do not submit');
        } else {
            console.log('form is valid: submit');
        }
        const formData = new FormData();
        formData.append('name', this.state.name);
        formData.append('cmt', this.state.cmt);
        formData.append('dateOfBirth', this.state.dateOfBirth);
        formData.append('gender', this.state.gender);
        formData.append('address', this.state.address);
        formData.append('level', this.state.level);
        formData.append('yearOfEx', this.state.yearOfEx);
        formData.append('position', this.state.position);
        if (this.state.image_path instanceof File) formData.append('image_path', this.state.image_path, this.state.image_path.name);

        console.log(formData.get('image_path'));
        console.log('image');
        axiosApiInstance.post('http://127.0.0.1:8000/api/employees/', formData)
            .then(response => {
                console.log(response);
                console.log(response.message);
                if (response.data) {
                    let {employees} = this.state;
                    this.loadEmployee();

                    this.setState({
                        employees,
                        newEmployeeModal: false,
                        name: '',
                        cmt: '',
                        dateOfBirth: '',
                        gender: '',
                        address: '',
                        level: '',
                        yearOfEx: '',
                        position: '',
                        image_path: null,
                        imagePreviewUrl: null
                    });

                    Swal.fire(
                        'Done!',
                        'Employee Added Successfully',
                        'success'
                    );
                }
            })
            .catch((error) => {
                console.log(error);
                console.log('error' + error.response.data.errors);
            });

    }

    updateEmployee() {
        this.form.validateFields();
        if (!this.form.isValid()) {
            console.log('form is invalid: do not submit');
        } else {
            console.log('form is valid: submit');
        }

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('id', this.state.id);
        formData.append('name', this.state.name);
        formData.append('cmt', this.state.cmt);
        formData.append('dateOfBirth', this.state.dateOfBirth);
        formData.append('gender', this.state.gender);
        formData.append('address', this.state.address);
        formData.append('level', this.state.level);
        formData.append('yearOfEx', this.state.yearOfEx);
        formData.append('position', this.state.position);
        if (this.state.image_path instanceof File) formData.append('image_path', this.state.image_path, this.state.image_path.name);
        console.log('formdata');
        console.log(formData.get('image_path'));
        axiosApiInstance.post('http://127.0.0.1:8000/api/employees/' + this.state.id, formData)
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    console.log('Employee successfully updated');
                    this.loadEmployee();
                    this.setState({
                        editEmployeeModal: false,
                        id: '',
                        name: '',
                        cmt: '',
                        dateOfBirth: '',
                        gender: '',
                        address: '',
                        level: '',
                        yearOfEx: '',
                        position: '',
                        image_path: null,
                        imagePreviewUrl: null
                    });
                    Swal.fire(
                        'Done!',
                        'Employee edit Successfully',
                        'success'
                    );
                }
            }).catch((error) => {
            console.log(error)

        });

    }

    editEmployee(id, name, image_path, cmt, dateOfBirth, gender, address, level, yearOfEx, position) {
        this.setState({
            id: id,
            name: name,
            image_path: image_path,
            cmt: cmt,
            dateOfBirth: dateOfBirth,
            gender: gender,
            address: address,
            level: level,
            yearOfEx: yearOfEx,
            position: position,
            editEmployeeModal: !this.state.editEmployeeModal
        })
    }

    deleteEmployee(id) {
        this.setState({id: id});
        console.log(this.state.id);
        axiosApiInstance.delete('http://127.0.0.1:8000/api/employees/' + this.state.id)
            .then((res) => {
                console.log('Employee removed deleted!');
                this.loadEmployee();
            }).catch((error) => {
            console.log(error)
        })
    }

     loadEmployee() {
        axios.get('http://127.0.0.1:8000/api/employees/')
            .then((response) => {
                this.setState({
                    employees: response.data
                });
                console.log('axios');
                console.log(this.state.employees);
            }
            )
    }

    onChangeEmployeeName(e) {
        console.log(e.target.value);
        this.setState({name: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeCmt(e) {
        this.setState({cmt: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeDateOfBirth(e) {
        this.setState({dateOfBirth: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeGender(e) {
        this.setState({gender: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeAddress(e) {
        this.setState({address: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeLevel(e) {
        this.setState({level: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeYearOfEx(e) {
        this.setState({yearOfEx: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeePosition(e) {
        this.setState({position: e.target.value});
        this.form.validateFields(e.target);
    }

    onChangeEmployeeImagePath(e) {
        //console.log(e.target.files[0].name);
        //this.setState({image_path: e.target.files[0]});
        e.preventDefault();

        let reader = new FileReader();
        let image_path = e.target.files[0];

        reader.onloadend = (e) => {
            this.setState({
                //image_path: e.target.files[0],
                imagePreviewUrl: reader.result
            });
            console.log(this.state.imagePreviewUrl);
        };
        this.setState({image_path: e.target.files[0]});
        console.log(image_path);
        reader.readAsDataURL(image_path);
        this.form.validateFields(e.target);
    };

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }


    renderEmployeesList(){
        const filterText = this.state.filterText;
        console.log(filterText);
        console.log('employees');
        console.log(this.state.employees);
        if (filterText !== ''){
            const newItems = this.state.employees.filter((item)=>item.name.indexOf(filterText) !== -1);

            return(
                <React.Fragment>
                    <div className="list-group">
                        <Table className="App container">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Avatar</th>
                                <th>CMT</th>
                                <th>Date Of Birth</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>Level</th>
                                <th>Year Of Ex</th>
                                <th>Position</th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {newItems.map((employee) => {
                                //return <li className="list-group-item" key={index}>{employee.name}</li>
                                //const { id, name, image_path, cmt } = employee;
                                return (
                                    <tr key={employee.id}>
                                        <th scope="employee">{employee.id}</th>
                                        <td>{employee.name}</td>
                                        <td><img className="imagecontainer" src={'http://127.0.0.1:8000/storage/'+ employee.image_path} alt=""/></td>
                                        <td>{employee.cmt}</td>
                                        <td>{employee.dateOfBirth}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.address}</td>
                                        <td>{employee.level}</td>
                                        <td>{employee.yearOfEx}</td>
                                        <td>{employee.position}</td>
                                        <td>
                                            <Button size="sm" variant="info" onClick={this.editEmployee.bind(this, employee.id, employee.name,employee.image_path,employee.cmt,
                                                employee.dateOfBirth,employee.gender, employee.address, employee.level, employee.yearOfEx, employee.position)}>
                                                <i className="fa fa-edit"></i></Button>
                                        </td>
                                        <td>
                                            <Button color="danger" size="sm" onClick={() => {if(window.confirm('Delete the employee?')) {this.deleteEmployee.bind(this, employee.id)}}}><i className="fa fa-trash"></i></Button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </Table>
                    </div>

                </React.Fragment>


            )
            }

        return(
            <React.Fragment>
                <div className="list-group">
                    <Table className="App container">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Avatar</th>
                            <th>CMT</th>
                            <th>Date Of Birth</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Level</th>
                            <th>Year Of Ex</th>
                            <th>Position</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.employees.map((employee) => {
                                //return <li className="list-group-item" key={index}>{employee.name}</li>
                                //const { id, name, image_path, cmt } = employee;
                                return (
                                    <tr key={employee.id}>
                                        <th scope="employee">{employee.id}</th>
                                        <td>{employee.name}</td>
                                        <td><img className="imagecontainer" src={'http://127.0.0.1:8000/storage/'+ employee.image_path} alt="" /></td>
                                        <td>{employee.cmt}</td>
                                        <td>{employee.dateOfBirth}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.address}</td>
                                        <td>{employee.level}</td>
                                        <td>{employee.yearOfEx}</td>
                                        <td>{employee.position}</td>
                                        <td>
                                            <Button size="sm" variant="info" onClick={this.editEmployee.bind(this, employee.id, employee.name,employee.image_path,employee.cmt,
                                                employee.dateOfBirth,employee.gender, employee.address, employee.level, employee.yearOfEx, employee.position)}>
                                                <i className="fa fa-edit"></i></Button>
                                        </td>
                                        <td>
                                            <Button color="danger" size="sm" onClick={() => {if(window.confirm('Delete the employee?')) {this.deleteEmployee.bind(this, employee.id)}}}><i className="fa fa-trash"></i></Button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                </div>

            </React.Fragment>


        )
    }
    render() {
         const employees = this.state.employees;
         console.log(employees);
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} alt=""/>);
        } else {
            $imagePreview = (<img src={'http://127.0.0.1:8000/storage/'+this.state.image_path} alt=""/>);
        }
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
                        <Link to="/employee">
                            <li className="bg-gray-900 py-1 px-3 rounded ">
                                Employee
                            </li>
                        </Link>
                    </ul>
                </aside>
                <section className="w-5/6 m-2 bg-white flex justify-center">
                    <div className="App container">
                        <div className="d-flex justify-content-between m-4">
                            <div className="w-1/5">
                                <SearchBar
                                    filterText={this.state.filterText}
                                    onFilterTextChange={this.handleFilterTextChange}
                                />
                            </div>
                            <div className="mr-10">
                                <Button color="primary" onClick={this.toggleNewEmployeeModal.bind(this)}><i className="fa fa-plus"></i>Add Employee</Button>
                            </div>
                        </div>

                        <Modal isOpen={this.state.newEmployeeModal} toggle={this.toggleNewEmployeeModal.bind(this)}>
                            <ModalHeader toggle={this.toggleNewEmployeeModal.bind(this)}>Add a new employee</ModalHeader>
                            <ModalBody>
                                <FormWithConstraints
                                        ref={form => this.form = form}
                                        onSubmit={this.addEmployee.bind(this)}
                                        noValidate>
                                    <Form.Group controlId="image_path">
                                        <Form.Label>Avatar</Form.Label>
                                        <br/>

                                        <div className="imagecontainer">
                                            {$imagePreview}
                                        </div>
                                        <input multiple type="file" accept="image/*" required encType="multipart/form-data"
                                               name='image_path'   onChange={this.onChangeEmployeeImagePath} />
                                    </Form.Group>
                                    <FieldFeedbacks for="image_path">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId='name'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" value={this.state.name} required name="name" pattern=".{5,}"
                                                      onChange={this.onChangeEmployeeName}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="name">
                                        <FieldFeedback when="valueMissing" />
                                        <FieldFeedback when="patternMismatch">
                                            Should be at least 5 characters long
                                        </FieldFeedback>
                                    </FieldFeedbacks>
                                    <Form.Group controlId="cmt">
                                        <Form.Label>CMT</Form.Label>
                                        <Form.Control type="text"  value={this.state.cmt} required name="cmt" onChange={this.onChangeEmployeeCmt}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="cmt">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="dateOfBirth">
                                        <Form.Label>Date Of Birth</Form.Label>
                                        <Form.Control type="date"  value={this.state.dateOfBirth} required name="dateOfBirth" onChange={this.onChangeEmployeeDateOfBirth}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="dateOfBirth">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="gender">
                                        <Form.Label>Gender</Form.Label>
                                        <br/>
                                        <select required defaultValue={'DEFAULT'} name="gender" onChange={this.onChangeEmployeeGender}>
                                            <option value="DEFAULT" hidden>Select gender</option>
                                            <option value="nam">Nam</option>
                                            <option value="Nu">Nu</option>
                                            <option value="Khac">Khac</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="gender">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này  </FieldFeedback>
                                    </FieldFeedbacks>
                                    <Form.Group controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" value={this.state.address}  required name="address" onChange={this.onChangeEmployeeAddress}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="address">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="level">
                                        <Form.Label>Level</Form.Label>
                                        <br/>
                                        <select  defaultValue={'DEFAULT'} name="level" required onChange={this.onChangeEmployeeLevel}>
                                            <option value="DEFAULT" hidden>Select level</option>
                                            <option value="Dai hoc">Dai hoc</option>
                                            <option value="Trung cap">Trung cap</option>
                                            <option value="Khac">Khac</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="level">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này  </FieldFeedback>
                                    </FieldFeedbacks>
                                    <Form.Group controlId="yearOfEx">
                                        <Form.Label>Year Of Ex</Form.Label>
                                        <Form.Control  type="number" value={this.state.yearOfEx} required name="yearOfEx" onChange={this.onChangeEmployeeYearOfEx}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="yearOfEx">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="position">
                                        <Form.Label>Position</Form.Label>
                                        <br/>
                                        <select required defaultValue={'DEFAULT'} name="position" onChange={this.onChangeEmployeePosition}>
                                            <option value="DEFAULT" hidden>Select Position</option>
                                            <option value="Nhan vien tiep tan">Nhan vien tiep tan</option>
                                            <option value="Nhan vien ke toan">Nhan vien ke toan</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="position">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này </FieldFeedback>
                                    </FieldFeedbacks>
                                </FormWithConstraints>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.addEmployee.bind(this)}>Add employee</Button>{' '}
                                <Button color="secondary" onClick={this.toggleNewEmployeeModal.bind(this)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>

                        <Modal isOpen={this.state.editEmployeeModal} toggle={this.toggleEditEmployeeModal.bind(this)}>
                            <ModalHeader toggle={this.toggleEditEmployeeModal.bind(this)}>Edit a new employee</ModalHeader>
                            <ModalBody>
                                <FormWithConstraints encType={"multipart/form-data"} method={"post"}
                                        ref={form => this.form = form}
                                        onSubmit={this.updateEmployee.bind(this)}
                                        noValidate>
                                    <Form.Group controlId="image_path">
                                        <Form.Label>Avatar</Form.Label>
                                        <br/>
                                        <div className="imagecontainer">
                                            {$imagePreview}
                                        </div>
                                        <input multiple type="file" accept="image/*"
                                               name='image_path'  onChange={this.onChangeEmployeeImagePath} />

                                    </Form.Group>
                                    <FieldFeedbacks for="image_path">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="name" >
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" value={this.state.name} name="name" pattern=".{5,}"
                                                      onChange={this.onChangeEmployeeName}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="name">
                                        <FieldFeedback when="valueMissing" />
                                        <FieldFeedback when="patternMismatch">
                                            Should be at least 5 characters long
                                        </FieldFeedback>
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="cmt">
                                        <Form.Label>CMT</Form.Label>
                                        <Form.Control type="text"  value={this.state.cmt} name="cmt" onChange={this.onChangeEmployeeCmt}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="cmt">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="dateOfBirth">
                                        <Form.Label>Date Of Birth</Form.Label>
                                        <Form.Control type="date"  value={this.state.dateOfBirth} name="dateOfBirth" onChange={this.onChangeEmployeeDateOfBirth}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="dateOfBirth">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="gender">
                                        <Form.Label>Gender</Form.Label>
                                        <br/>
                                        <select value={this.state.gender} name="gender" onChange={this.onChangeEmployeeGender}>
                                            <option value="DEFAULT" disabled>{this.state.gender}</option>
                                            <option value="nam">Nam</option>
                                            <option value="Nu">Nu</option>
                                            <option value="Khac">Khac</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="gender">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này </FieldFeedback>
                                    </FieldFeedbacks>
                                    <Form.Group controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" value={this.state.address} name="address" onChange={this.onChangeEmployeeAddress}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="address">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="level">
                                        <Form.Label>Level</Form.Label>
                                        <br/>
                                        <select value={this.state.level} name="level" onChange={this.onChangeEmployeeLevel}>
                                            <option value="DEFAULT" hidden>{this.state.level}</option>
                                            <option value="Dai hoc">Dai hoc</option>
                                            <option value="Trung cap">Trung cap</option>
                                            <option value="Khac">Khac</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="level">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này </FieldFeedback>
                                    </FieldFeedbacks>
                                    <Form.Group controlId="yearOfEx">
                                        <Form.Label>Year Of Ex</Form.Label>
                                        <Form.Control  type="number" min="0" value={this.state.yearOfEx} name="yearOfEx" onChange={this.onChangeEmployeeYearOfEx}/>
                                    </Form.Group>
                                    <FieldFeedbacks for="yearOfEx">
                                        <FieldFeedback when="*" />
                                    </FieldFeedbacks>
                                    <Form.Group controlId="position">
                                        <Form.Label>Position</Form.Label>
                                        <br/>
                                        <select  value={this.state.position} name="position" onChange={this.onChangeEmployeePosition}>
                                            <option value="DEFAULT"  disabled>{this.state.position}</option>
                                            <option value="Nhan vien tiep tan">Nhan vien tiep tan</option>
                                            <option value="Nhan vien ke toan">Nhan vien ke toan</option>
                                        </select>
                                    </Form.Group>
                                    <FieldFeedbacks for="position">
                                        <FieldFeedback when="*" />
                                        <FieldFeedback when={value => value === "DEFAULT"}>Hãy chọn trường này </FieldFeedback>
                                    </FieldFeedbacks>
                                </FormWithConstraints>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.updateEmployee.bind(this)}>Edit employee</Button>{' '}
                                <Button color="secondary" onClick={this.toggleEditEmployeeModal.bind(this)}>Cancel</Button>
                            </ModalFooter>
                        </Modal>

                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">

                                    {employees && this.renderEmployeesList()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default connect(
null
)(List);
