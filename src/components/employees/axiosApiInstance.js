import axios from "axios";
import store from "../../store/index";
//import {useState} from "react";

const axiosApiInstance = axios.create();

//const [errors, setError] = useState({});
axiosApiInstance.interceptors.request.use(config => {
    let token = store.getState().auth.token;
    config.headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    };
    return config;
}, error => {
    //return Promise.reject(error);
    console.log(error);
    return error.response.data;
});
axiosApiInstance.interceptors.response.use(response => {
    return response
}, (error) => {

    let message = "";
    let description = "";

    if (error.response) {
        const origionalRequest = error.config;
        console.log(error.response.status);
        if (error.response.status === 401 && origionalRequest.url === `http://127.0.0.1:8000/api/auth/refresh/`) {
            console.log('Unauthenticated logout');
            store.dispatch({type:"SET_LOGOUT"});
        }

        if (error.response.status === 401 && !origionalRequest._retry) {
            origionalRequest._retry = true;
            //const refreshToken = Cookies.get('refresh');
            //let refreshToken = true;
            //if (refreshToken) {
            return axiosApiInstance.post(`http://127.0.0.1:8000/api/auth/refresh/`)
                .then(response => {
                    const accessToken = response.data.access_token;
                    console.log(accessToken);
                    console.log(response.data.user);

                    store.dispatch({type: "SET_LOGIN", payload: {loggedIn: true, token: response.data.access_token,
                            user: response.data.user, expires_in: response.data.expires_in}});
                    const config = error.config;
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                    return new Promise((resolve, reject) => {
                        axios.request(config).then(res => {
                            resolve(res);
                            //refreshToken= false;
                        }).catch(err => {
                            //reject(err);
                            console.log(err);
                            return error.response.data;
                        })
                    })
                })
                .catch(err => {
                    //return Promise.reject(err);
                    console.log(err);
                })
            //}
        }
        return error.response.data;

        // if (error.response.data) {
        //     //message = error.response.data.code;
        //     //description = error.response.data.message;
        //     setError(error.response.data.errors);
        // }


    }
    //else if (error.request) {
    //     //message = error.status;
    //     description = error.message;
    // } else {
    //     //message = error.status;
    //     description = error.message;
    // }
    // console.log( description);

    //return Promise.reject(error);
});
export {axiosApiInstance};
