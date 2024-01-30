import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.scss';

const VideoCard = ({ postId, title }) => {
    const thumbnailUrl = 'https://via.placeholder.com/320x180';
    const detailUrl = `/movie/${postId}`; // Update to link to movie detail page

    return (
        <div className="video-card">
            <Link to={detailUrl}>
                <img src={thumbnailUrl} alt={title} style={{ aspectRatio: '16 / 9' }} />
            </Link>
            <div className="video-caption">
                <p>{title}</p>
            </div>
        </div>
    );
};

export default VideoCard;
