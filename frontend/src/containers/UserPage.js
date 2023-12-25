import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreatePost from '../components/CreatePost';
import PostsList from '../components/PostsList';
import axios from 'axios';

const UserPage = () => {
    const { userId } = useParams();
    const currentUser = useSelector((state) => state.auth.user);
    const isCurrentUser = currentUser && currentUser.id.toString() === userId;
    const [posts, setPosts] = useState([]); // Initial state is an empty array

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/posts/`);
                console.log("Fetched posts:", response.data); // Add this line to log the response
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userId]);

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div>
            {isCurrentUser && <CreatePost onPostCreated={handlePostCreated} />}
            <PostsList posts={posts} />
        </div>
    );
};

export default UserPage;
