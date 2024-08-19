import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Error } from "./Error";
import "../styles/Form.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (method !== "login" && password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            
            if (method !== "login") {
                formData.append("email", email);
            }

            const response = await api.post(route, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Invalid credentials. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const loadingBtn = (
        <button className="btn btn-primary w-100" type="button" disabled>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span role="status">Loading...</span>
        </button>
    );

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '95vh', background: 'rgb(184,182,227)', background: 'linear-gradient(90deg, rgba(184,182,227,1) 0%, rgba(176,201,205,1) 52%, rgba(186,195,200,0.895331374737395) 99%)'}}>
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
                <form className="form" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">{method === "login" ? "Login" : "Register"}</h1>
                    {error ? <Error error={error}/> : ''}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            name="username" 
                            required
                        />
                    </div>
                    {method !== "login" && (
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                name="email" 
                                required
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            name="password" 
                            required
                        />
                    </div>
                    {method !== "login" && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="confirmPassword"
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    name="confirmPassword" 
                                    required
                                />
                            </div>
                        </>
                    )}
                    {loading ? loadingBtn : <button type="submit" className="btn btn-primary w-100">Submit</button>}
                    {method === "login" ? (
                        <p className="text-center mt-3 mb-0">
                            Not a user? <a href="/register">Register</a>
                        </p>
                    ) : (
                        <p className="text-center mt-3 mb-0">
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Form;