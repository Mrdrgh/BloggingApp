import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import Nav from "./navbar";
import { Alert } from "../components/Error";
//TODO add update and delete blog options
export default function Profile() {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState("");
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const searchInputRef = useRef(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateProfile, setUpdateProfile] = useState({
        profile_picture: null,
        bio: ""
    });
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [blogAction, setBlogAction] = useState("add"); // "add" or "update"
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [newBlog, setNewBlog] = useState({
        title: "",
        content: ""
    });

    const handleRemoveFriend = async (friendId) => {
        try {
            await api.delete(`/api/friendships/delete/${friendId}/`);
            setFriends(friends.filter(friend => friend.id !== friendId));
            setFilteredFriends(filteredFriends.filter(friend => friend.id !== friendId));
        } catch (error) {
            setError("Failed to remove friend: " + error.toString());
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profileRes, friendsRes, blogsRes] = await Promise.all([
                    api.get("/api/profile/"),
                    api.get('/api/friendships/'),
                    api.get('/api/user_blogs/')
                ]);

                setProfile(profileRes.data);
                setFriends(friendsRes.data);
                setFilteredFriends(friendsRes.data);
                setBlogs(blogsRes.data);
            } catch (error) {
                setError(error.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredFriends(
            friends.filter(friend =>
                friend.friend.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, friends]);

    useEffect(() => {
        if (showFriendsModal && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
    }, [showFriendsModal]);



    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        try {
            if (blogAction === "add") {
                const response = await api.post("/api/blogs/", newBlog);
                setBlogs([...blogs, response.data]);
            } else if (blogAction === "update") {
                const response = await api.patch(`/api/blogs/update/${selectedBlog.id}/`, newBlog);
                setBlogs(blogs.map(blog => blog.id === selectedBlog.id ? response.data : blog));
            }
            setShowBlogModal(false);
            setNewBlog({ title: "", content: "" });
            setSelectedBlog(null);
        } catch (error) {
            setError("Failed to " + blogAction + " blog: " + error.toString());
        }
    };

    const handleDeleteBlog = async (blogId) => {
        try {
            await api.delete(`/api/blogs/delete/${blogId}/`);
            setBlogs(blogs.filter(blog => blog.id !== blogId));
        } catch (error) {
            setError("Failed to delete blog: " + error.toString());
        }
    };

    const openUpdateBlogModal = (blog) => {
        setSelectedBlog(blog);
        setNewBlog({ title: blog.title, content: blog.content });
        setBlogAction("update");
        setShowBlogModal(true);
    };

    function BlogModal() {
        return (
            <div className={`modal fade ${showBlogModal ? 'show' : ''}`} style={{display: showBlogModal ? 'block' : 'none'}} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{blogAction === "add" ? "Add New Blog" : "Update Blog"}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowBlogModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleBlogSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="blogTitle" className="form-label">Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="blogTitle" 
                                        value={newBlog.title}
                                        onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="blogContent" className="form-label">Content</label>
                                    <textarea 
                                        className="form-control" 
                                        id="blogContent" 
                                        rows="3"
                                        value={newBlog.content}
                                        onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">{blogAction === "add" ? "Add Blog" : "Update Blog"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in updateProfile) {
            if (updateProfile[key]) {
                formData.append(key, updateProfile[key]);
            }
        }
        try {
            const response = await api.patch("/api/profile/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setProfile(response.data);
            setShowUpdateModal(false);
        } catch (error) {
            setError("Failed to update profile: " + error.toString());
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profile_picture" && files[0]) {
            setUpdateProfile(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setUpdateProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const LoadingTemplate = () => (
        <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your profile...</p>
        </div>
    );



    function UpdateProfileModal() {
        return (
            <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} style={{display: showUpdateModal ? 'block' : 'none'}} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Profile</h5>
                            <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
                                    <input type="file" className="form-control" id="profile_picture" name="profile_picture" onChange={handleUpdateChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea className="form-control" id="bio" name="bio" value={updateProfile.bio} onChange={handleUpdateChange}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    function FriendsModal() {
        return (
        <div className={`modal fade ${showFriendsModal ? 'show' : ''}`} style={{display: showFriendsModal ? 'block' : 'none'}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Friends List ({friends.length})</h5>
                        <button type="button" className="btn-close" onClick={() => setShowFriendsModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search friends..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={(e) => e.target.focus()} // Keep focus on the input
                        />
                        {filteredFriends.map((item) => (
                            <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                <p className="friend-name mb-0">{item.friend}</p>
                                <div className="d-flex">
                                    <button className="btn btn-sm btn-outline-primary me-2">Send Message</button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {handleRemoveFriend(item.id);}}
                                    >
                                        Remove Friend
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        );
    };

    if (loading) return <LoadingTemplate />;

    return (
        <>
        <Nav name={'/profile'} />

{error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

<div className="container mt-4">
    <div className="row">
        {/* User Profile Section */}
        <div className="col-lg-4">
            <div className="profile-section mb-4">
                <div className="profile-pic-container mx-auto mb-3">
                    <img src={profile.profile_picture} className="img-fluid profile-pic" alt="Profile" />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <h1 className="h4 mb-0">{profile.user}</h1>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowUpdateModal(true)}
                        >
                            Update
                        </button>
                    </div>
                </div>
                {
                    profile.bio ? <div className="bio-box shadow-box p-3" style={{marginTop: '100px'}}>
                    <p>{profile.bio}</p>
                </div> : ""
                }
            </div>

            {/* Friends Section */}
            <div className="friends-section">
                <button 
                    className="btn btn-primary mb-3 w-100"
                    onClick={() => setShowFriendsModal(true)}
                >
                    Show Friends ({friends.length})
                </button>
            </div>
        </div>

        {/* Blogs Section */}
        <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="blogs-header">Blogs</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setBlogAction("add");
                        setNewBlog({ title: "", content: "" });
                        setShowBlogModal(true);
                    }}
                >
                    Add New Blog
                </button>
            </div>
            <div className="blogs-container">
                {blogs.length > 0 ? (
                    blogs.map((item) => (
                        <div key={item.id} className="card mb-3 shadow-box">
                            <div className="card-body">
                                <h3 className="card-title blog-title">{item.title}</h3>
                                <p className="card-text">{item.content}</p>
                                <p className="text-muted">{item.created_at}</p>
                                <div className="d-flex justify-content-end">
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => openUpdateBlogModal(item)}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteBlog(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : <Alert error={"no blogs to show"} /> }
            </div>
        </div>
    </div>
</div>

{FriendsModal()}
{UpdateProfileModal()}
{BlogModal()}


            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Playfair+Display:wght@700&display=swap');

                .profile-pic-container {
                    width: 150px;
                    height: 150px;
                }

                .profile-pic {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .bio-box {
                    border: 2px solid #ddd;
                    border-radius: 10px;
                }

                .shadow-box {
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    transition: box-shadow 0.3s ease-in-out;
                }

                .shadow-box:hover {
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
                }

                .blogs-header {
                    font-family: 'Poppins', serif;
                    font-size: 2.5rem;
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .blogs-container {
                    max-height: 600px;
                    overflow-y: auto;
                    padding-right: 15px;
                }

                .blog-title {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 1.5rem;
                }

                .friend-name {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 1.2rem;
                }

                .btn-outline-primary, .btn-outline-danger {
                    font-family: 'Poppins', sans-serif;
                    font-size: 0.8rem;
                    padding: 0.25rem 0.5rem;
                }

                .modal {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .modal.fade .modal-dialog {
                    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
                    transform: scale(0.9);
                    opacity: 0;
                }

                .modal.show .modal-dialog {
                    transform: scale(1);
                    opacity: 1;
                }
                `}
            </style>
        </>
    );
}