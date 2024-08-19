import React from "react";

export default function Nav(props) {
    const page_not_auth = ['/login', '/register'];
    const page_auth = ['/profile', '/logout', '/', '/home'];

    const is_auth = page_auth.includes(props.name);

    return (
        <div style={{boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'}}>
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src="/b(2)-vmake.png" alt="Flowbite Logo" width="38" height="38" className="d-inline-block align-text-top me-2" />
                        <span className="fs-4 fw-semibold">Blogging</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {is_auth && (
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/home">Home</a>
                                </li>
                            )}
                            {!is_auth && props.name === '/register' && (
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">Register</a>
                                </li>
                            )}
                            <li className="nav-item">
                                <a className="nav-link" href="https://github.com/Mrdrgh/Django_Pjs/tree/main/Blogging" target="blanc">Source Code</a>
                            </li>
                        </ul>
                        
                        {is_auth && (
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={props.profile_picture} alt="Profile" className="rounded-circle" width="40" height="40" />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="/profile">{props.username}</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="/logout">Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}