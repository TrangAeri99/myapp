import React, { useEffect, useState, useMemo, useRef } from "react";
import { TableHeader, Pagination, Search } from "./DataTable";
import useFullPageLoader from "./useFullPageLoader";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { Table } from 'reactstrap';
import Swal from "sweetalert2";
import {
    Async,
    FieldFeedback,
    FieldFeedbacks,
    FormWithConstraints,
    Input
} from 'react-form-with-constraints-bootstrap';
import Error from "../Error";
import {TextValidator, ValidatorForm, SelectValidator} from "react-material-ui-form-validator";
import {axiosApiInstance} from "../employees/axiosApiInstance";
import useForm from "../useForm";
import validate from "../AddFormValidationRules";
import classNames from "classnames";

const Data = (props) => {
    const [employees, setEmployees] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [image_path, setImagePath] = useState(null);
    const [cmt, setCmt] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [level, setLevel] = useState('');
    const [yearOfEx, setYearOfEx] = useState('');
    const [position, setPosition] = useState('');
    //const [imagePreviewUrl, setImagePreviewUrl]= useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [newEmployeeModal, setNewEmployeeModal] = useState(false);
    const [editEmployeeModal, setEditEmployeeModal] = useState(false);
    const [errors, setError] = useState({});
    const [errorsEdit, setErrorEdit] = useState({});
    const [errorName, setErrorName] = useState(null);
    const [errorCmt, setErrorCmt] = useState(null);
    const ITEMS_PER_PAGE = 3;
    const [token, setToken] = useState(props.token);
    const form = useRef(null);
    const [isAdd, setIsAdd] = useState(false);

    const headers = [
        { name: "Id", field: "id", sortable: false },
        { name: "Name", field: "name", sortable: true },
        { name: "Avatar", field: "image_path", sortable: false },
        { name: "CMT", field: "cmt", sortable: false },
        { name: "Date Of Birth", field: "dateOfBirth", sortable: false },
        { name: "Gender", field: "gender", sortable: false },
        { name: "Address", field: "address", sortable: false },
        { name: "Level", field: "level", sortable: false },
        { name: "YearOfEx", field: "yearOfEx", sortable: false },
        { name: "Position", field: "position", sortable: true }
    ];

    const {
        imagePreviewUrl,
        values,
        errorss,
        handleChange,
        handleSubmit
    } = useForm(addEmployee, isAdd, validate);

    const getData = () => {
        showLoader();
        console.log(token);
        axiosApiInstance.get("http://127.0.0.1:8000/api/employees/")
            .then(res => {
                console.log(res.data);
                hideLoader();
                setEmployees(res.data);
            })
            .catch(e =>{ console.log(e.response.data.errors)});
        // fetch("http://127.0.0.1:8000/api/employees/")
        //     .then(response => response.json())
        //     .then(json => {
        //         hideLoader();
        //         setEmployees(json);
        //         console.log(json);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     })
    };

    useEffect(() => {
        getData();
    }, []);

    const employeesData = useMemo(() => {
        let computedEmployees = employees;

        if (search) {
            computedEmployees = computedEmployees.filter(
                employee =>
                    employee.name.toLowerCase().includes(search.toLowerCase()) ||
                    employee.position.toLowerCase().includes(search.toLowerCase())
            );
        }

        console.log(totalItems);
        console.log(sorting.field);
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedEmployees = computedEmployees.sort(
                   (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        setTotalItems(computedEmployees.length);
        return computedEmployees.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [employees, currentPage, search, sorting, totalItems]);

    useEffect(() => {
        ValidatorForm.addValidationRule('isExist', (value) => {
            if (value.length !== 0) {
                return true;
            }
            return false;
        });
    }, [ValidatorForm]);

    // function onCancelAdd () {
    //     setNewEmployeeModal(false);
    //     setError({});
    // }

    // const onChangeEmployeeImagePath = (e) => {
    //     //console.log(e.target.files[0].name);
    //     //this.setState({image_path: e.target.files[0]});
    //     e.preventDefault();
    //
    //     let reader = new FileReader();
    //     let image_path = e.target.files[0];
    //
    //     reader.onloadend = () => {
    //         setImagePreviewUrl(reader.result);
    //     };
    //     setImagePath(e.target.files[0]);
    //
    //     reader.readAsDataURL(image_path);
    // };

    const deleteEmployee = (id) => {
        setId(id);
        axiosApiInstance.delete('http://127.0.0.1:8000/api/employees/' + id)
            .then((res) => {
                console.log('Employee removed deleted!');
                getData();
            }).catch((error) => {
            console.log(error)
        })
    };

    const toggleEditEmployeeModal= () => {
            setEditEmployeeModal(!editEmployeeModal);
    };

    const toggleNewEmployeeModal= () =>{
        setNewEmployeeModal(!newEmployeeModal);
        if(!newEmployeeModal){
            setName('');
            setImagePath(null);
            setCmt('');
            setDateOfBirth('');
            setGender('');
            setAddress('');
            setLevel('');
            setYearOfEx('');
            setPosition('');
            setImagePath(null);
            //setImagePreviewUrl(null);
        }

    };

    const editEmployee = (id, name, image_path, cmt, dateOfBirth, gender, address, level, yearOfEx, position) => {
        setId(id);
        setName(name);
        setImagePath(image_path);
        setCmt(cmt);
        setDateOfBirth(dateOfBirth);
        setGender(gender);
        setAddress(address);
        setLevel(level);
        setYearOfEx(yearOfEx);
        setPosition(position);
        setEditEmployeeModal(!editEmployeeModal);
        console.log(editEmployeeModal)
    };

    const updateEmployee = () => {
        console.log('update');
        const formData = new FormData();

        formData.append('_method', 'put');
        formData.append('id', id);
        formData.append('name', name);
        formData.append('cmt', cmt);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('gender', gender);
        formData.append('address', address);
        formData.append('level', level);
        formData.append('yearOfEx', yearOfEx);
        formData.append('position', position);
        if (image_path instanceof File) formData.append('image_path', image_path);
        console.log('formdata');
        console.log(formData.get('image_path'));
        console.log(formData.get('name'));
        axiosApiInstance.post('http://127.0.0.1:8000/api/employees/' + id, formData)
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    console.log('Employee successfully updated');
                    setEditEmployeeModal(false);
                    setErrorEdit({});
                    Swal.fire(
                        'Done!',
                        'Employee edit Successfully',
                        'success'
                    );
                    getData();
                } else{
                    setErrorEdit(res.errors);
                }
            }).catch((e) => {
            console.log(e);
            setErrorEdit(e.errors);
        });

    };

    function addEmployee (){
        const formData = new FormData();
        //formData.append('id', id);
        formData.append('name', values.name);
        formData.append('cmt', values.cmt);
        formData.append('dateOfBirth', values.dateOfBirth);
        formData.append('gender', values.gender);
        formData.append('address', values.address);
        formData.append('level', values.level);
        formData.append('yearOfEx', values.yearOfEx);
        formData.append('position', values.position);
        if (values.image_path instanceof File) formData.append('image_path', values.image_path);
        console.log('formdata');
        console.log(formData.get('image_path'));
        console.log(formData.get('name'));
        //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axiosApiInstance.post('http://127.0.0.1:8000/api/employees/', formData)
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    console.log('Employee successfully added');
                    setNewEmployeeModal(false);
                    setError({});
                    setIsAdd(true);
                    Swal.fire(
                        'Done!',
                        'Employee add Successfully',
                        'success'
                    );
                    getData();
                } else {
                    setError(res.errors);
                }
            }).catch((e) => {
            console.log(e);
            //setError(e.response.data.errors);
            setError(e.errors);
        });
    }

    let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} alt=""/>);
    } else {
        $imagePreview = (<img src={'http://127.0.0.1:8000/storage/'+ image_path} alt=""/>);
    }

    return (
        <>
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
                    </ul>
                </aside>
                <section className="w-5/6 m-2 bg-white flex justify-center">
                    <div className="row w-100">
                        <div className="col mb-3 col-12 text-center">
                            <div className="row">
                                <div className="col-md-6 d-flex flex-row-reverse py-3 ">
                                    <Search
                                        onSearch={value => {
                                            setSearch(value);
                                           setCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex flex-row-reverse py-3 ">
                                    <Button color="primary" onClick={()=> toggleNewEmployeeModal() }><i className="fa fa-plus"></i>Add Employee</Button>
                                </div>
                        </div>

                            <Modal isOpen={newEmployeeModal} toggle={toggleNewEmployeeModal}>
                                <ModalHeader toggle={toggleNewEmployeeModal}>Add</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleSubmit} noValidate encType={"multipart/form-data"} method={"post"}>
                                        <div className="imagecontainer">
                                            {$imagePreview}
                                        </div>
                                        <input multiple type="file" accept="image/*" required
                                               name='image_path'  onChange={handleChange} />
                                        {errorss.image_path && (
                                            <p className="help is-danger text-red-600">{errorss.image_path}</p>
                                        )}
                                        {/*<Error error={errors['image_path'] ? errors['image_path'] : null}/>*/}
                                        <div className="field">
                                            <label className="label">Name</label>
                                            <div className="control">
                                                <input autoComplete="off" className={classNames('border w-100 p-1',`input ${errorss.name && 'is-danger'}`)} type="text" value={values.name || ''} name="name" onChange={handleChange} required/>
                                                {errorss.name && (
                                                    <p className="help is-danger text-red-600">{errorss.name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Cmt</label>
                                            <div className="control">
                                                <input autoComplete="off" className={classNames('border w-100 p-1',`input ${errorss.cmt && 'is-danger'}`)} type="text" value={values.cmt || ''} name="cmt" onChange={handleChange} required/>
                                                {errorss.cmt && (
                                                    <p className="help is-danger text-red-600">{errorss.cmt}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Date of Birth</label>
                                            <div className="control">
                                                <input autoComplete="off" className={classNames('border w-100 p-1',`input ${errorss.dateOfBirth && 'is-danger'}`)} type="date" value={values.dateOfBirth || ''} name="dateOfBirth" onChange={handleChange} required/>
                                                {errorss.dateOfBirth && (
                                                    <p className="help is-danger text-red-600">{errorss.dateOfBirth}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Gender</label>
                                            <div className="control">
                                                <select className="border" required defaultValue={'DEFAULT'} name="gender" onChange={handleChange}>
                                                    <option value="DEFAULT" hidden>Select gender</option>
                                                    <option value="nam">Nam</option>
                                                    <option value="Nu">Nu</option>
                                                    <option value="Khac">Khac</option>
                                                </select>
                                                {errorss.gender && (
                                                    <p className="help is-danger text-red-600">{errorss.gender}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Address</label>
                                            <div className="control">
                                                <input autoComplete="off" className={classNames('border w-100 p-1',`input ${errorss.address && 'is-danger'}`)} type="text" value={values.address || ''} name="address" onChange={handleChange} required/>
                                                {errorss.address && (
                                                    <p className="help is-danger text-red-600">{errorss.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Level</label>
                                            <div className="control">
                                                <select className="border" value={values.level} name="level" onChange={handleChange} required>
                                                    <option value="DEFAULT" hidden>Select Level</option>
                                                    <option value="Dai hoc">Dai hoc</option>
                                                    <option value="Trung cap">Trung cap</option>
                                                    <option value="Khac">Khac</option>
                                                </select>
                                            </div>
                                            {errorss.level && (
                                                <p className="help is-danger text-red-600">{errorss.level}</p>
                                            )}
                                        </div>
                                        <div className="field">
                                            <label className="label">Year Of Ex</label>
                                            <div className="control">
                                                <input autoComplete="off" min="0" step="0.5" className={classNames('border w-100 p-1',`input ${errorss.yearOfEx && 'is-danger'}`)} type="number" name="yearOfEx" onChange={handleChange} value={values.yearOfEx || ''} required />
                                                {errorss.yearOfEx && (
                                                    <p className="help is-danger text-red-600">{errorss.yearOfEx}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label className="label">Position</label>
                                            <div className="control">
                                                <select required className="border" defaultValue={'DEFAULT'} name="position" onChange={handleChange}>
                                                    <option value="DEFAULT" hidden>Select Position</option>
                                                    <option value="Nhan vien tiep tan">Nhan vien tiep tan</option>
                                                    <option value="Nhan vien ke toan">Nhan vien ke toan</option>
                                                </select>
                                            </div>
                                            {errorss.position && (
                                                <p className="help is-danger text-red-600">{errorss.position}</p>
                                            )}
                                        </div>
                                        <Button type="submit" color="primary" >Add employee</Button>{' '}
                                        <Button type="submit" color="secondary" onClick={()=> {setNewEmployeeModal(false);; setIsAdd(false);}}>Cancel</Button>
                                    </form>

                                </ModalBody>
                            </Modal>

                            <Modal isOpen={editEmployeeModal} toggle={toggleEditEmployeeModal}>
                                <ModalHeader toggle={toggleEditEmployeeModal}>Edit employee</ModalHeader>
                                <ModalBody>
                                    <FormWithConstraints encType={"multipart/form-data"} method={"post"}
                                                         //ref={form}
                                                         onSubmit={updateEmployee}
                                                         noValidate>
                                        <Form.Group controlId="image_path">
                                            <Form.Label>Avatar</Form.Label>
                                            <br/>
                                            <div className="imagecontainer">
                                                {$imagePreview}
                                            </div>
                                            <input multiple type="file" accept="image/*"
                                                   name='image_path'   />
                                        </Form.Group>

                                        <Form.Group controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" value={name} name="name" pattern=".{5,}"
                                                          onChange={e => setName(e.target.value)}/>
                                        </Form.Group>
                                        <Error error={errorsEdit['name'] ? errorsEdit['name'] : null}/>

                                        <Form.Group controlId="cmt">
                                            <Form.Label>CMT</Form.Label>
                                            <Form.Control type="text"  value={cmt} name="cmt" onChange={e => setCmt(e.target.value)}/>
                                        </Form.Group>
                                        <Error error={errorsEdit['cmt'] ? errorsEdit['cmt'] : null}/>

                                        <Form.Group controlId="dateOfBirth">
                                            <Form.Label>Date Of Birth</Form.Label>
                                            <Form.Control type="date"  value={dateOfBirth} name="dateOfBirth" onChange={e => e.target.value}/>
                                        </Form.Group>
                                        <Error error={errorsEdit['dateOfBirth'] ? errorsEdit['dateOfBirth'] : null}/>

                                        <Form.Group controlId="gender">
                                            <Form.Label>Gender</Form.Label>
                                            <br/>
                                            <select value={gender} name="gender" onChange={e => setGender(e.target.value)}>
                                                {/*<option value="DEFAULT" disabled>{gender}</option>*/}
                                                <option value="nam">Nam</option>
                                                <option value="Nu">Nu</option>
                                                <option value="Khac">Khac</option>
                                            </select>
                                        </Form.Group>
                                        <Error error={errorsEdit['gender'] ? errorsEdit['gender'] : null}/>

                                        <Form.Group controlId="address">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" value={address} name="address" onChange={e => setAddress(e.target.value)}/>
                                        </Form.Group>
                                        <Error error={errorsEdit['address'] ? errorsEdit['address'] : null}/>
                                        <Form.Group controlId="level">
                                            <Form.Label>Level</Form.Label>
                                            <br/>
                                            <select value={level} name="level" onChange={e => setLevel(e.target.value)}>
                                                <option value="DEFAULT" hidden>{level}</option>
                                                <option value="Dai hoc">Dai hoc</option>
                                                <option value="Trung cap">Trung cap</option>
                                                <option value="Khac">Khac</option>
                                            </select>
                                        </Form.Group>
                                        <Error error={errorsEdit['level'] ? errorsEdit['level'] : null}/>
                                        <Form.Group controlId="yearOfEx">
                                            <Form.Label>Year Of Ex</Form.Label>
                                            <Form.Control  type="number" min="0" step="0.5" value={yearOfEx} name="yearOfEx" onChange={e => setYearOfEx(e.target.value)}/>
                                        </Form.Group>
                                        <Error error={errorsEdit['yearOfEx'] ? errorsEdit['yearOfEx'] : null}/>
                                        <Form.Group controlId="position">
                                            <Form.Label>Position</Form.Label>
                                            <br/>
                                            <select  defaultValue={position} name="position" onChange={e => setPosition(e.target.value)}>
                                                <option value="DEFAULT"  disabled>{position}</option>
                                                <option value="Nhan vien tiep tan">Nhan vien tiep tan</option>
                                                <option value="Nhan vien ke toan">Nhan vien ke toan</option>
                                            </select>
                                        </Form.Group>
                                        <Error error={errorsEdit['position'] ? errorsEdit['position'] : null}/>
                                    </FormWithConstraints>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={()=>updateEmployee()}>Edit employee</Button>{' '}
                                    <Button color="secondary" onClick={()=> {setEditEmployeeModal(false); setErrorEdit({});}}>Cancel</Button>
                                </ModalFooter>
                            </Modal>

                            <Table className="table table-striped">
                                <TableHeader
                                    headers={headers}
                                    onSorting={(field, order) =>
                                        setSorting({ field, order })
                                    }
                                />
                                <tbody>
                                {employeesData.map((employee) => {
                                    return (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td><img className="imagecontainer" src={'http://127.0.0.1:8000/storage/'+ employee.image_path} /></td>
                                            <td>{employee.cmt}</td>
                                            <td>{employee.dateOfBirth}</td>
                                            <td>{employee.gender}</td>
                                            <td>{employee.address}</td>
                                            <td>{employee.level}</td>
                                            <td>{employee.yearOfEx}</td>
                                            <td>{employee.position}</td>
                                            <td>
                                                <Button size="sm" variant="info" onClick={() => editEmployee(employee.id, employee.name,employee.image_path,employee.cmt,
                                                    employee.dateOfBirth,employee.gender, employee.address, employee.level, employee.yearOfEx, employee.position)}>
                                                    <i className="fa fa-edit"></i></Button>
                                            </td>
                                            <td>
                                                <Button color="danger" size="sm" onClick={() => {if(window.confirm('Delete the employee?')) {deleteEmployee(employee.id)}}}><i className="fa fa-trash"></i></Button>
                                            </td>

                                        </tr>
                                    )
                                })
                                }
                                </tbody>
                            </Table>
                            <div className="col-md-6">
                                <Pagination
                                    total={totalItems}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    currentPage={currentPage}
                                    onPageChange={page => setCurrentPage(page)}
                                />
                            </div>
                            {loader}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
const mapStateToProps = state =>{
    return{
        loggedIn: state.auth.loggedIn,
        token: state.auth.token
    }
};
export default connect(
    mapStateToProps
)(Data);

