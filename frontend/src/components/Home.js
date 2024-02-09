import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard/VideoCard';
import './Containers.scss';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/list-posts/`);
                const sortedPosts = response.data.sort((a, b) => b.views - a.views);
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        
        fetchPosts();
    }, []);

    return (
            <div className="videos-container">
                {posts.map(post => (
                    <VideoCard
                        key={post.id}
                        postId={post.id} // Pass post ID
                        title={post.title}
                        thumbnailUrl={post.thumbnail_url}
                    />
                ))}
            </div>
    );
};

export default Home;
