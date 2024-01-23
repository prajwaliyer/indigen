import React from 'react';
import { Link } from 'react-router-dom';

const PostsList = ({ posts }) => {
    return (
        <div>
            {posts && posts.map((post) => (
                <div key={post.id}>
                    {post.video_url && (
                        <Link to={`/watch/${encodeURIComponent(post.video_url.split('/').pop())}`}>
                            Watch Video
                        </Link>
                    )}
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};

export default PostsList;
