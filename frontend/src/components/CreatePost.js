import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        try {
            const response = await axios.post('http://localhost:8000/posts/create/', { content }, config);
            setContent('');
            onPostCreated(response.data);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
