import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { TextField, Button, FormControl, FormLabel, FormHelperText } from '@mui/material';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [castAndCrew, setCastAndCrew] = useState([{ name: '', email: '', role: '' }]);
    const [errors, setErrors] = useState({});
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    const sanitizeFilename = (filename) => {
        return filename.replace(/\s+/g, '_');
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

    // Dropzone hooks for video and trailer
    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: acceptedFiles => setVideo(acceptedFiles[0]),
    });

    const { getRootProps: getTrailerRootProps, getInputProps: getTrailerInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: acceptedFiles => setTrailer(acceptedFiles[0]),
    });

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.content = content ? '' : 'Title is required.';
        tempErrors.video = video ? '' : 'Movie file is required.';
        tempErrors.trailer = trailer ? '' : 'Trailer file is required.';
        tempErrors.castAndCrew = castAndCrew.some(item => item.name && item.role) ? '' : 'At least one cast/crew member is required.';

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
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
        <div style={{ margin: '20px', color: 'white' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#333', padding: '20px', borderRadius: '10px' }}>
                <FormControl fullWidth error={!!errors.content} style={{ marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Title</FormLabel>
                    <TextField
                        variant="outlined"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter title"
                        InputProps={{
                            style: { 
                                height: '50px',
                            },
                        }}
                    />
                    <FormHelperText>{errors.content}</FormHelperText>
                </FormControl>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <FormControl fullWidth error={!!errors.video} style={{ marginRight: '10px' }}>
                        <FormLabel style={{ marginBottom: '10px' }}>Movie</FormLabel>
                        <div {...getVideoRootProps()} style={{ padding: '20px', border: '2px dashed #555', cursor: 'pointer' }}>
                            <input {...getVideoInputProps()} />
                            <p>{video ? `${video.name}` : 'Drag and drop, or click to browse'}</p>
                        </div>
                        <FormHelperText>{errors.video}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth error={!!errors.trailer}>
                        <FormLabel style={{ marginBottom: '10px' }}>Trailer</FormLabel>
                        <div {...getTrailerRootProps()} style={{ padding: '20px', border: '2px dashed #555', cursor: 'pointer' }}>
                            <input {...getTrailerInputProps()} />
                            <p>{trailer ? `${trailer.name}` : 'Drag and drop, or click to browse'}</p>
                        </div>
                        <FormHelperText>{errors.trailer}</FormHelperText>
                    </FormControl>
                </div>

                <FormControl fullWidth error={!!errors.castAndCrew} style={{ marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Cast & Crew</FormLabel>
                    {castAndCrew.map((inputField, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <TextField
                                name="name"
                                value={inputField.name}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Cast/Crew Name"
                                style={{ marginRight: '10px' }}
                                InputProps={{
                                    style: { 
                                        height: '50px',
                                    },
                                }}
                            />
                            <TextField
                                name="email"
                                value={inputField.email}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Email"
                                type="email"
                                style={{ marginRight: '10px' }}
                                InputProps={{ style: { height: '50px' }}}
                            />
                            <TextField
                                name="role"
                                value={inputField.role}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Role"
                                style={{ marginRight: '10px' }}
                                InputProps={{
                                    style: { 
                                        height: '50px',
                                    },
                                }}
                            />
                            <Button variant="contained" color="secondary" onClick={() => handleRemoveFields(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button variant="contained" color="primary" onClick={() => handleAddFields()}>
                            Add Cast/Crew
                        </Button>
                    </div>
                    <FormHelperText>{errors.castAndCrew}</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">Post</Button>
            </form>
        </div>
    );
};

export default CreatePost;
