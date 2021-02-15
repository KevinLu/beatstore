import React, {useEffect, useState} from 'react';
import {Tooltip} from '@chakra-ui/react';
import styled from "@emotion/styled/macro";
const bp = ["30em", "48em", "62em", "80em"];

let startTime = new Date();

function BeatPlayerProgressBar(props) {
    const {audio, width, holder, playNextBeat} = props;
    const [SongProgressOffset, setSongProgressOffset] = useState("0%");
    const [SongProgressTime, setSongProgressTime] = useState("0:00");

    const SongLengthBar = styled.button`
    position: fixed;
    bottom: 60px;
    @media (min-width: ${bp[1]}) {
        bottom: 70px;
    }
    width: 100%;
    height: 5px;
    background: #3182ce;
    opacity: 0.5;
    transition: height 0.3s, opacity 0.5s ease-in-out;
    ${holder}:hover & {
        height: 10px;
        opacity: 1;
    } 
    `

    const SongProgressBar = styled.button`
    position: fixed;
    bottom: 60px;
    @media (min-width: ${bp[1]}) {
        bottom: 70px;
    }
    width: 0%;
    height: 5px;
    background: #1e4e8c;
    opacity: 0.5;
    transition: height 0.3s, opacity 0.5s ease-in-out;
    ${holder}:hover & {
        height: 10px;
        opacity: 1;
    } 
    `

    const ProgressDot = styled.button`
    position: fixed;
    bottom: 60px;
    @media (min-width: ${bp[1]}) {
        bottom: 70px;
    }
    left: 0px;
    height: 10px;
    width: 10px;
    background-color: #1a365d;
    border-radius: 50%;
    border: 2px solid #ebf8ff;
    opacity: 0;
    transition: 0.3s ease-in-out;
    ${holder}:hover & {
        opacity: 1;
        transform: scale(2);
    }
    `

    const secondsToTime = (e) => {
        var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0');

        return m + ':' + s;
    }

    const handleTimeUpdate = () => {
        let newTime = new Date();
        let timeDiff = newTime - startTime;
        if (timeDiff >= 500) {
            updateSongProgress();
            startTime = newTime;
        }
    }

    const updateSongProgress = () => {
        var position = audio.currentTime / audio.duration;
        setSongProgressOffset((position * 100) + "%");
        setSongProgressTime(secondsToTime(audio.currentTime));
    }

    const clamp = (min, val, max) => {
        return Math.min(Math.max(min, val), max);
    }

    const handleSeek = (e) => {
        var position = audio.currentTime / audio.duration;
        var percent = clamp(0, (e.nativeEvent.clientX - position) / width, 1);
        audio.currentTime = percent * audio.duration;
        updateSongProgress();
    }

    useEffect(() => {
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', playNextBeat);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', playNextBeat);
        };
    }, []);

    return (
        <div>
            <SongLengthBar onClick={handleSeek} />
            <SongProgressBar style={{width: SongProgressOffset}} onClick={handleSeek} />
            <Tooltip hasArrow placement="top" label={SongProgressTime}>
                <ProgressDot style={{left: SongProgressOffset}} />
            </Tooltip>
        </div>
    );
}

export default BeatPlayerProgressBar;
