import React, {useContext, useState, useRef} from 'react';
import {useContainerDimensions} from "../../../hooks/custom";
import {useSelector, useDispatch} from 'react-redux';
import {addToCart} from '../../../_actions/cart_actions';
import {setIndex} from '../../../_actions/playlist_actions';
import {Box, Image, IconButton, Text, Stack, ButtonGroup, Button} from '@chakra-ui/core';
import {Link} from 'react-router-dom';
import {AudioContext} from "../../utils/AudioContext";
import {FaPlay, FaPause, FaStepForward, FaStepBackward, FaCartPlus} from 'react-icons/fa';
import styled from "@emotion/styled/macro";
import BeatPlayerProgressBar from './BeatPlayerProgressBar';
import BeatPlayerVolumeSlider from './BeatPlayerVolumeSlider';

const ProgressBarHolder = styled.div``

function BeatPlayer() {
    const {playlist, audio} = useContext(AudioContext);
    const [Playlist, setPlaylist] = playlist;
    const [CurrentAudio, setCurrentAudio] = audio;

    const ProgressLengthRef = useRef();
    const {width} = useContainerDimensions(ProgressLengthRef);

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

    if (show && Playlist[index]) {
        return (
            <ProgressBarHolder ref={ProgressLengthRef}>
                <Box position="fixed" bottom="0" width="100%" height={{base: "60px", md: "70px"}} bg="blue.900">
                    <Box position="absolute" display="flex" alignItems="center" justifyContent="center" m="auto" w="100%" h="100%">
                        <IconButton size="sm" isRound aria-label="Previous beat" icon={FaStepBackward} onClick={prevBeat} />
                        <IconButton ml="10px" mr="10px" isRound aria-label="Play audio" icon={Playlist[index].isPlaying ? FaPause : FaPlay} onClick={playOrPauseCurrentAudio} />
                        <IconButton size="sm" isRound aria-label="Next beat" icon={FaStepForward} onClick={nextBeat} />
                    </Box>
                    <BeatPlayerVolumeSlider audio={CurrentAudio} />
                    <Box display="flex" alignItems="center" h="100%">
                        <Image src={Playlist[index].image} size={{base: "0px", sm: "60px", md: "70px"}} />
                        <Stack spacing={0} ml={5} zIndex="100">
                            <Text color="white" fontSize="md" fontWeight={{base: "700", md: "600"}}>
                                <Link to={`/beat/${Playlist[index].url}`}>
                                    {Playlist[index].title}
                                </Link>
                            </Text>
                            <Text color={{base: "gray.100", md: "white"}} fontSize="md" fontWeight="600">{Playlist[index].producer}</Text>
                        </Stack>
                        <ButtonGroup spacing={4} ml={{base: "auto", md: 5}} mr={{base: 4, md: 0}}>
                            <IconButton display={{base: "none", sm: "inline-flex"}} variantColor="blue" aria-label="Free download" icon="download" />
                            <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid" onClick={() => addToCartHandler(Playlist[index]._id)}>
                                ${Playlist[index].price}
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <BeatPlayerProgressBar
                    audio={CurrentAudio}
                    width={width}
                    ProgressLengthRef={ProgressLengthRef}
                    holder={ProgressBarHolder} />
            </ProgressBarHolder>
        );
    } else {
        return (<Box width="100%" ref={ProgressLengthRef}></Box>);
    }
}

export default BeatPlayer
