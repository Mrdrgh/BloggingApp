import React, { useEffect, useState } from "react";
import Nav from "./navbar";
import api from "../api";
import BlogMiniature from "./myBlogs";
import { Error, Success } from "../components/Error";

export default function Home() {
    const [blogs, setBlogs] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState("")
    const [user, setUser] = useState({})
    const [activeTab, setActiveTab] = useState('featured')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [friendIds, setFriendIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                await getBlogs();
                await getUserProfile();
                await getFriendIds();
            } catch (error) {
                setError(error.toString());
            }
        }
        fetchData();
    }, [activeTab, page]);

    const getBlogs = async () => {
        try {
            let res;
            if (activeTab === 'featured') {
                res = await api.get(`/api/featured-blogs/?page=${page}`)
            } else {
                res = await api.get('/api/blogs/')
            }
            const data = res.data
            if (activeTab === 'featured') {
                setBlogs(prevBlogs => page === 1 ? data.results : [...prevBlogs, ...data.results])
                setHasMore(data.next !== null)
            } else {
                setBlogs(data)
            }
        } catch (error) {
            setError(error);
        }
    };

    const getUserProfile = async () => {
        try {
            const res = await api.get('/api/profile/')
            setUser(res.data)
        } catch (error) {
            setError(error);
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setPage(1)
    }

    const loadMore = () => {
        setPage(prevPage => prevPage + 1)
    }
    const getFriendIds = async () => {
        try {
            const res = await api.get('/api/friendships/');
            setFriendIds(res.data.map(friendship => friendship.friend));
        } catch (error) {
            setError(error.toString());
        }
    };

    const handleFollow = async (id) => {
        try {
            const response = await api.post(`/api/friendships/${id}/`);
            if (response.status === 201) {
                setFriendIds([...friendIds, id]);
                setSuccess("Successfully followed!");
                setShowModal(true);
            } else {
                setError(response.data.detail || "An error occurred while following the user.");
            }
        } catch (error) {
            setError(error.response?.data?.detail || error.toString());
        }
    };
    return (<> 
        <Nav name='/home'
            profile_picture={user.profile_picture}
            username={user.user} 
            email={user.email}
        />
        {error && <Error error={error} />}
        {success && <Success error={success}/>}
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <ul className="nav nav-pills nav-fill mb-4">
                        <li className="nav-item">
                            <button 
                                onClick={() => handleTabChange('featured')} 
                                className={`nav-link ${activeTab === 'featured' ? 'active' : ''}`}
                            >
                                Featured
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                onClick={() => handleTabChange('following')} 
                                className={`nav-link ${activeTab === 'following' ? 'active' : ''}`}
                            >
                                Following
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {blogs.map((blog) => (
            <BlogMiniature
                key={blog.id}
                title={blog.title}
                author={blog.author_username}
                content={blog.content}
                created_at={blog.created_at}
                id={blog.author}
                FeaturedPage={activeTab === 'featured'}
                isFriend={friendIds.includes(blog.author_username) || blog.author_username == user.user}
                onFollow={handleFollow}
            />
        ))}

        {activeTab == 'featured' && hasMore && (
            <button onClick={loadMore}>Load More</button>
        )}
    </>)
};