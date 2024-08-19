import React, { useState } from "react";
import { Success, Error } from "../components/Error";
import Nav from "./navbar";
import api from "../api";

export default function Blog({ title, content, author, created_at, isFriend, author_id }) {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [is_friend, setIsfriend] = useState(isFriend)
    const handleFollow = async (id) => {
        try {
            const response = await api.post(`/api/friendships/${id}/`);
            console.log("got into the try block")
            if (response.status === 201) {
                setSuccess("Successfully followed!");
            } else {
                setError(response.data.detail || "An error occurred while following the user.");
            }
        } catch (error) {
            setError(error.response?.data?.detail || error.toString());
        } finally {
            setIsfriend(!is_friend);
        }
    };

    return (
        <>
            <Nav name='/home' />
            <div className="container mt-4 p-3">
                {success && <Success error={success} />}
                {error && <Error error={error} />}
                <div className="infosdiv row align-items-center">
                    <div className="col-md-8">
                        <h1 className="title">{title}</h1>
                        <span className="text-muted">{created_at}</span>
                    </div>
                    <div className="col-md-4 text-end">
                        <span className="author fw-bold">{author}</span>
                        {!is_friend && (
                            <button className="btn btn-primary ms-2" onClick={() => handleFollow(author_id)}>
                                +
                            </button>
                        )}
                    </div>
                </div>
                <div className="contentdiv p-3 mt-3 bg-light rounded shadow-sm hover-effect">
                    {content}
                </div>
            </div>
        </>
    );
}
