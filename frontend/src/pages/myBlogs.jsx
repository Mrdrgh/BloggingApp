import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function BlogMiniature(props) {
    const [followed, setFollowed] = useState(false);
    const [redirect, setRedirect] = useState(false); // state to handle redirection

    const handleClick = (id) => {
        props.onFollow(id);
        setFollowed(true);
    }

    const showFollowButton = props.FeaturedPage && !props.isFriend && !followed;

    const handleDivClick = () => {
        setRedirect(true); // set redirect state to true when div is clicked
    }

    if (redirect) {
        return (
            <Navigate 
                to="/blog" 
                state={{
                    'title': props.title,
                    'content': props.content,
                    'author': props.author,
                    'created_at': props.created_at,
                    'isFriend': props.isFriend,
                    'author_id': props.id
                }} 
            />
        );
    }

    return (
        <div className="blogMiniature card mb-3 shadow-sm" onClick={handleDivClick}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h2 className="card-title mb-0">
                        <a href={props.link} style={{ textDecoration: 'none', color: 'inherit' }}>{props.title}</a>
                    </h2>
                    <div className="d-flex align-items-center">
                        <h3 className="card-subtitle text-muted mb-0 me-2">{props.author}</h3>
                        {showFollowButton && 
                            <button 
                                className="btn btn-success rounded-circle" 
                                onClick={(e) => { e.stopPropagation(); handleClick(props.id); }}
                            >
                                +
                            </button>
                        }
                    </div>
                </div>
                <p className="card-text">{props.content.slice(0, 500)}{props.content.length > 500 ? '...' : ''}</p>
                <p className="card-text text-muted"><small>{props.created_at}</small></p>
            </div>
        </div>
    );
}
