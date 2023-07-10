import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { withRouter } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './Blog.css'; // Import the CSS file for styling

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormTitle, setCreateFormTitle] = useState('');
    const [createFormContent, setCreateFormContent] = useState('');
    //   const history = useHistory();

    useEffect(() => {
        const fetchBlogPosts = async () => {
            const accessToken = localStorage.getItem('access_token');
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };

            try {
                const response = await axios.get('http://127.0.0.1:8000/blog/blogposts/', config);
                setBlogPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogPosts();
    }, []);

    const getUserIdFromToken = () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            const payload = accessToken.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.user_id;
        }
        return null;
    };

    const openUpdateDialog = (post) => {
        setSelectedPost(post);
        setUpdateTitle(post.title);
        setUpdateContent(post.content);
    };

    const closeUpdateDialog = () => {
        setSelectedPost(null);
        setUpdateTitle('');
        setUpdateContent('');
    };

    const handleUpdate = async () => {
        const accessToken = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const payload = {
            id: selectedPost.id,
            title: updateTitle,
            content: updateContent
        };

        try {
            await axios.put(`http://127.0.0.1:8000/blog/blogposts/${selectedPost.id}/`, payload, config);
            closeUpdateDialog();
            window.location.reload(); // Reload the page after successful update
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (postId) => {
        const accessToken = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        try {
            await axios.delete(`http://127.0.0.1:8000/blog/blogposts/${postId}/`, config);
            window.location.reload(); // Reload the page after successful deletion
        } catch (error) {
            console.error(error);
        }
    };

    const openCreateForm = () => {
        setShowCreateForm(true);
    };

    const closeCreateForm = () => {
        setShowCreateForm(false);
        setCreateFormTitle('');
        setCreateFormContent('');
    };

    const handleCreate = async () => {
        const accessToken = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const payload = {
            title: createFormTitle,
            content: createFormContent
        };

        try {
            await axios.post('http://127.0.0.1:8000/blog/blogposts/', payload, config);
            closeCreateForm();
            window.location.reload(); // Reload the page after successful creation
        } catch (error) {
            console.error(error);
        }
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const payload = {
            refresh: refreshToken
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/logout/', payload, config);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
          } catch (error) {
            console.error(error);
          }
        };

    return (
        <div>
            <h1 className="blog-title">Blog Posts</h1>
            <div className="logout-button-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="create-button-container">
                <button className="create-button" onClick={openCreateForm}>Create Post</button>
            </div>
            <table className="blog-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr></thead>
                <tbody>
                    {blogPosts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                            <td>{post.created_at}</td>
                            <td>
                                {post.author === getUserIdFromToken() && (
                                    <button className="update-button" onClick={() => openUpdateDialog(post)}>Update</button>
                                )}
                                {post.author === getUserIdFromToken() && (
                                    <button className="delete-button" onClick={() => handleDelete(post.id)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedPost && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Post</h2>
                        <div>
                            <label>Title:</label>
                            <input type="text" value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} />
                        </div>
                        <div>
                            <label>Content:</label>
                            <textarea value={updateContent} onChange={e => setUpdateContent(e.target.value)}></textarea>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleUpdate}>Update</button>
                            <button onClick={closeUpdateDialog}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showCreateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create Post</h2>
                        <div>
                            <label>Title:</label>
                            <input type="text" value={createFormTitle} onChange={e => setCreateFormTitle(e.target.value)} />
                        </div>
                        <div>
                            <label>Content:</label>
                            <textarea value={createFormContent} onChange={e => setCreateFormContent(e.target.value)}></textarea>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleCreate}>Save</button>
                            <button onClick={closeCreateForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;
