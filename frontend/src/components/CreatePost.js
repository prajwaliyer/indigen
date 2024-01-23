import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState(null);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        let videoUrl = null;
        if (video) {
            const presignedResponse = await axios.get(`http://localhost:8000/get-presigned-url/`, {
                params: {
                    file_name: video.name,
                    file_type: video.type,
                },
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                }
            });

            const { presigned_url } = presignedResponse.data;
            await axios.put(presigned_url, video, {
                headers: {
                    'Content-Type': video.type,
                },
            });

            // Construct the video URL for CloudFront
            const videoKey = presigned_url.split('?')[0].split('/').pop();
            videoUrl = `${cloudFrontUrl}/videos/${videoKey}`;
        }

        const postResponse = await axios.post('http://localhost:8000/posts/create/', { content, video_url: videoUrl }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        });

        setContent('');
        setVideo(null);
        onPostCreated(postResponse.data);
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
