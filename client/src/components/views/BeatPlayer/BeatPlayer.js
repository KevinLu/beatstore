import React, { useContext, useEffect } from 'react';
import { Box, Image, IconButton, Text, Stack, ButtonGroup, Button } from '@chakra-ui/core';
import { AudioContext } from "../../utils/AudioContext";
import { FaCartPlus } from 'react-icons/fa';

function BeatPlayer() {
    const { playlist, index } = useContext(AudioContext);
    const [Playlist, setPlaylist] = playlist;
    const [Index, setIndex] = index;
    const CurrentAudio = new Audio();

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
        console.log(Playlist)
    }

    return (
        <Box position="fixed" bottom="0" width="100%" height="70px" bg="blue.900">
            <Box display="flex">
                <Image src={Playlist[Index].image} size="70px" />
                <Stack spacing={0} mt="9px" ml={5}>
                    <Text color="white" fontSize="md" fontWeight="800">{Playlist[Index].title}</Text>
                    <Text color="white" fontSize="md" fontWeight="600">{Playlist[Index].producer}</Text>
                </Stack>
                <ButtonGroup spacing={4} mt="15px" ml={5}>
                    <IconButton variantColor="blue" aria-label="Free download" icon="download" />
                    <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid">
                        price
                    </Button>
                </ButtonGroup>
                <IconButton aria-label="Search database" icon="search" onClick={playAudio} />
            </Box>
        </Box>
    );
}

export default BeatPlayer
