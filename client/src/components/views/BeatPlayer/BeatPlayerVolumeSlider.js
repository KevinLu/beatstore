import React, {useState} from 'react';
import {Box, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb} from '@chakra-ui/react';
import {FaVolumeUp, FaVolumeMute} from 'react-icons/fa';

function BeatPlayerVolumeSlider(props) {
    const CurrentAudio = props.audio;
    const [Volume, setVolume] = useState(1);

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

    return (
        <Box display={{base: "none", md: "flex"}} position="absolute" right="0px" mr="2.5rem" alignItems="center" h="100%">
            <IconButton size="lg" icon={Volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />} variant="link" color="white" aria-label="Mute or unmute volume" onClick={muteOrUnmute} />
            <Box width="80px">
                <Slider min={0} max={1} step={0.02} value={Volume} defaultValue={1} onChange={handleVolumeChange}>
                    <SliderTrack />
                    <SliderFilledTrack />
                    <SliderThumb />
                </Slider>
            </Box>
        </Box>
    );
}

export default BeatPlayerVolumeSlider;
