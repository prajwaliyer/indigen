// ShortsPlayer.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import VideoPlayerShorts from './VideoPlayerShorts';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import styles from './Shorts.module.scss';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useTheme } from '@mui/material/styles';

const ShortsPlayer = () => {
    const theme = useTheme();
    const { postId } = useParams();
    const location = useLocation();
    const isDiscover = location.pathname.includes('/discover');
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [userEmailToIdMap, setUserEmailToIdMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/list-posts/`);
                const sortedPosts = response.data.sort((a, b) => b.views - a.views);
                setMovies(sortedPosts);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/list-users/`);
                const emailToIdMap = {};
                response.data.forEach(user => {
                    emailToIdMap[user.email] = user.id;
                });
                setUserEmailToIdMap(emailToIdMap);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchMovies();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (isDiscover) {
            setCurrentMovieIndex(0);
        } else {
            // Find the index of the movie that matches the postId
            const index = movies.findIndex(movie => movie.id.toString() === postId);
            if (index !== -1) {
                setCurrentMovieIndex(index);
            }
        }
    }, [location.pathname, postId, movies]);

    const handlePreviousTrailer = () => {
        const prevIndex = (currentMovieIndex - 1 + movies.length) % movies.length;
        setCurrentMovieIndex(prevIndex);
        if (window.location.pathname.includes('/discover')) {
        }
        else {
            navigate(`/movie/${movies[prevIndex].id}`);
        }
    };

    const handleNextTrailer = () => {
        const nextIndex = (currentMovieIndex + 1) % movies.length;
        setCurrentMovieIndex(nextIndex);
        if (!isDiscover) {
            navigate(`/movie/${movies[nextIndex].id}`);
        }
    };

    const handleViewMovie = async () => {
        // Assuming movies[currentMovieIndex] is the current movie object
        const movieId = movies[currentMovieIndex].id; // Correctly derive movieId from the current movie object
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts/${movieId}/increment-views/`, {}, {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('access')}`
                }
            });
            if (response.data.status === 'success') {
                setMovies(prevMovies => prevMovies.map((movie, index) => {
                    if (index === currentMovieIndex) {
                        return { ...movie, views: response.data.views };
                    }
                    return movie;
                }));
            }
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    
        // Adjusted to navigate using the video URL from the current movie object
        navigate(`/watch/video/${movies[currentMovieIndex].video_url.split('/').pop()}`);
    };
    

    return (
        <div className={styles.shortsContainer}>
            {movies.length > 0 && (
                <div className={styles.shortsFlexContainer}>
                    <div className={styles.videoContainer}>
                        <VideoPlayerShorts key={movies[currentMovieIndex].trailer_url} videoUrl={movies[currentMovieIndex].trailer_url} autoplay={isDiscover} />
                    </div>
                    <div className={styles.detailsContainer}>
                        <Card sx={{ minWidth: 275, backgroundColor: '#232D3F', color: 'white', height: '100%', borderRadius: '15px' }}>
                            <CardContent className={styles.cardContent}>
                                <div className={styles.content}>
                                    <Typography variant="h4" component="div">
                                        {movies[currentMovieIndex].title}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary">
                                        By <Link to={`/users/${movies[currentMovieIndex].author}`} style={{ textDecoration: 'none' }}>
                                            {movies[currentMovieIndex].author_name}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {movies[currentMovieIndex].views} movie views
                                    </Typography>
                                    <div style={{ marginLeft: 0, marginTop: '20px', marginBottom: '20px'  }}>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            onClick={handleViewMovie} 
                                            style={{ borderColor: 'white', color: 'white', margin: 0 }}
                                            className={styles.button}
                                        >
                                            <PlayCircleIcon sx={{ marginRight: '7px' }}/>
                                            Play Movie
                                        </Button>
                                    </div>
                                    <Typography variant="body2">
                                        {movies[currentMovieIndex].description}
                                    </Typography>
                                    <Typography sx={{ mt: 4, mb: 1.5 }}>
                                        Cast & Crew
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap">
                                        {movies[currentMovieIndex].cast_and_crew.map((person, index) => (
                                            userEmailToIdMap[person.email] ? (
                                                <Link to={`/users/${userEmailToIdMap[person.email]}`} key={index} style={{ textDecoration: 'none' }}>
                                                    <div style={{ paddingLeft: '5px' }}>
                                                        <Chip 
                                                            label={`${person.role}: ${person.name}`}
                                                            clickable
                                                            variant="outlined"
                                                            sx={{ mb: 1, color: '#1976d2' }}
                                                        />
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div style={{ paddingLeft: '5px' }}>
                                                    <Chip 
                                                        key={index}
                                                        label={`${person.role}: ${person.name}`}
                                                        variant="outlined" 
                                                        sx={{ mb: 1, color: 'grey' }}
                                                    />
                                                </div>
                                            )
                                        ))}
                                    </Stack>
                                </div>
                                <div className={styles.buttonsContainer}>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={handlePreviousTrailer} 
                                        style={{ borderColor: 'white', color: 'white' }}
                                        className={styles.button}
                                    >
                                        <NavigateBeforeIcon/>
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={handleNextTrailer} 
                                        style={{ borderColor: 'white', color: 'white' }}
                                        className={styles.button}
                                    >
                                        <NavigateNextIcon/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortsPlayer;
