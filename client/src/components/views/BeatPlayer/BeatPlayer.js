import React, { useContext, useEffect, useState, useRef } from 'react';
import { useContainerDimensions } from "../../../hooks/custom";
import { Box, Image, IconButton, Text, Stack, ButtonGroup, Button, Tooltip } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { AudioContext } from "../../utils/AudioContext";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaCartPlus } from 'react-icons/fa';
import styled from "@emotion/styled/macro";

const bp = ["30em", "48em", "62em", "80em"];
const ProgressBarHolder = styled.div`
`

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
  ${ProgressBarHolder}:hover & {
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
  ${ProgressBarHolder}:hover & {
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
  ${ProgressBarHolder}:hover & {
    opacity: 1;
    transform: scale(2);
  }
`

function BeatPlayer() {
    const { show, playlist, index, audio } = useContext(AudioContext);
    const [Show, setShow] = show;
    const [Playlist, setPlaylist] = playlist;
    const [Index, setIndex] = index;
    const [CurrentAudio, setCurrentAudio] = audio;

    const [SongProgressOffset, setSongProgressOffset] = useState("0%");
    const [SongProgressTime, setSongProgressTime] = useState("0:00");
    const ProgressLengthRef = useRef();
    const { width } = useContainerDimensions(ProgressLengthRef);

    const secondsToTime = (e) => {
        var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0');

        return m + ':' + s;
    }

    const playOrPauseCurrentAudio = () => {
        if (Playlist[Index].isPlaying) {
            CurrentAudio.pause();
            Playlist[Index].isPlaying = false;
            Playlist[Index].isPaused = true;
        } else if (Playlist[Index].isPaused) {
            CurrentAudio.play();
            Playlist[Index].isPlaying = true;
            Playlist[Index].isPaused = false;
        } else {
            CurrentAudio.pause();
            CurrentAudio.currentTime = 0;
            CurrentAudio.src = Playlist[Index].audio;
            CurrentAudio.play();
            Playlist[Index].isPlaying = true;
        }
        console.log(Playlist)
    }

    const playAudioInPlaylist = (i) => {
        CurrentAudio.pause();
        CurrentAudio.currentTime = 0;
        CurrentAudio.src = Playlist[i].audio;
        CurrentAudio.play();
        Playlist[i].isPlaying = true;
        Playlist[i].isPaused = false;
    }

    const prevBeat = () => {
        CurrentAudio.pause();
        CurrentAudio.currentTime = 0;
        Playlist[Index].isPlaying = false;
        Playlist[Index].isPaused = true;
        if (Index === 1) { // already the first beat (we want to ignore the placeholder beat)
            setIndex(Playlist.length - 1, playAudioInPlaylist(Playlist.length - 1));
        } else {
            setIndex(Index - 1, playAudioInPlaylist(Index - 1));
        }
    }

    const nextBeat = () => {
        CurrentAudio.pause();
        CurrentAudio.currentTime = 0;
        Playlist[Index].isPlaying = false;
        Playlist[Index].isPaused = true;
        if (Index + 1 === Playlist.length) { // already the last beat (we want to ignore the placeholder beat)
            setIndex(1, playAudioInPlaylist(1));
        } else {
            setIndex(Index + 1, playAudioInPlaylist(Index + 1));
        }
    }

    const updateSongProgress = () => {
        var position = CurrentAudio.currentTime / CurrentAudio.duration;
        setSongProgressOffset((position * 100) + "%");
        setSongProgressTime(secondsToTime(CurrentAudio.currentTime));
    }

    const clamp = (min, val, max) => {
        return Math.min(Math.max(min, val), max);
    }

    const handleSeek = (e) => {
        var position = CurrentAudio.currentTime / CurrentAudio.duration;
        var percent = clamp(0, (e.nativeEvent.clientX - position) / width, 1);
        CurrentAudio.currentTime = percent * CurrentAudio.duration;
        updateSongProgress();
    }

    useEffect(() => {
        CurrentAudio.addEventListener('timeupdate', () => {
            updateSongProgress();
        });
    }, []);

    if (Show) {
        return (
            <ProgressBarHolder ref={ProgressLengthRef}>
                <Box position="fixed" bottom="0" width="100%" height={{ base: "60px", md: "70px" }} bg="blue.900">
                    <Box position="absolute" bottom="0px" display="flex" alignItems="center" justifyContent="center" m="auto" w="100%" h="100%">
                        <IconButton size="sm" isRound aria-label="Previous beat" icon={FaStepBackward} onClick={prevBeat} />
                        <IconButton ml="10px" mr="10px" isRound aria-label="Play audio" icon={Playlist[Index].isPlaying ? FaPause : FaPlay} onClick={playOrPauseCurrentAudio} />
                        <IconButton size="sm" isRound aria-label="Next beat" icon={FaStepForward} onClick={nextBeat} />
                    </Box>
                    <Box display="flex" alignItems="center" h="100%">
                        <Image src={Playlist[Index].image} size={{ base: "0px", sm: "60px", md: "70px" }} />
                        <Stack spacing={0} ml={5} zIndex="100">
                            <Text color="white" fontSize="md" fontWeight={{ base: "700", md: "600" }}>
                                <Link to={`/beat/${Playlist[Index].url}`}>
                                    {Playlist[Index].title}
                                </Link>
                            </Text>
                            <Text color={{ base: "gray.100", md: "white" }} fontSize="md" fontWeight="600">{Playlist[Index].producer}</Text>
                        </Stack>
                        <ButtonGroup spacing={4} ml={{ base: "auto", md: 5 }} mr={{ base: 4, md: 0 }}>
                            <IconButton display={{ base: "none", sm: "inline-flex" }} variantColor="blue" aria-label="Free download" icon="download" />
                            <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid">
                                ${Playlist[Index].price}
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <SongLengthBar onClick={handleSeek} />
                <SongProgressBar style={{ width: SongProgressOffset }} onClick={handleSeek} />
                <Tooltip hasArrow placement="top" label={SongProgressTime}>
                    <ProgressDot style={{ left: SongProgressOffset }} />
                </Tooltip>
            </ProgressBarHolder>
        );
    } else {
        return (<Box width="100%" ref={ProgressLengthRef}></Box>);
    }
}

export default BeatPlayer
