import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import VideoCard from '../VideoCard/VideoCard';
import styles from './UserPage.module.scss';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

const UserPage = () => {
    
    const navigate = useNavigate();

    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({ first_name: '', last_name: '' });
    const currentUser = useSelector((state) => state.auth.user);
    const isCurrentUser = currentUser && currentUser.id.toString() === userId;
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/posts/`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchFollowData = async () => {
        const followersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/followers/`);
        setFollowers(followersResponse.data);
        setIsFollowing(followersResponse.data.some(follower => follower.id === currentUser?.id));

        const followingResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/following/`);
        setFollowing(followingResponse.data);
    };

    useEffect(() => {
        fetchUserDetails();
        fetchPosts();
        fetchFollowData();
    }, [userId]);

    const handleFollow = async () => {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        
        if (isFollowing) {
            await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/unfollow/`, {}, config);
        } else {
            await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/follow/`, {}, config);
        }
        setIsFollowing(!isFollowing);
        await fetchFollowData();
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Paper elevation={4} sx={{ padding: 2, marginBottom: 1, backgroundColor: '#232D3F', borderRadius: '10px' }}>
                <Typography fontFamily="inter" variant="h4" component="h1" gutterBottom>
                    {userDetails.first_name} {userDetails.last_name}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                    <Typography fontFamily="inter" variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/users/${userId}/followers`)}>
                        {followers.length} Followers
                    </Typography>
                    <Typography fontFamily="inter" variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/users/${userId}/following`)}>
                        {following.length} Following
                    </Typography>
                </Stack>
                {!isCurrentUser && (
                    <Button
                        variant={'contained'}
                        color= {isFollowing ? "primary" : "secondary"}
                        onClick={handleFollow}
                        sx={{ maxWidth: '150px', alignSelf: 'center' }} // Make the button more compact
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                )}
            </Paper>
            <Box className={styles.videosContainer}>
                {posts.map((post) => (
                    <VideoCard
                        key={post.id}
                        postId={post.id}
                        title={post.title}
                        thumbnailUrl={post.thumbnail_url}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default UserPage;
