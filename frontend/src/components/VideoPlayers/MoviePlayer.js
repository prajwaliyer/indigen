import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useParams, useLocation } from 'react-router-dom';

const VideoPlayer = () => {
    const { videoKey } = useParams();
    const location = useLocation();
    const videoNode = useRef(null);
    const player = useRef(null);
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    useEffect(() => {
        setIsComponentMounted(true);
    }, []);

    useEffect(() => {
        const videoType = location.pathname.includes('/trailer/') ? 'trailers' : 'videos';
        if (isComponentMounted && videoNode.current) {
            player.current = videojs(videoNode.current, {
                controls: true,
                playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2],
                sources: [{
                    src: `${cloudFrontUrl}/${videoType}/${videoKey}`,
                    type: 'video/mp4'
                }],
                controlBar: {
                    children: [
                        'playToggle',
                        'volumePanel',
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'progressControl',
                        'liveDisplay',
                        'seekToLive',
                        'customControlSpacer',
                        'playbackRateMenuButton',
                        'chaptersButton',
                        'descriptionsButton',
                        'subsCapsButton',
                        'audioTrackButton',
                        'fullscreenToggle'
                    ]
                }
            });
        }

        // Disable right-click on the video element
        videoNode.current.oncontextmenu = (e) => {
            e.preventDefault();
            return false;
        };

        return () => {
            if (player.current) {
                player.current.dispose();
            }
        };
    }, [isComponentMounted, videoKey, location.pathname]);

    useEffect(() => {
        console.log('Video node ref:', videoNode.current);
    }, []);

    return (
        <div className="video-js-container">
            <div data-vjs-player>
                <video ref={videoNode} className="video-js vjs-big-play-centered"></video>
            </div>
        </div>
    );
};

export default VideoPlayer;
