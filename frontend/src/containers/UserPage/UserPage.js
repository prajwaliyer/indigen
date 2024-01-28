import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreatePost from '../../components/CreatePost';
import PostsList from '../../components/PostsList';
import axios from 'axios';

const UserPage = () => {
    
    const navigate = useNavigate();

    const { userId } = useParams();
    const currentUser = useSelector((state) => state.auth.user);
    const isCurrentUser = currentUser && currentUser.id.toString() === userId;
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/users/${userId}/posts/`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchFollowData = async () => {
        const followersResponse = await axios.get(`http://localhost:8000/users/${userId}/followers/`);
        setFollowers(followersResponse.data);
        setIsFollowing(followersResponse.data.some(follower => follower.id === currentUser?.id));

        const followingResponse = await axios.get(`http://localhost:8000/users/${userId}/following/`);
        setFollowing(followingResponse.data);
    };

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    useEffect(() => {
        fetchFollowData();
    }, [userId, currentUser]);

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleFollow = async () => {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        
        if (isFollowing) {
            await axios.post(`http://localhost:8000/users/${userId}/unfollow/`, {}, config);
        } else {
            await axios.post(`http://localhost:8000/users/${userId}/follow/`, {}, config);
        }
        setIsFollowing(!isFollowing);
        await fetchFollowData();
    };

    return (
        <div>
            <h2>User Page</h2>

            <div>
                <p style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(`/users/${userId}/followers`)}>
                    {followers.length} Followers
                </p>
                <p style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(`/users/${userId}/following`)}>
                    {following.length} Following
                </p>
            </div>
            
            {!isCurrentUser && (
                <button onClick={handleFollow}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            )}

            {isCurrentUser && <CreatePost onPostCreated={handlePostCreated} />}
            <PostsList posts={posts} />

        </div>
    );
};

export default UserPage;
