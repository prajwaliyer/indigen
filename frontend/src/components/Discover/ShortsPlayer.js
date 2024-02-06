// ShortsPlayer.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import VideoPlayerShorts from './VideoPlayerShorts';
import axios from 'axios';
import { Button, Card, CardContent, Typography } from '@mui/material';
import styles from './Shorts.module.scss';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const ShortsPlayer = () => {
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
                const response = await axios.get('http://localhost:8000/users/list-posts/');
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/list-users/');
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

    const handleViewMovie = () => {
        navigate(`/movie/${movies[currentMovieIndex].id}`);
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
                                <Typography variant="h5" component="div">
                                    {movies[currentMovieIndex].content}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }}>
                                    Cast & Crew
                                </Typography>
                                <ul>
                                    {movies[currentMovieIndex].cast_and_crew.map((person, index) => (
                                        <li key={index}>
                                            {userEmailToIdMap[person.email] ? (
                                                <Link to={`/users/${userEmailToIdMap[person.email]}`}>{person.name}</Link>
                                            ) : (
                                                <span>{person.name}</span>
                                            )}
                                            {' - ' + person.role}
                                        </li>
                                    ))}
                                </ul>
                                </div>
                                <div className={styles.buttonsContainer}>
                                    {/* <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={handleViewMovie} 
                                        style={{ borderColor: 'white', color: 'white' }}
                                        className={styles.button}
                                    >
                                        <PlayCircleIcon sx={{ marginRight: '7px' }}/>
                                        Play Movie
                                    </Button> */}
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
