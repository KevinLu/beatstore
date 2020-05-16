import React, { useContext, useEffect, useState, useRef } from 'react';
import { useContainerDimensions } from "../../../hooks/custom";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../../_actions/cart_actions';
import { setIndex } from '../../../_actions/playlist_actions';
import { Box, Image, IconButton, Text, Stack, ButtonGroup, Button, Tooltip, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { AudioContext } from "../../utils/AudioContext";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaCartPlus, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import styled from "@emotion/styled/macro";

const bp = ["30em", "48em", "62em", "80em"];
const ProgressBarHolder = styled.div``

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
    const { playlist, audio } = useContext(AudioContext);
    const [Playlist, setPlaylist] = playlist;
    const [CurrentAudio, setCurrentAudio] = audio;

    const [Volume, setVolume] = useState(1);
    const [SongProgressOffset, setSongProgressOffset] = useState("0%");
    const [SongProgressTime, setSongProgressTime] = useState("0:00");
    const ProgressLengthRef = useRef();
    const { width } = useContainerDimensions(ProgressLengthRef);

    const secondsToTime = (e) => {
        var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0');

        return m + ':' + s;
    }

    const dispatch = useDispatch();
    const index = useSelector(state => state.playlist.index);
    const show = useSelector(state => state.playlist.show);

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId, window.localStorage.getItem("cartId")));
    }

    const setIndexHandler = (i) => {
        dispatch(setIndex(i));
    }

    const playOrPauseCurrentAudio = () => {
        if (Playlist[index].isPlaying) {
            CurrentAudio.pause();
            Playlist[index].isPlaying = false;
            Playlist[index].isPaused = true;
        } else if (Playlist[index].isPaused) {
            CurrentAudio.play();
            Playlist[index].isPlaying = true;
            Playlist[index].isPaused = false;
        } else {
            CurrentAudio.pause();
            CurrentAudio.currentTime = 0;
            CurrentAudio.src = Playlist[index].audio;
            CurrentAudio.play();
            Playlist[index].isPlaying = true;
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
        Playlist[index].isPlaying = false;
        Playlist[index].isPaused = true;
        if (index === 0) { // already the first beat
            setIndexHandler(Playlist.length - 1);
            playAudioInPlaylist(Playlist.length - 1)
        } else {
            setIndexHandler(index - 1);
            playAudioInPlaylist(index - 1)
        }
    }

    const nextBeat = () => {
        CurrentAudio.pause();
        CurrentAudio.currentTime = 0;
        Playlist[index].isPlaying = false;
        Playlist[index].isPaused = true;
        if (index + 1 === Playlist.length) { // already the last beat
            setIndexHandler(0);
            playAudioInPlaylist(0);
        } else {
            setIndexHandler(index + 1);
            playAudioInPlaylist(index + 1);
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

    const handleVolumeChange = (value) => {
        CurrentAudio.volume = value;
        setVolume(value);
    }

    const muteOrUnmute = () => {
        if (CurrentAudio.volume !== 0) {
            CurrentAudio.volume = 0;
            setVolume(0);
        } else {
            CurrentAudio.volume = 1;
            setVolume(1);
        }
    }

    useEffect(() => {
        CurrentAudio.addEventListener('timeupdate', () => {
            updateSongProgress();
        });
    }, []);

    if (show) {
        return (
            <ProgressBarHolder ref={ProgressLengthRef}>
                <Box position="fixed" bottom="0" width="100%" height={{ base: "60px", md: "70px" }} bg="blue.900">
                    <Box position="absolute" display="flex" alignItems="center" justifyContent="center" m="auto" w="100%" h="100%">
                        <IconButton size="sm" isRound aria-label="Previous beat" icon={FaStepBackward} onClick={prevBeat} />
                        <IconButton ml="10px" mr="10px" isRound aria-label="Play audio" icon={Playlist[index].isPlaying ? FaPause : FaPlay} onClick={playOrPauseCurrentAudio} />
                        <IconButton size="sm" isRound aria-label="Next beat" icon={FaStepForward} onClick={nextBeat} />
                    </Box>
                    <Box display={{ base: "none", md: "flex" }} position="absolute" right="0px" mr="2.5rem" alignItems="center" h="100%">
                        <IconButton size="lg" icon={Volume === 0 ? FaVolumeMute : FaVolumeUp} variant="link" color="white" aria-label="Mute or unmute volume" onClick={muteOrUnmute} />
                        <Box width="80px">
                            <Slider min={0} max={1} step={0.02} value={Volume} defaultValue={1} onChange={handleVolumeChange}>
                                <SliderTrack />
                                <SliderFilledTrack />
                                <SliderThumb />
                            </Slider>
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" h="100%">
                        <Image src={Playlist[index].image} size={{ base: "0px", sm: "60px", md: "70px" }} />
                        <Stack spacing={0} ml={5} zIndex="100">
                            <Text color="white" fontSize="md" fontWeight={{ base: "700", md: "600" }}>
                                <Link to={`/beat/${Playlist[index].url}`}>
                                    {Playlist[index].title}
                                </Link>
                            </Text>
                            <Text color={{ base: "gray.100", md: "white" }} fontSize="md" fontWeight="600">{Playlist[index].producer}</Text>
                        </Stack>
                        <ButtonGroup spacing={4} ml={{ base: "auto", md: 5 }} mr={{ base: 4, md: 0 }}>
                            <IconButton display={{ base: "none", sm: "inline-flex" }} variantColor="blue" aria-label="Free download" icon="download" />
                            <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid" onClick={() => addToCartHandler(Playlist[index]._id)}>
                                ${Playlist[index].price}
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
