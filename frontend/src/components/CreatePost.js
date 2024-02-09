import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { TextField, Button, FormControl, FormLabel, FormHelperText } from '@mui/material';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [castAndCrew, setCastAndCrew] = useState([{ name: '', email: '', role: '' }]);
    const [errors, setErrors] = useState({});
    const currentUser = useSelector((state) => state.auth.user);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.title = title ? '' : 'Title is required.';
        tempErrors.description = description ? '' : 'Description is required.';
        tempErrors.video = video ? '' : 'Movie file is required.';
        tempErrors.trailer = trailer ? '' : 'Trailer file is required.';
        tempErrors.thumbnail = thumbnail ? '' : 'Thumbnail is required.';
        tempErrors.castAndCrew = castAndCrew.some(item => item.name && item.role) ? '' : 'At least one cast/crew member is required.';

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

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

    const checkVideoDuration = (file, maxDuration, callback) => {
        // Create a URL for the video file
        const fileURL = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
    
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src); // Clean up the blob URL
            const duration = video.duration;
            if (duration > maxDuration) {
                callback(false, `Duration exceeds the maximum allowed (${maxDuration / 60} minutes).`);
            } else {
                callback(true);
            }
        };
    
        video.onerror = () => {
            callback(false, "Error loading video file.");
            window.URL.revokeObjectURL(video.src); // Clean up the blob URL
        };
    
        video.src = fileURL;
    };

    // Dropzone hooks for video and trailer
    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/x-msvideo': ['.avi']
        },
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            checkVideoDuration(file, 3 * 60 * 60, (isValid, errorMessage) => { // 3 hours in seconds
                if (isValid) {
                    setVideo(file);
                } else {
                    setErrors(prev => ({...prev, video: errorMessage}));
                }
            });
        },
    });

    const { getRootProps: getTrailerRootProps, getInputProps: getTrailerInputProps } = useDropzone({
        accept: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/x-msvideo': ['.avi']
        },
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            checkVideoDuration(file, 60, (isValid, errorMessage) => {
                if (isValid) {
                    setTrailer(file);
                } else {
                    setErrors(prev => ({ ...prev, trailer: errorMessage }));
                }
            });
        },
    });

    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        onDrop: acceptedFiles => setThumbnail(acceptedFiles[0]),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        let videoUrl = null;
        let trailerUrl = null;
        let thumbnailUrl = null;
    
        // Function to upload to S3 and get the URL
        const uploadToS3 = async (file, uploadType) => {
            const sanitizedFilename = sanitizeFilename(file.name);
            const presignedResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get-presigned-url/`, {
                params: {
                    file_name: sanitizedFilename,
                    file_type: file.type,
                    upload_type: uploadType
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
        try {
            if (video) {
                const videoKey = await uploadToS3(video, 'movie');
                videoUrl = `${cloudFrontUrl}/videos/${videoKey}`;
            }
            
            if (trailer) {
                const trailerKey = await uploadToS3(trailer, 'trailer');
                trailerUrl = `${cloudFrontUrl}/trailers/${trailerKey}`;
            }

            if (thumbnail) {
                const thumbnailKey = await uploadToS3(thumbnail, 'thumbnail');
                thumbnailUrl = `${cloudFrontUrl}/thumbnails/${thumbnailKey}`;
            }
        
            const postData = {
                title,
                description: description,
                video_url: videoUrl,
                trailer_url: trailerUrl,
                thumbnail_url: thumbnailUrl,
                cast_and_crew: castAndCrew
            };
    
            const postResponse = await axios.post(`${process.env.REACT_APP_API_URL}/posts/create/`, postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                }
            });
        
            setTitle('');
            setDescription('');
            setVideo(null);
            setTrailer(null);
            setCastAndCrew([{ name: '', role: '' }]);
            navigate(`/users/${currentUser.id}`);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle the specific case where user has reached post limit
                setErrors(prevErrors => ({
                    ...prevErrors,
                    postLimit: error.response.data.message
                }));
            } else {
                console.error(error);
            }
        }
    };

    return (
        <div style={{ margin: '20px', color: 'white' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#232D3F', padding: '20px', borderRadius: '10px' }}>
                <FormControl fullWidth error={!!errors.title} style={{ marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Title</FormLabel>
                    <TextField
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        helperText={`${title.length}/40 characters`}
                        inputProps={{ maxLength: 40 }}
                        InputProps={{
                            style: { 
                                height: '50px',
                            },
                        }}
                    />
                    <FormHelperText>{errors.title}</FormHelperText>
                </FormControl>

                <FormControl fullWidth error={!!errors.description} style={{ marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Description</FormLabel>
                    <TextField
                        variant="outlined"
                        multiline
                        maxRows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        helperText={`${description.length}/300 characters`}
                        inputProps={{ maxLength: 300 }}
                    />
                    <FormHelperText>{errors.description}</FormHelperText>
                </FormControl>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <FormControl fullWidth error={!!errors.video} style={{ marginRight: '10px' }}>
                        <FormLabel style={{ marginBottom: '10px' }}>Movie</FormLabel>
                        <div {...getVideoRootProps()} style={{ padding: '20px', border: '2px dashed #555', cursor: 'pointer', borderRadius: '10px' }}>
                            <input {...getVideoInputProps()} />
                            <p>{video ? `${video.name}` : 'Drag and drop, or click to browse'}</p>
                        </div>
                        <FormHelperText>{errors.video}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth error={!!errors.trailer}>
                        <FormLabel style={{ marginBottom: '10px' }}>Trailer</FormLabel>
                        <div {...getTrailerRootProps()} style={{ padding: '20px', border: '2px dashed #555', cursor: 'pointer', borderRadius: '10px' }}>
                            <input {...getTrailerInputProps()} />
                            <p>{trailer ? `${trailer.name}` : 'Drag and drop, or click to browse'}</p>
                        </div>
                        <FormHelperText>{errors.trailer}</FormHelperText>
                    </FormControl>
                </div>

                <FormControl error={!!errors.thumbnail} style={{ width: '49.5%', marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Thumbnail</FormLabel>
                    <div {...getThumbnailRootProps()} style={{ padding: '20px', border: '2px dashed #555', cursor: 'pointer', borderRadius: '10px' }}>
                        <input {...getThumbnailInputProps()} />
                        <p>{thumbnail ? `${thumbnail.name}` : 'Drag and drop, or click to browse'}</p>
                    </div>
                    <FormHelperText>{errors.thumbnail}</FormHelperText>
                </FormControl>


                <FormControl fullWidth error={!!errors.castAndCrew} style={{ marginBottom: '20px' }}>
                    <FormLabel style={{ marginBottom: '10px' }}>Cast & Crew</FormLabel>
                    {castAndCrew.map((inputField, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <TextField
                                name="name"
                                value={inputField.name}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Name"
                                style={{ marginRight: '10px' }}
                                InputProps={{
                                    style: { 
                                        height: '50px',
                                    },
                                }}
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
                            <TextField
                                name="email"
                                value={inputField.email}
                                onChange={event => handleInputChange(index, event)}
                                placeholder="Email (optional)"
                                type="email"
                                style={{ marginRight: '10px' }}
                                InputProps={{ style: { height: '50px' }}}
                            />
                            <Button variant="contained" color="secondary" onClick={() => handleRemoveFields(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button variant="contained" color="primary" onClick={() => handleAddFields()}>
                            + Add Cast/Crew
                        </Button>
                    </div>
                    <FormHelperText>{errors.castAndCrew}</FormHelperText>
                </FormControl>
                
                {errors.postLimit && <p className="error" style={{color: 'red'}}>{errors.postLimit}</p>}
                <Button type="submit" variant="contained" color="primary">Post</Button>
            </form>
        </div>
    );
};

export default CreatePost;
