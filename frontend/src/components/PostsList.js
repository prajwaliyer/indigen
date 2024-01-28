import React from 'react';
import { Link } from 'react-router-dom';

const PostsList = ({ posts }) => {
    return (
        <div>
            {posts && posts.map((post) => (
                <div key={post.id}>
                    {post.video_url && <Link to={`/watch/video/${encodeURIComponent(post.video_url.split('/').pop())}`}>Watch Main Video</Link>}
                    {post.trailer_url && <Link to={`/watch/trailer/${encodeURIComponent(post.trailer_url.split('/').pop())}`}>Watch Trailer</Link>}
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};

export default PostsList;
