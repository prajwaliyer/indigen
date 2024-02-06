import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './Shorts.module.scss';

const VideoPlayer = ({ videoUrl, autoplay }) => {
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
                    autoplay: autoplay,
                    loop: true,
                    mute: true,
                    sources: [{
                        src: videoUrl,
                        type: 'video/mp4'
                    }],
                    controlBar: {
                        children: [
                            'playToggle',
                            'volumePanel',
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
        <div className={styles.videoJsContainerShorts}>
            <div data-vjs-player>
                <video ref={videoNode} className={`${styles.videoJs} video-js vjs-big-play-centered`}></video>
            </div>
        </div>
    );
};

export default VideoPlayer;
