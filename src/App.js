import './App.css';
import './css/tailwindcss.css';
import {
    BrowserRouter as Router
} from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import AuthRoute from "./components/AuthRoute";
import Login from "./Login";
import React from "react";
import Profile from "./Profile";
import Register from "./Register";
import Layout from "./components/Layout";
import List from "./components/employees/List";
import DataTable from "./components/employees";
import Data from "./components/employees/index2";
import Form from "./components/employees/Form";

function App() {
  return (
    <Router>
        <Layout>
            <div className=" bg-gray-300 h-screen">
                <GuestRoute path="/login" component={Login}/>
                <AuthRoute path="/profile" component={Profile}/>
                <GuestRoute path="/register" component={Register}/>
                {/*<AuthRoute path="/em" component={DataTable}/>*/}
                {/*<AuthRoute path="/employee" component={List}/>*/}
                <AuthRoute path="/employees" component={Data}/>
            </div>
        </Layout>
    </Router>
  );
}

export default App;
