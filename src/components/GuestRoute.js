import {Route, Redirect} from 'react-router-dom';
import React from "react";
//import cookie from "js-cookie";
import {connect} from "react-redux";

const GuestRoute = ({ component: Component, ...rest }) => {
    //const token = cookie.get('token');

    return (
        <Route
            {...rest}
            render={ props =>
                !rest.loggedIn ? (
                    <Component {...props}/>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/profile",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};
const mapStateToProps = state =>{
    return{
        loggedIn: state.auth.loggedIn
    }
};

export default connect(mapStateToProps)(GuestRoute)