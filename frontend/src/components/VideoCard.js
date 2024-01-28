import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.scss';

const VideoCard = ({ videoKey, title }) => {
    const thumbnailUrl = 'https://via.placeholder.com/320x180';
    const videoUrl = `/watch/video/${encodeURIComponent(videoKey)}`;

    return (
        <div className="video-card">
            <Link to={videoUrl}>
                <img src={thumbnailUrl} alt={title} style={{ aspectRatio: '16 / 9' }} />
            </Link>
            <div className="video-caption">
                <p>{title}</p>
            </div>
        </div>
    );
};

export default VideoCard;
