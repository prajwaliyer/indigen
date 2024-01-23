import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
    const { videoKey } = useParams(); // Extract the videoKey from the URL
    const videoNode = useRef(null);
    const player = useRef(null);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    useEffect(() => {
        player.current = videojs(videoNode.current, {
            controls: true,
            playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2],
            sources: [{
                src: `${cloudFrontUrl}/videos/${videoKey}`,
                type: 'video/mp4'
            }]
        });

        return () => {
            if (player.current) {
                player.current.dispose();
            }
        };
    }, [videoKey]);

    return (
        <div data-vjs-player>
            <video ref={videoNode} className="video-js vjs-big-play-centered"></video>
        </div>
    );
};

export default VideoPlayer;
