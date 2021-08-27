

const AuthReducer = (state={}, actions)=>{
    switch (actions.type) {
        case "SET_LOGIN":
            //return {...state, loggedIn: true, user: actions.payload};
            return {...state, loggedIn: true, token: actions.payload.token, user: actions.payload.user, expires_in: actions.payload.expires_in};
        case "SET_LOGOUT":
            return {...state, loggedIn: false, user: {}, token: null, expires_in: null};
        case "TEST":
            return {...state, test:state.test+1};
        case "UPDATE_USER":
            return {...state, user: actions.payload.user};
        case "GET_USER":
            return {...state, user: actions.payload.user};
        case "GET_DECODE":
            return {...state, exp_token: actions.payload.exp_token, iat_token: actions.payload.iat};
        default:
            return state;
    }
};
export default AuthReducer;