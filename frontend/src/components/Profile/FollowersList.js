import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FollowersList = () => {
    const { userId } = useParams();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            const response = await axios.get(`http://localhost:8000/users/${userId}/followers/`);
            setFollowers(response.data);
        };
        fetchFollowers();
    }, [userId]);

    return (
        <div>
            <h2>Followers</h2>
            <ul>
                {followers.map(follower => (
                    <li key={follower.id}>
                        <Link to={`/users/${follower.id}`}>
                            {follower.first_name} {follower.last_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowersList;
