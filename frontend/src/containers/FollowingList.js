import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FollowingList = () => {
    const { userId } = useParams();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}/following/`);
                setFollowing(response.data);
            } catch (error) {
                console.error('Error fetching following:', error);
            }
        };
        fetchFollowing();
    }, [userId]);

    return (
        <div>
            <h2>Following</h2>
            <ul>
                {following.map(follow => (
                    <li key={follow.id}>
                        <Link to={`/users/${follow.id}`}>
                            {follow.first_name} {follow.last_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowingList;
