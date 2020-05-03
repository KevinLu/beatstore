import React, { useContext, useEffect, useState } from 'react';
import { Box, Image, IconButton, Text, Stack, ButtonGroup, Button, Tooltip } from '@chakra-ui/core';
import { AudioContext } from "../../utils/AudioContext";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaCartPlus } from 'react-icons/fa';
import styled from "@emotion/styled/macro";

const ProgressBarHolder = styled.div`
`

const SongLengthBar = styled.div`
  position: fixed;
  bottom: 70px;
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

const SongProgressBar = styled.div`
  position: fixed;
  bottom: 70px;
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

const ProgressDot = styled.div`
  position: fixed;
  bottom: 70px;
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
    const { playlist, index, audio } = useContext(AudioContext);
    const [Playlist, setPlaylist] = playlist;
    const [Index, setIndex] = index;
    const [CurrentAudio, setCurrentAudio] = audio;

    const [SongProgressOffset, setSongProgressOffset] = useState("0%");
    const [SongProgressTime, setSongProgressTime] = useState("0:00");

    const secondsToTime = (e) => {
        var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(e % 60).toString().padStart(2, '0');

        return m + ':' + s;
    }

    const playAudio = () => {
        if (Playlist[Index].isPlaying) {
            CurrentAudio.pause();
            Playlist[Index].isPlaying = false;
            Playlist[Index].isPaused = true;
        } else if (Playlist[Index].isPaused) {
            CurrentAudio.play();
            Playlist[Index].isPlaying = true;
            Playlist[Index].isPaused = false;
        } else {
            CurrentAudio.src = Playlist[Index].audio;
            CurrentAudio.play();
            Playlist[Index].isPlaying = true;
            Playlist[Index].isPaused = false;
        }
    }

    const updateSongProgress = () => {
        var position = CurrentAudio.currentTime / CurrentAudio.duration;
        setSongProgressOffset((position * 100) + "%");
        setSongProgressTime(secondsToTime(CurrentAudio.currentTime));
    }

    useEffect(() => {
        CurrentAudio.addEventListener('timeupdate', () => {
            updateSongProgress();
        })
    }, []);

    return (
        <ProgressBarHolder>
            <Box position="fixed" bottom="0" width="100%" height="70px" bg="blue.900">
                <Box position="absolute" display="flex" alignItems="center" justifyContent="center" m="auto" w="100%" h="100%">
                    <IconButton size="sm" isRound aria-label="Previous beat" icon={FaStepBackward} />
                    <IconButton ml="10px" mr="10px" isRound aria-label="Play audio" icon={CurrentAudio.paused ? FaPlay : FaPause} onClick={playAudio} />
                    <IconButton size="sm" isRound aria-label="Next beat" icon={FaStepForward} />
                </Box>
                <Box display="flex" alignItems="center" w="100%" h="100%">
                    <Image src={Playlist[Index].image} size="70px" />
                    <Stack spacing={0} ml={5}>
                        <Text color="white" fontSize="md" fontWeight="800">{Playlist[Index].title}</Text>
                        <Text color="white" fontSize="md" fontWeight="600">{Playlist[Index].producer}</Text>
                    </Stack>
                    <ButtonGroup spacing={4} ml={5}>
                        <IconButton variantColor="blue" aria-label="Free download" icon="download" />
                        <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid">
                            price
                    </Button>
                    </ButtonGroup>
                </Box>
            </Box>
            <SongLengthBar />
            <SongProgressBar style={{ width: SongProgressOffset }} />
            <Tooltip hasArrow placement="top" label={SongProgressTime}>
                <ProgressDot style={{ left: SongProgressOffset }} />
            </Tooltip>
        </ProgressBarHolder>
    );
}

export default BeatPlayer
