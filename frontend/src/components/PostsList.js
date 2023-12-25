import React from 'react';

const PostsList = ({ posts }) => {
    return (
        <div>
            {posts && posts.map((post) => (
                <div key={post.id}>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};

export default PostsList;
