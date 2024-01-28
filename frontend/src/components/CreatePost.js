import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [castAndCrew, setCastAndCrew] = useState('');
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    const sanitizeFilename = (filename) => {
        return filename.replace(/\s+/g, '_');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let videoUrl = null;
        let trailerUrl = null;
    
        // Function to upload to S3 and get the URL
        const uploadToS3 = async (file, videoType) => {
            const sanitizedFilename = sanitizeFilename(file.name);
            const presignedResponse = await axios.get(`http://localhost:8000/get-presigned-url/`, {
                params: {
                    file_name: sanitizedFilename,
                    file_type: file.type,
                    video_type: videoType
                },
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                }
            });
    
            const { presigned_url } = presignedResponse.data;
            await axios.put(presigned_url, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });
    
            return presigned_url.split('?')[0].split('/').pop(); // Get the file key
        };
    
        if (video) {
            const videoKey = await uploadToS3(video, 'movie');
            videoUrl = `${cloudFrontUrl}/videos/${videoKey}`;
        }
        
        if (trailer) {
            const trailerKey = await uploadToS3(trailer, 'trailer');
            trailerUrl = `${cloudFrontUrl}/trailers/${trailerKey}`;
        }
    
        const postData = {
            content,
            video_url: videoUrl,
            trailer_url: trailerUrl,
            cast_and_crew: JSON.parse(castAndCrew) // JSON for now
        };
    
        const postResponse = await axios.post('http://localhost:8000/posts/create/', postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        });
    
        setContent('');
        setVideo(null);
        setTrailer(null);
        setCastAndCrew('');
        onPostCreated(postResponse.data);
    };
    

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleTrailerChange = (e) => {
        setTrailer(e.target.files[0]);
    };

    const handleCastAndCrewChange = (e) => {
        setCastAndCrew(e.target.value);
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
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleTrailerChange}
                />
                <textarea
                    value={castAndCrew}
                    onChange={handleCastAndCrewChange}
                    placeholder="Enter cast and crew details in JSON format"
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
