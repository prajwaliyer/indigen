import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import './Containers.scss';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/list-posts/');
                setPosts(response.data);
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
                    title={post.content}
                />
            ))}
        </div>
    );

    // return (
    //     <div className="videos-container">
    //         {posts.map(post => (
    //             <VideoCard
    //                 key={post.id}
    //                 videoKey={post.video_url.split('/').pop()}
    //                 title={post.content}
    //             />
    //         ))}
    //     </div>
    // );
};

export default Home;
