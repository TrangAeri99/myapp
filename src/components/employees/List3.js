import React from "react";
import {Table, Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import axios from "axios";
import 'bootstrap';
import {Link} from "react-router-dom";
import './app1.css';
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import {FieldFeedback, FieldFeedbacks, FormWithConstraints} from "react-form-with-constraints";
import {connect} from "react-redux";
class List3 extends React.Component {
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
        this.state = {
            employees: [],
            newEmployeeModal: false,
            editEmployeeModal: false,
            name: '', cmt: '', dateOfBirth: '', gender: '', address: '', level: '', yearOfEx: '', position: '', image_path: null

        }
    }

    componentDidMount() {
        this.loadEmployee()
    }

    toggleNewEmployeeModal(){
        this.setState({
            newEmployeeModal: !this.state.newEmployeeModal
        })
    }

    toggleEditEmployeeModal(){
        this.setState({
            editEmployeeModal: !this.state.editEmployeeModal
        })
    }

    addEmployee(){
        const formData = new FormData();
        formData.append('name',this.state.name );
        formData.append('cmt',this.state.cmt );
        formData.append('dateOfBirth',this.state.dateOfBirth );
        formData.append('gender',this.state.gender );
        formData.append('address',this.state.address );
        formData.append('level',this.state.level );
        formData.append('yearOfEx',this.state.yearOfEx );
        formData.append('position',this.state.position );
        if (this.state.image_path instanceof File) formData.append('image_path', this.state.image_path, this.state.image_path.name);

        console.log(formData.get('image_path'));
        axios.post('http://127.0.0.1:8000/api/employees/', formData)
            .then(res =>{
                let {employees} = this.state;
                this.loadEmployee();

                this.setState({
                    employees,
                    newEmployeeModal: false,
                    name: '', cmt: '', dateOfBirth: '', gender:'', address:'',level:'',yearOfEx:'',position:'', image_path:null
                });
                Swal.fire(
                    'Done!',
                    'Employee Added Successfully',
                    'success'
                );
            })
            .catch((error) => {
                console.log(error)
            });
    }

    updateEmployee(){
        const formData = new FormData();
        formData.append('_method','put' );
        formData.append('id',this.state.id);
        formData.append('name',this.state.name );
        formData.append('cmt',this.state.cmt );
        formData.append('dateOfBirth',this.state.dateOfBirth );
        formData.append('gender',this.state.gender );
        formData.append('address',this.state.address );
        formData.append('level',this.state.level );
        formData.append('yearOfEx',this.state.yearOfEx );
        formData.append('position',this.state.position );
        if (this.state.image_path instanceof File) formData.append('image_path', this.state.image_path, this.state.image_path.name);
        console.log('formdata');
        console.log(formData.get('name'));
        axios.post('http://127.0.0.1:8000/api/employees/' + this.state.id, formData)
            .then((res) => {
                console.log(res.data);
                console.log('Employee successfully updated');
                this.loadEmployee();
                this.setState({
                    editEmployeeModal: false,
                    id:'',
                    name: '', cmt: '', dateOfBirth: '', gender:'', address:'',level:'',yearOfEx:'',position:'', image_path:null
                });
                Swal.fire(
                    'Done!',
                    'Employee edit Successfully',
                    'success'
                );
            }).catch((error) => {
            console.log(error)
        });
    }

    editEmployee(id, name, image_path, cmt, dateOfBirth, gender, address, level, yearOfEx, position){
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
        axios.delete('http://127.0.0.1:8000/api/employees/' + id)
            .then((res) => {
                console.log('Employee removed deleted!');
                this.loadEmployee();
            }).catch((error) => {
            console.log(error)
        })
    }

    loadEmployee(){
        axios.get('http://127.0.0.1:8000/api/employees/').then((response) =>{
                this.setState({
                    employees: response.data
                })
            }
        )
    }

    onChangeEmployeeName(e)
    {   console.log(e.target.value);
        this.setState({name: e.target.value})
    }
    onChangeEmployeeCmt(e)
    {
        this.setState({cmt: e.target.value})
    }
    onChangeEmployeeDateOfBirth(e)
    {
        this.setState({dateOfBirth: e.target.value})
    }
    onChangeEmployeeGender(e)
    {
        this.setState({gender: e.target.value})
    }
    onChangeEmployeeAddress(e)
    {
        this.setState({address: e.target.value})
    }
    onChangeEmployeeLevel(e)
    {
        this.setState({level: e.target.value})
    }
    onChangeEmployeeYearOfEx(e)
    {
        this.setState({yearOfEx: e.target.value})
    }
    onChangeEmployeePosition(e)
    {
        this.setState({position: e.target.value})
    }
    onChangeEmployeeImagePath(e)
    {   console.log(e.target.files[0]);
        console.log(e.target.files[0].name);
        this.setState({image_path: e.target.files[0]});
    };

    render() {
        let employees = this.state.employees.map(employee=>{
            return(
                <tr key={employee.id}>
                    <th scope="employee">{employee.id}</th>
                    <td>{employee.name}</td>
                    <td><img className="imagecontainer" src={'storage/'+ employee.image_path} /></td>
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
        });
        return (
            <div className="App container">
                <Button color="primary" onClick={this.toggleNewEmployeeModal.bind(this)}>Add Employee</Button>
                <Modal isOpen={this.state.newEmployeeModal} toggle={this.toggleNewEmployeeModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewEmployeeModal.bind(this)}>Add a new employee</ModalHeader>
                    <ModalBody>
                        <FormWithConstraints encType={"multipart/form-data"} method={"post"}
                            ref={form => this.form = form}
                            onSubmit={this.addEmployee.bind(this)}
                            noValidate>
                            <Form.Group controlId="image_path">
                                <Form.Label>Avatar</Form.Label>
                                <br/>
                                <input multiple type="file" accept="image/*" required
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này  </FieldFeedback>
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này  </FieldFeedback>
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này </FieldFeedback>
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
                                <img className="imagecontainer" src={'storage/'+this.state.image_path}/>
                                <input multiple type="file" accept="image/*"
                                       name='image_path'  onChange={this.onChangeEmployeeImagePath} />
                            </Form.Group>
                            <FieldFeedbacks for="image_path">
                                <FieldFeedback when="*" />
                            </FieldFeedbacks>
                            <Form.Group controlId="name">
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này </FieldFeedback>
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này </FieldFeedback>
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
                                <FieldFeedback when={value => value.length === 0}>Hãy chọn trường này </FieldFeedback>
                            </FieldFeedbacks>
                        </FormWithConstraints>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateEmployee.bind(this)}>Edit employee</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditEmployeeModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
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
                        {employees}
                    </tbody>
                </Table>

            </div>
        )
    }
}
export default connect(
    null
)(List3);

