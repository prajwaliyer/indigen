import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
    const { postId } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [userEmailToIdMap, setUserEmailToIdMap] = useState({});

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/posts/${postId}/`);
                setMovieDetails(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
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

        fetchMovieDetails();
        fetchUsers();
    }, [postId]);

    if (!movieDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>{movieDetails.content}</h1>
            <p><Link to={`/watch/video/${encodeURIComponent(movieDetails.video_url.split('/').pop())}`}>Watch Movie</Link></p>
            <p><Link to={`/watch/trailer/${encodeURIComponent(movieDetails.trailer_url.split('/').pop())}`}>Watch Trailer</Link></p>
            <h2>Cast & Crew</h2>
            <ul>
                {movieDetails.cast_and_crew.map((person, index) => (
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
    );
};

export default MovieDetail;
