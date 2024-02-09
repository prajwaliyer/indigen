import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const FollowersList = () => {
    const { userId } = useParams();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/followers/`);
            setFollowers(response.data);
        };
        fetchFollowers();
    }, [userId]);

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: '#232D3F' }}>
                <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                    Followers
                </Typography>
                <List>
                    {followers.map((follower) => (
                        <ListItem 
                            key={follower.id} 
                            divider 
                            button 
                            component={Link} 
                            to={`/users/${follower.id}`}
                            sx={{ textDecoration: 'none', color: 'white' }}>
                            <ListItemText 
                                primary={`${follower.first_name} ${follower.last_name}`} 
                                primaryTypographyProps={{ color: 'white' }}/>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default FollowersList;
