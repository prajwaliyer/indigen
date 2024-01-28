import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [castAndCrew, setCastAndCrew] = useState([{ name: '', role: '' }]);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    const sanitizeFilename = (filename) => {
        return filename.replace(/\s+/g, '_');
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleTrailerChange = (e) => {
        setTrailer(e.target.files[0]);
    };

    const handleInputChange = (index, event) => {
        const values = [...castAndCrew];
        values[index][event.target.name] = event.target.value;
        setCastAndCrew(values);
    };

    const handleAddFields = () => {
        setCastAndCrew([...castAndCrew, { name: '', role: '' }]);
    };

    const handleRemoveFields = index => {
        const values = [...castAndCrew];
        values.splice(index, 1);
        setCastAndCrew(values);
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
        console.log('Cast and Crew before submitting:', castAndCrew);
        const postData = {
            content,
            video_url: videoUrl,
            trailer_url: trailerUrl,
            cast_and_crew: castAndCrew
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
        setCastAndCrew([{ name: '', role: '' }]);
        onPostCreated(postResponse.data);
    };

    return (
        <div style={{ margin: '20px' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="Enter title"
                        style={{ width: '100%', height: '100px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleTrailerChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                {console.log('Rendering Cast and Crew:', castAndCrew)} {/* Debug log */}
                    {castAndCrew.map((inputField, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                value={inputField.name}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Cast/Crew Name"
                            />
                            <input
                                type="text"
                                name="role"
                                value={inputField.role}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Role"
                            />
                            <button type="button" onClick={() => handleRemoveFields(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddFields()}>
                        Add Cast/Crew
                    </button>
                </div>
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
