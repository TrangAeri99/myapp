import axios from "axios";
import store from '../../store/index';

const axiosApiInstance = axios.create();
axiosApiInstance.interceptors.request.use(
    async config => {
        store.subscribe(()=> {
            let token = store.getState().auth.token;
            console.log(token);
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded'
            };

            return config;
        })
    },
    error => {
        //Promise.reject(error)
        console.log(error)
    });

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        //const access_token = await refreshAccessToken();
        axios.post(`http://127.0.0.1:8000/api/auth/refresh/`)
            .then(response => {
                const accessToken = response.data.access_token;
                console.log(accessToken);
                console.log(response.data.user);

                store.dispatch({
                    type: "SET_LOGIN", payload: {
                        loggedIn: true, token: response.data.access_token,
                        user: response.data.user, expires_in: response.data.expires_in
                    }
                });
           // });
                //const config = error.config;
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                return axiosApiInstance(originalRequest);
            });
    }
    //return Promise.reject(error);
    console.log(error);
});

export {axiosApiInstance};
