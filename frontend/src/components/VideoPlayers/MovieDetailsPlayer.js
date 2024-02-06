import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoUrl }) => {
    const videoNode = useRef(null);
    const player = useRef(null);
    const [isComponentMounted, setIsComponentMounted] = useState(false);

    useEffect(() => {
        setIsComponentMounted(true);
    }, []);
    

    useEffect(() => {
        if (isComponentMounted && videoNode.current) {
            if (videoNode.current) {
                player.current = videojs(videoNode.current, {
                    controls: true,
                    playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2],
                    sources: [{
                        src: videoUrl,
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
        }

        return () => {
            if (player.current) {
                player.current.dispose();
            }
        };
    }, [isComponentMounted, videoUrl]);

    return (
        <div className="video-js-container">
            <div data-vjs-player>
                <video ref={videoNode} className="video-js vjs-big-play-centered"></video>
            </div>
        </div>
    );
};

export default VideoPlayer;
