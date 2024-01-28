import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useParams, useLocation } from 'react-router-dom';

const VideoPlayer = () => {
    const { videoKey } = useParams();
    const location = useLocation();
    const videoNode = useRef(null);
    const player = useRef(null);
    const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

    useEffect(() => {
        const controlBarOptions = {
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
        };

        const videoType = location.pathname.includes('/trailer/') ? 'trailers' : 'videos';
        player.current = videojs(videoNode.current, {
            controls: true,
            controlBar: controlBarOptions,
            playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2],
            sources: [{
                src: `${cloudFrontUrl}/${videoType}/${videoKey}`,
                type: 'video/mp4'
            }]
        });

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
    }, [videoKey, location.pathname]);

    return (
        <div data-vjs-player>
            <video ref={videoNode} className="video-js vjs-big-play-centered"></video>
        </div>
    );
};

export default VideoPlayer;
