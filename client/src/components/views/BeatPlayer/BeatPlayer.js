import React, {useContext, useRef, useEffect} from 'react';
import {useContainerDimensions} from "../../../hooks/custom";
import {useDispatch, connect} from 'react-redux';
import {addToCart} from '../../../_actions/cart_actions';
import {setPaused, nextBeat, prevBeat} from '../../../_actions/playlist_actions';
import {Box, Image, IconButton, Text, Stack, ButtonGroup, Button, Slide} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {AudioContext} from "../../utils/AudioContext";
import {FaPlay, FaPause, FaStepForward, FaStepBackward, FaShoppingCart} from 'react-icons/fa';
import {IoMdDownload} from 'react-icons/io';
import styled from "@emotion/styled/macro";
import BeatPlayerProgressBar from './BeatPlayerProgressBar';
import BeatPlayerVolumeSlider from './BeatPlayerVolumeSlider';

const ProgressBarHolder = styled.div``;

function BeatPlayer(props) {
    const {audio} = useContext(AudioContext);
    const {index, show, paused, playlist, cart} = props;

    const ProgressLengthRef = useRef();
    const {width} = useContainerDimensions(ProgressLengthRef);

    const dispatch = useDispatch();

    const isBeatInCart = (beatId) => {
        return cart.some(beat => beat.item === beatId);
    }

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId, window.localStorage.getItem("cartId")));
    }

    const setPausedHandler = (bool) => {
        dispatch(setPaused(bool));
    }

    const playOrPauseAudio = () => {
        if (!audio.paused) {
            audio.pause();
            setPausedHandler(true);
        } else if (audio.paused) {
            if (!audio.src) audio.src = playlist[index].audio;
            audio.play();
            setPausedHandler(false);
        }
    }

    const playAudioInPlaylist = (i) => {
        audio.pause();
        audio.currentTime = 0;
        try {
            audio.src = playlist[i].audio;
            audio.play();
            setPausedHandler(false);
        } catch (error) {
            console.log(error);
        }
    }

    const playPrevBeat = () => {
        dispatch(prevBeat(index));
    }

    const playNextBeat = () => {
        dispatch(nextBeat(index));
    }

    useEffect(() => {
        if (index !== -1) {
            playAudioInPlaylist(index);
        }
    }, [index, playlist]);

    if (show) {
        const isInCart = isBeatInCart(playlist[index]._id);
        return (
            <Slide in={show} direction="bottom" style={{zIndex: 10}}>
                <ProgressBarHolder ref={ProgressLengthRef}>
                    <Box height={{base: "60px", md: "70px"}} bg="blue.900">
                        <Box position="absolute" display="flex" alignItems="center" justifyContent="center" m="auto" w="100%" h="100%">
                            <IconButton size="sm" isRound aria-label="Previous beat" icon={<FaStepBackward />} onClick={playPrevBeat} />
                            <IconButton ml="10px" mr="10px" isRound aria-label="Play audio" icon={paused ? <FaPlay /> : <FaPause />} onClick={playOrPauseAudio} />
                            <IconButton size="sm" isRound aria-label="Next beat" icon={<FaStepForward />} onClick={playNextBeat} />
                        </Box>
                        <BeatPlayerVolumeSlider audio={audio} />
                        <Box display="flex" alignItems="center" h="100%">
                            <Image src={playlist[index].image} boxSize={{base: "0px", sm: "60px", md: "70px"}} />
                            <Stack spacing={0} ml={5} zIndex="100">
                                <Text color="white" fontSize="md" fontWeight={{base: "700", md: "600"}}>
                                    <Link to={`/beat/${playlist[index].url}`}>
                                        {playlist[index].title}
                                    </Link>
                                </Text>
                                <Text color={{base: "gray.100", md: "white"}} fontSize="md" fontWeight="600">{playlist[index].producer}</Text>
                            </Stack>
                            <ButtonGroup spacing={4} ml={{base: "auto", md: 5}} mr={{base: 4, md: 0}}>
                                <IconButton display={{base: "none", sm: "inline-flex"}} colorScheme="blue" aria-label="Free download" icon={<IoMdDownload />} />
                                <Button
                                    leftIcon={isInCart ? null : <FaShoppingCart />}
                                    colorScheme="blue"
                                    style={{background: isInCart ? "#63b3ed" : null}}
                                    variant="solid"
                                    onClick={() => addToCartHandler(playlist[index]._id)}>
                                    {isInCart ? "IN CART" : `${playlist[index].price}`}
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                    <BeatPlayerProgressBar
                        audio={audio}
                        width={width}
                        ProgressLengthRef={ProgressLengthRef}
                        holder={ProgressBarHolder}
                        playNextBeat={playNextBeat} />
                </ProgressBarHolder>
            </Slide>
        );
    } else {
        return (<Box width="100%" ref={ProgressLengthRef}></Box>);
    }
}

const mapStateToProps = (state) => {
    return {
        show: state.playlist.show,
        index: state.playlist.index,
        paused: state.playlist.paused,
        playlist: state.playlist.playlist,
        cart: state.cart.items,
    }
}

export default connect(mapStateToProps)(BeatPlayer)
