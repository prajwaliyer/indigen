import React from 'react';
import { Link } from 'react-router-dom';
import styles from './VideoCard.module.scss';

const VideoCard = ({ postId, title }) => {
    const thumbnailUrl = 'https://via.placeholder.com/320x180';
    const detailUrl = `/movie/${postId}`; // Update to link to movie detail page

    return (
        <div className={styles.videoCard}>
            <Link to={detailUrl}>
                <img src={thumbnailUrl} alt={title} style={{ aspectRatio: '16 / 9' }} />
            </Link>
            <div className={styles.videoCaption}>
                <p>{title}</p>
            </div>
        </div>
    );
};

export default VideoCard;
