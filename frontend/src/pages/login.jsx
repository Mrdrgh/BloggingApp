import React from "react";
import Form from "../components/Form";
import Nav from "./navbar";
export default function Login() {
    return (<>
    <Nav name={'/register'} />
    <Form route={"/api/token/"} method={"login"} />
    </>)
};