import React from "react";
import Form from "../components/Form";
import Nav from "./navbar";
export default function Register() {
    return (<>
    <Nav name={['login']} />
    <Form route={"/api/user/register/"} method={"register"} />
    </>)
};