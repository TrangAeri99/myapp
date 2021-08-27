import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import cookie from 'js-cookie';
import store from "../store";

function Layout(props) {
    const handleLogout = e => {
      e.preventDefault();
      //cookie.remove('token');
      props.logout();
    };
    return (
            <div>
                {!props.loggedIn ? (
                    <nav className="flex justify-between">
                        <h1 className="py-4 mx-10"><i className="fa fa-home"></i> Bank Management</h1>
                        <div className="flex justify-between">
                            <Fragment>
                                <Link className="m-3 py-1 px-2 bg-purple-700 text-white rounded inline-block" to="/login">
                                    Login
                                </Link>
                                <Link className="m-3 py-1 px-2 bg-purple-700 text-white rounded inline-block" to="/register">
                                    Register
                                </Link>
                            </Fragment>
                        </div>
                    </nav>
                ) : (
                    <div>
                        <nav className="flex justify-between">
                            <h1 className="py-4 mx-10"><i className="fa fa-home"></i> Bank Management</h1>
                            <div className="flex justify-between">
                                {props.user ? (<Link className="m-3 py-1 px-2 bg-purple-700 text-white rounded inline-block" to="/profile">{props.user.name}</Link>)
                                    : (<div></div>)}
                                <Link className="m-3 py-1 px-2 bg-purple-700 text-white rounded inline-block"
                                      to="/logout" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
                {props.children}

            </div>
        );
}

const mapStateToProps = state =>{
    return{
        loggedIn: state.auth.loggedIn,
        user: state.auth.user
    }
};
const mapDispatchToProps = dispatch =>{
    return{
        logout: () => dispatch({type: 'SET_LOGOUT'})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout)
